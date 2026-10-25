import { ShieldCheck } from 'lucide-react';

const EMAIL_FIELDS = [
  {
    key: 'valid_format',
    title: 'Email Format Validity',
    positiveWhenTrue: true,
    description: 'Whether the service considers the email format valid.',
  },
  {
    key: 'is_disposable',
    title: 'Disposable Email Detection',
    positiveWhenTrue: false,
    description: 'Whether the address uses a disposable email provider.',
  },
  {
    key: 'is_known_spammer',
    title: 'Known Spammer Status',
    positiveWhenTrue: false,
    description: 'Whether the service flags the address as a known spammer.',
  },
  {
    key: 'community_blacklisted',
    title: 'Community Blacklist Status',
    positiveWhenTrue: false,
    description: 'Whether the service reports a community blacklist match.',
  },
  {
    key: 'safe_domain',
    title: 'Domain Safety',
    positiveWhenTrue: true,
    description: 'The domain safety indicator returned by the service.',
  },
  {
    key: 'is_role_address',
    title: 'Role-Based Address',
    positiveWhenTrue: false,
    description: 'Whether the address may represent a shared mailbox.',
  },
];

function getBadge(value, positiveWhenTrue) {
  if (value == null || value === '') return { label: 'Unknown', className: 'unknown' };
  if (typeof value === 'boolean') {
    return {
      label: value ? (positiveWhenTrue ? 'Valid / Yes' : 'Detected') : (positiveWhenTrue ? 'Invalid / No' : 'Not Detected'),
      className: value === positiveWhenTrue ? 'low' : 'high',
    };
  }
  return { label: String(value), className: 'unknown' };
}

export function EmailReputationReport({ data }) {
  if (!data) {
    return (
      <section className="dns-report email-reputation-report">
        <div className="dns-report-header">
          <div>
            <span className="page-eyebrow">EMAIL INTELLIGENCE</span>
            <h2>Email Reputation Report</h2>
            <p>Reputation information was not returned by the backend.</p>
          </div>
          <div className="dns-report-icon">
            <ShieldCheck size={24} />
          </div>
        </div>
      </section>
    );
  }

  const blacklistReports = data.blacklist_reports;
  const hasBlacklist = blacklistReports != null && blacklistReports !== '';

  return (
    <section className="dns-report email-reputation-report">
      <div className="dns-report-header">
        <div>
          <span className="page-eyebrow">EMAIL INTELLIGENCE</span>
          <h2>Email Reputation Report</h2>
          <p>Reputation indicators returned by {data.provider || 'the external reputation service'}.</p>
        </div>
        <div className="dns-report-icon">
          <ShieldCheck size={24} />
        </div>
      </div>

      <div className="dns-record-grid">
        {EMAIL_FIELDS.map((field) => {
          const badge = getBadge(data[field.key], field.positiveWhenTrue);
          return (
            <div className="dns-record-card" key={field.key}>
              <div className="dns-record-card-heading">
                <span className="dns-record-type">EMAIL</span>
                <h3>{field.title}</h3>
              </div>
              <span className={`status-badge status-${badge.className}`}>{badge.label}</span>
              <p>{field.description}</p>
            </div>
          );
        })}
      </div>

      <div className="dns-hostname">
        <span>Email Domain</span>
        <strong>{data.domain || 'Unknown'}</strong>
      </div>

      <div className="dns-hostname">
        <span>Detection Source</span>
        <strong>
          {data.detection_source === 'safe_domain' ? 'Safe Domain Check' : data.detection_source || 'Not available'}
        </strong>
      </div>

      <div className="dns-hostname">
        <span>Blacklist Reports</span>
        <strong>{hasBlacklist ? String(blacklistReports) : 'Not available'}</strong>
      </div>

      <p className="dns-report-note">
        These results depend on the information returned by the reputation service. Unknown results do not mean safe. A clean reputation result cannot guarantee trustworthiness, and a blacklist match alone does not prove malicious activity.
      </p>
    </section>
  );
}
