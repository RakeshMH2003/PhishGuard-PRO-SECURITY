import express from 'express';
import cors from 'cors';
import dns from 'node:dns/promises';
import { URL } from 'node:url';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Known disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', '10minutemail.com', 'tempmail.com', 'guerrillamail.com',
  'sharklasers.com', 'dispostable.com', 'throwawaymail.com', 'getairmail.com',
  'yopmail.com', 'trashmail.com', 'fakemailgenerator.com'
]);

// Known reputable / safe domains
const SAFE_DOMAINS = new Set([
  'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'github.com',
  'paypal.com', 'netflix.com', 'facebook.com', 'twitter.com', 'linkedin.com',
  'cloudflare.com', 'verisign.com', 'iana.org', 'wikipedia.org'
]);

// Common targeted brands for impersonation
const TARGET_BRANDS = [
  'paypal', 'google', 'apple', 'microsoft', 'amazon', 'netflix', 'facebook',
  'instagram', 'whatsapp', 'chase', 'wellsfargo', 'bankofamerica', 'citibank',
  'dropbox', 'adobe', 'binance', 'coinbase', 'outlook', 'yahoo'
];

// Suspicious URL keywords
const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'account', 'update',
  'banking', 'confirm', 'security', 'wallet', 'recover', 'billing', 'invoice',
  'auth', 'password', 'credential', 'support', 'portal', 'alert'
];

// Helper: Safely resolve DNS records
async function getDnsIntelligence(hostname) {
  const result = {
    available: true,
    hostname,
    ip_addresses: [],
    ipv6_addresses: [],
    mx_records: [],
    nameservers: [],
    findings: []
  };

  try {
    const ipv4 = await dns.resolve4(hostname).catch(() => []);
    result.ip_addresses = ipv4;
    if (ipv4.length === 0) {
      result.findings.push({
        name: 'IPv4 DNS Records',
        severity: 'informational',
        status: 'warning',
        evidence: 'No IPv4 address was retrieved.'
      });
    }
  } catch (e) {
    result.findings.push({
      name: 'IPv4 DNS Records',
      severity: 'informational',
      status: 'warning',
      evidence: 'No IPv4 address was retrieved.'
    });
  }

  try {
    const ipv6 = await dns.resolve6(hostname).catch(() => []);
    result.ipv6_addresses = ipv6;
  } catch (e) {}

  try {
    const mx = await dns.resolveMx(hostname).catch(() => []);
    result.mx_records = mx.map(m => `${m.priority} ${m.exchange}`);
    if (result.mx_records.length === 0) {
      result.findings.push({
        name: 'Mail Server Records',
        severity: 'informational',
        status: 'info',
        evidence: 'No MX records were retrieved.'
      });
    }
  } catch (e) {}

  try {
    const ns = await dns.resolveNs(hostname).catch(() => []);
    result.nameservers = ns;
    if (ns.length === 0) {
      result.findings.push({
        name: 'Name Server Records',
        severity: 'informational',
        status: 'warning',
        evidence: 'No NS records were retrieved.'
      });
    }
  } catch (e) {}

  return result;
}

