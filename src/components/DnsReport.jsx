import { Globe, TriangleAlert } from 'lucide-react';

export function DnsReport({ dnsData }) {
  if (!dnsData) {
    return (
      <section className="dns-report">
        <div className="dns-report-header">
          <div>
            <span className="page-eyebrow">DOMAIN INTELLIGENCE</span>
            <h2>DNS Report</h2>
            <p>DNS information was not included in the backend response.</p>
          </div>
          <div className="dns-report-icon">
            <Globe size={24} />
          </div>
        </div>
      </section>
    );
  }

  const recordTypes = [
    { key: 'ip_addresses', label: 'IPv4 Addresses', type: 'A' },
    { key: 'ipv6_addresses', label: 'IPv6 Addresses', type: 'AAAA' },
    { key: 'mx_records', label: 'Mail Exchange Records', type: 'MX' },
    { key: 'nameservers', label: 'Nameservers', type: 'NS' },
  ];

  function getRecords(key) {
    const val = dnsData[key];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim()) return [val];
    return [];
  }

  return (
    <section className="dns-report">
      <div className="dns-report-header">
        <div>
          <span className="page-eyebrow">DOMAIN INTELLIGENCE</span>
          <h2>DNS Report</h2>
          <p>Domain infrastructure information</p>
        </div>
        <div className="dns-report-icon">
          <Globe size={24} />
        </div>
      </div>

      <div className="dns-hostname">
        <span>Hostname</span>
        <strong>{dnsData.hostname || 'Unknown'}</strong>
      </div>

      <div className="dns-record-grid">
        {recordTypes.map((rt) => {
          const records = getRecords(rt.key);
          return (
            <div className="dns-record-card" key={rt.key}>
              <div className="dns-record-card-heading">
                <span className="dns-record-type">{rt.type}</span>
                <h3>{rt.label}</h3>
              </div>
              {records.length > 0 ? (
                <ul className="dns-record-list">
                  {records.map((r, i) => (
                    <li key={`${rt.key}-${i}`}>
                      <code>{typeof r === 'object' ? JSON.stringify(r) : String(r)}</code>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dns-empty-value">
                  {dnsData.available === false ? 'Lookup unavailable for this target.' : 'None found'}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {Array.isArray(dnsData.findings) && (
        <div className="dns-findings">
          <h3>DNS Findings</h3>
          {dnsData.findings.length > 0 ? (
            dnsData.findings.map((f, i) => (
              <div className="dns-finding-item" key={`${f.name || 'finding'}-${i}`}>
                <TriangleAlert size={17} />
                <div>
                  <strong>{f.name || 'DNS Finding'}</strong>
                  <p>{f.evidence || f.message || f.description || 'No additional details are available.'}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No DNS findings were returned.</p>
          )}
        </div>
      )}

      <p className="dns-report-note">
        DNS records provide technical information about a domain. Missing records do not automatically mean that a website is malicious, and DNS records alone cannot establish trustworthiness.
      </p>
    </section>
  );
}
