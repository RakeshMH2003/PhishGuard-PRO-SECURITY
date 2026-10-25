import { ShieldAlert } from 'lucide-react';

export function ThreatIntelligence({ data }) {
  if (!data) return null;

  const entries = typeof data === 'object' && data ? Object.entries(data) : [];

  function formatKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function formatValue(val) {
    if (val == null || val === '') return 'Not available';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    return String(val);
  }

  return (
    <section className="dns-report">
      <div className="dns-report-header">
        <div>
          <span className="page-eyebrow">THREAT INTELLIGENCE</span>
          <h2>Threat Intelligence Results</h2>
          <p>External threat indicator information</p>
        </div>
        <div className="dns-report-icon">
          <ShieldAlert size={24} />
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="dns-record-grid">
          {entries.map(([key, val]) => (
            <div className="dns-record-card" key={key}>
              <div className="dns-record-card-heading">
                <span className="dns-record-type">TI</span>
                <h3>{formatKey(key)}</h3>
              </div>
              {typeof val === 'object' && val && !Array.isArray(val) ? (
                <ul className="dns-record-list">
                  {Object.entries(val).map(([k, v]) => (
                    <li key={k}>
                      <strong>{formatKey(k)}:</strong> <code>{formatValue(v)}</code>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{formatValue(val)}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No threat intelligence information was returned.</p>
      )}

      <p className="dns-report-note">
        No match in a threat intelligence database does not guarantee that a URL is safe.
      </p>
    </section>
  );
}