// 1. POST /api/analyze-url
app.post('/api/analyze-url', async (req, res) => {
  try {
    let { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter a URL to analyze.' });
    }

    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid URL format.' });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const findings = [];
    let riskScore = 0;

    // Check 1: Protocol
    if (parsedUrl.protocol === 'http:') {
      riskScore += 10;
      findings.push({
        name: 'HTTPS',
        severity: 'low',
        status: 'warning',
        points: 5,
        evidence: 'The URL uses HTTP instead of HTTPS.',
        recommendation: 'Avoid sending sensitive information over unencrypted connections.'
      });
    } else {
      findings.push({
        name: 'HTTPS',
        severity: 'informational',
        status: 'info',
        points: 0,
        evidence: 'The URL uses HTTPS.',
        recommendation: 'HTTPS encrypts traffic but does not prove that a website is trustworthy.'
      });
    }

    // Check 2: Suspicious keywords
    const lowerUrl = url.toLowerCase();
    const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(k => lowerUrl.includes(k));
    if (matchedKeywords.length > 0) {
      const pts = Math.min(25, matchedKeywords.length * 5);
      riskScore += pts;
      findings.push({
        name: 'Suspicious Keywords',
        severity: pts > 15 ? 'medium' : 'low',
        status: 'warning',
        points: pts,
        evidence: `Matched terms: ${matchedKeywords.slice(0, 6).join(', ')}`,
        recommendation: 'These words can occur on legitimate websites too.'
      });
    }

    // Check 3: Brand Impersonation
    const impersonated = TARGET_BRANDS.filter(brand => {
      return hostname.includes(brand) && !hostname.endsWith(`.${brand}.com`) && hostname !== `${brand}.com`;
    });
    if (impersonated.length > 0) {
      riskScore += 25;
      findings.push({
        name: 'Possible Brand Impersonation',
        severity: 'medium',
        status: 'warning',
        points: 20,
        evidence: `Brand-like text appears within a hostname label: ${impersonated.join(', ')}`,
        recommendation: "Compare the domain with the organization's official domain."
      });
    }

    // Check 4: Hyphen count in hostname
    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount >= 2) {
      riskScore += 10;
      findings.push({
        name: 'Multiple Hostname Hyphens',
        severity: 'low',
        status: 'info',
        points: 5,
        evidence: `The hostname contains ${hyphenCount} hyphens.`,
        recommendation: 'Check whether the hostname imitates a known organization.'
      });
    }

    // Check 5: IP address as hostname
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      riskScore += 30;
      findings.push({
        name: 'IP Address Hostname',
        severity: 'high',
        status: 'failed',
        points: 25,
        evidence: 'The URL uses a raw IP address instead of a domain name.',
        recommendation: 'Legitimate services rarely use direct IP addresses for client portals.'
      });
    }

    // DNS Intelligence
    const dnsData = await getDnsIntelligence(hostname);

    // Calculate overall risk level
    riskScore = Math.min(100, riskScore);
    const riskLevel = riskScore >= 60 ? 'High' : riskScore >= 25 ? 'Medium' : 'Low';

    return res.json({
      success: true,
      url,
      hostname,
      risk_score: riskScore,
      risk_level: riskLevel,
      finding_count: findings.length,
      findings,
      dns_intelligence: dnsData,
      threat_intelligence: {
        available: true,
        provider: 'OpenPhish Heuristics',
        known_phishing: riskScore >= 70,
        message: riskScore >= 70 
          ? 'Multiple high-confidence phishing indicators match known phishing patterns.' 
          : 'This URL was not found in active threat intelligence blacklists.',
        status: riskScore >= 70 ? 'suspicious' : 'clean',
        target_brand: impersonated[0] || null
      },
      disclaimer: 'This result combines heuristic URL indicators with an available threat-intelligence lookup. A URL not found in the database is not necessarily safe. A low score does not prove that a URL is safe.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Analysis failed.' });
  }
});

// 2. POST /api/analyze-email-address
app.post('/api/analyze-email-address', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter an email address.' });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/;
    const match = emailTrimmed.match(emailRegex);

    if (!match) {
      return res.status(400).json({ success: false, error: 'Invalid email address format.' });
    }

    const domain = match[1];
    const username = emailTrimmed.split('@')[0];
    const findings = [];
    let riskScore = 0;

    const roleKeywords = ['support', 'admin', 'administrator', 'contact', 'info', 'billing', 'sales', 'security', 'help', 'no-reply', 'noreply'];
    const isRole = roleKeywords.includes(username);
    if (isRole) {
      riskScore += 5;
      findings.push({
        name: 'Role-Based Email Address',
        severity: 'low',
        points: 5,
        evidence: 'This may be a shared address, such as support@ or admin@.',
        recommendation: 'Check whether a shared address is appropriate.'
      });
    }

    const isDisposable = DISPOSABLE_DOMAINS.has(domain);
    if (isDisposable) {
      riskScore += 60;
      findings.push({
        name: 'Disposable Email Address',
        severity: 'high',
        points: 60,
        evidence: 'This address belongs to a domain identified as a disposable or temporary email provider.',
        recommendation: 'Verify the address carefully before trusting it.'
      });
    }

    const isSafeDomain = SAFE_DOMAINS.has(domain);

    const dnsData = await getDnsIntelligence(domain);

    riskScore = Math.min(100, riskScore);
    const riskLevel = riskScore >= 50 ? 'High' : riskScore >= 20 ? 'Medium' : 'Low';

    return res.json({
      success: true,
      analysis_type: 'email-address',
      email_address: emailTrimmed,
      domain,
      risk_score: riskScore,
      risk_level: riskLevel,
      finding_count: findings.length,
      findings,
      reputation_intelligence: {
        available: true,
        provider: 'FFraud Intelligence',
        email: emailTrimmed,
        domain,
        valid_format: true,
        is_disposable: isDisposable,
        is_known_spammer: isDisposable,
        is_role_address: isRole,
        community_blacklisted: isDisposable,
        safe_domain: isSafeDomain,
        detection_source: isSafeDomain ? 'safe_domain' : (isDisposable ? 'database' : 'heuristic'),
        blacklist_reports: isDisposable ? 1 : 0
      },
      dns_intelligence: dnsData,
      disclaimer: 'This analysis uses third-party email reputation indicators. A clean result does not prove that an address or its owner is trustworthy.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Email analysis failed.' });
  }
});

