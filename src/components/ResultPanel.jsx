import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import { getRiskLevel, getRiskScore, getFindings, normaliseSeverity } from '../api';
import { FindingCard } from './FindingCard';
import { DnsReport } from './DnsReport';
import { ThreatIntelligence } from './ThreatIntelligence';
import { EmailReputationReport } from './EmailReputationReport';

export function ResultPanel({ result, type }) {
  if (!result) return null;

  const score = getRiskScore(result);
  const riskLevel = getRiskLevel(result);
  const riskClass = normaliseSeverity(riskLevel);
  const findings = getFindings(result);

  const target =
    result.url ||
    result.email ||
    result.email_address ||
    result.target ||
    result.hostname ||
    'Analysis target';

  const dnsData = result.dns_intelligence || result.dns_report || result.dns || null;
  const threatData = result.threat_intelligence || result.threat_intel || null;

  return (
    <div className="result-panel">
      {/* Header */}
      <div className="section-heading">
        <div>
          <span className="page-eyebrow">INVESTIGATION COMPLETE</span>
          <h2>Analysis Results</h2>
        </div>
        <div className="score-icon">
          {riskClass === 'high' ? <ShieldAlert size={25} /> : <ShieldCheck size={25} />}
        </div>
      </div>

      {/* Target */}
      <div className="analyzed-target">
        <span>Analyzed Target</span>
        <strong>{target}</strong>
        {result.investigation_id !== undefined && (
          <p>Investigation ID: #{result.investigation_id}</p>
        )}
      </div>

      {/* Score Card */}
      <div className="result-score-card">
        <div className="score-label">
          <div>
            <span>Threat Assessment</span>
            <h3>{riskLevel} Risk</h3>
          </div>
          <span className={`status-badge status-${riskClass}`}>{riskLevel}</span>
        </div>
        <div className="score-icon" style={{ alignSelf: 'flex-end' }}>
          {riskClass === 'high' ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
        </div>
        <div className="score-progress" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
          <div className="score-progress-fill" style={{ width: `${score}%` }} />
        </div>
        <p>Risk score: <strong>{score}/100</strong></p>
        <p>{result.message || result.summary || 'Review the findings below to understand the indicators identified during this investigation.'}</p>
        <div className="result-type">
          <Activity size={17} />
          <span>{findings.length} finding{findings.length === 1 ? '' : 's'} identified</span>
        </div>
      </div>

      {/* Findings */}
      <div className="findings-section">
        <div className="section-heading">
          <div>
            <span className="page-eyebrow">INVESTIGATION DETAILS</span>
            <h3>Analysis Findings</h3>
          </div>
          <span className="findings-count">{findings.length}/{findings.length} checks</span>
        </div>
        {findings.length > 0 ? (
          <div className="findings-list">
            {findings.map((f, i) => (
              <FindingCard
                key={f.id || `${f.name || f.title || 'finding'}-${i}`}
                finding={f}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="empty-result">
            <ShieldCheck size={22} style={{ color: '#4ade80' }} />
            <p>No findings were returned by the analyzer.</p>
          </div>
        )}
      </div>

      {/* DNS & Threat Intel for URL */}
      {type === 'url' && (
        <>
          <DnsReport dnsData={dnsData} />
          {threatData && <ThreatIntelligence data={threatData} />}
        </>
      )}

      {/* Email Address: Reputation + DNS + Threat Intel */}
      {type === 'email-address' && (
        <>
          <EmailReputationReport data={result.reputation_intelligence} />
          {dnsData && <DnsReport dnsData={dnsData} />}
          {threatData && <ThreatIntelligence data={threatData} />}
        </>
      )}

      {/* Disclaimer */}
      <div className="result-disclaimer">
        <ShieldCheck size={19} style={{ color: '#6366f1' }} />
        <p>
          <strong>Important: </strong>
          {result.disclaimer ||
            'This analysis provides indicators for investigation. It cannot guarantee that a URL or email is safe or malicious. Verify suspicious findings before taking action.'}
        </p>
      </div>
    </div>
  );
}
