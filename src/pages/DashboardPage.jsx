import { ShieldCheck, Link2, Mail, LockKeyhole, ArrowRight, ShieldAlert } from 'lucide-react';

export function DashboardPage({ setPage }) {
  const features = [
    {
      title: 'URL Analysis',
      description: 'Investigate URLs for suspicious indicators and domain information.',
      icon: Link2,
      page: 'url',
    },
    {
      title: 'Email Analysis',
      description: 'Examine email addresses and message content for phishing indicators.',
      icon: Mail,
      page: 'email',
    },
    {
      title: 'Password Checker',
      description: 'Evaluate password strength and identify common weaknesses.',
      icon: LockKeyhole,
      page: 'password',
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Hero Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <span className="welcome-label">PHISHGUARD PRO</span>
          <h1>
            Investigate threats.<br />
            <span>Protect digital identities.</span>
          </h1>
          <p>
            Your cybersecurity investigation dashboard for identifying suspicious URLs,
            analyzing phishing emails, and checking password strength.
          </p>
          <button className="primary-button" onClick={() => setPage('url')}>
            Start Investigation <ArrowRight size={18} />
          </button>
        </div>
        <div className="welcome-icon">
          <ShieldCheck size={100} strokeWidth={1.2} />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="page-eyebrow">SECURITY TOOLS</span>
            <h2>Investigation Center</h2>
          </div>
        </div>
        <div className="feature-grid">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.page}
                className="feature-card"
                onClick={() => setPage(f.page)}
              >
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
                <span className="feature-action">
                  Open Tool <ArrowRight size={16} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Warning notice */}
      <div className="privacy-notice">
        <div>
          <ShieldAlert size={22} />
        </div>
        <div>
          <h3>Investigate Before You Trust</h3>
          <p>
            Never enter passwords or sensitive information on suspicious websites.
            Use investigation tools as one part of your security checks.
          </p>
        </div>
      </div>
    </div>
  );
}