// 3. POST /api/analyze-email
app.post('/api/analyze-email', async (req, res) => {
  try {
    const { email_text } = req.body;
    if (!email_text || typeof email_text !== 'string' || !email_text.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter email content to analyze.' });
    }

    const text = email_text.trim();
    const lower = text.toLowerCase();
    const findings = [];
    let riskScore = 0;

    // Urgency check
    const urgencyKeywords = ['urgent', 'immediately', 'within 24 hours', 'within 48 hours', 'suspended', 'action required', 'act now', 'expires soon', 'unauthorized access'];
    const matchedUrgency = urgencyKeywords.filter(k => lower.includes(k));
    if (matchedUrgency.length > 0) {
      riskScore += 20;
      findings.push({
        title: 'Urgent Language',
        name: 'Urgent Language',
        severity: 'medium',
        points: 15,
        evidence: matchedUrgency.join(', '),
        description: 'The message uses urgency that may pressure the recipient.',
        recommendation: 'Legitimate organizations rarely demand instant action under threat of immediate termination.'
      });
    }

    // Credential / Financial check
    const credKeywords = ['password', 'login', 'credit card', 'ssn', 'social security', 'verify your identity', 'bank account', 'update payment', 'billing information'];
    const matchedCred = credKeywords.filter(k => lower.includes(k));
    if (matchedCred.length > 0) {
      riskScore += 25;
      findings.push({
        title: 'Credential-Related Language',
        name: 'Credential-Related Language',
        severity: 'high',
        points: 25,
        evidence: matchedCred.join(', '),
        description: 'The message mentions passwords, account verification, or sensitive authentication information.',
        recommendation: 'Never provide credentials or banking details in response to an unsolicited email.'
      });
    }

    // Extract URLs
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const extractedUrls = (text.match(urlRegex) || []).map(u => {
      let hostname = 'unknown';
      try { hostname = new URL(u).hostname; } catch {}
      const indicators = [];
      if (u.startsWith('http://')) indicators.push('Uses unencrypted HTTP');
      return { url: u, hostname, indicators };
    });

    if (extractedUrls.length > 0) {
      const suspiciousLinks = extractedUrls.filter(u => u.indicators.length > 0 || TARGET_BRANDS.some(b => u.hostname.includes(b)));
      if (suspiciousLinks.length > 0) {
        riskScore += 25;
        findings.push({
          title: 'Suspicious URL Patterns',
          name: 'Suspicious URL Patterns',
          severity: 'high',
          points: 25,
          evidence: suspiciousLinks.map(s => `${s.url}: ${s.indicators.join(', ') || 'Suspicious domain'}`).join('; '),
          description: 'One or more links contain URL patterns that warrant investigation.',
          recommendation: 'Verify links carefully by inspecting the actual destination before clicking.'
        });
      }
    }

    riskScore = Math.min(100, riskScore);
    const riskLevel = riskScore >= 50 ? 'High' : riskScore >= 20 ? 'Medium' : 'Low';

    return res.json({
      success: true,
      analysis_type: 'email',
      risk_score: riskScore,
      risk_level: riskLevel,
      finding_count: findings.length,
      findings,
      extracted_urls: extractedUrls,
      email_authentication: {
        authentication_results_provided: false,
        received_spf_provided: false,
        reported_failures: []
      },
      sender_information: {
        from: null,
        reply_to: null,
        return_path: null
      },
      recommendations: [
        'Do not click unexpected links or open suspicious attachments.',
        'Verify the sender through a trusted contact method.',
        'Never share passwords or one-time codes through an email link.',
        'Review the original email headers when available.',
        'Treat this score as a screening result, not a definitive verdict.'
      ],
      disclaimer: 'This analysis uses heuristic text, URL, and optional header checks. It is not a verified probability of phishing. Missing indicators do not prove an email is safe, and header results are only as trustworthy as the supplied original message.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Email content analysis failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`PhishGuard Pro backend server running on port ${PORT}`);
});
