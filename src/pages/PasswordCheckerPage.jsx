import { useState } from 'react';
import {
  LockKeyhole, Eye, EyeOff, ShieldCheck, ShieldAlert,
  CircleCheckBig, CircleX, RefreshCw, ShieldAlert as ShieldAlertIcon
} from 'lucide-react';

const CHECKS = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'At least 12 characters (recommended)', test: (p) => p.length >= 12 },
  { label: 'Contains uppercase letters (A–Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letters (a–z)', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains numbers (0–9)', test: (p) => /[0-9]/.test(p) },
  { label: 'Contains special characters', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password, passedCount) {
  if (password.length === 0) return { label: 'Enter a password', slug: 'unknown', score: 0 };
  const pct = Math.round((passedCount / CHECKS.length) * 100);
  if (password.length < 8) return { label: 'Very Weak', slug: 'very-weak', score: pct };
  if (passedCount <= 3) return { label: 'Weak', slug: 'weak', score: pct };
  if (passedCount === 4) return { label: 'Medium', slug: 'medium', score: pct };
  if (passedCount === 5) return { label: 'Strong', slug: 'strong', score: pct };
  return { label: 'Very Strong', slug: 'very-strong', score: pct };
}

export function PasswordCheckerPage() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const checks = CHECKS.map((c) => ({ ...c, passed: password.length > 0 && c.test(password) }));
  const passedCount = checks.filter((c) => c.passed).length;
  const strength = getStrength(password, passedCount);
  const isStrong = strength.slug === 'strong' || strength.slug === 'very-strong';

  function reset() {
    setPassword('');
    setShowPw(false);
  }

  return (
    <div className="page-content password-checker-page">
      {/* Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">PASSWORD SECURITY</span>
          <h1>Password Strength Checker</h1>
          <p>Evaluate password complexity and learn how to improve it.</p>
        </div>
      </div>

      <section className="panel password-checker-panel">
        {/* Intro */}
        <div className="password-checker-intro">
          <div className="form-intro-icon">
            <LockKeyhole size={25} />
          </div>
          <h3>Check Your Password</h3>
          <p>
            Enter a password to evaluate its length and character variety. Your password is
            checked locally in this browser.
          </p>
        </div>

        {/* Input */}
        <div className="password-input-group">
          <label htmlFor="password-checker-input">Password</label>
          <div className="password-input-wrapper">
            <LockKeyhole size={19} />
            <input
              id="password-checker-input"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password to check"
              autoComplete="new-password"
              spellCheck="false"
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          <p className="form-hint">
            For privacy, use a sample password rather than a password you currently use for an important account.
          </p>
        </div>

        {/* Strength Card */}
        {password.length > 0 && (
          <>
            <div className={`password-strength-card strength-${strength.slug}`}>
              <div className="password-strength-heading">
                <div className="password-strength-icon">
                  {isStrong ? <ShieldCheck size={23} /> : <ShieldAlert size={23} />}
                </div>
                <div>
                  <span>Estimated Password Strength</span>
                  <h2>{strength.label}</h2>
                </div>
                <strong>{strength.score}%</strong>
              </div>

              <div
                className="password-strength-track"
                role="progressbar"
                aria-label="Password complexity checks passed"
                aria-valuenow={strength.score}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="password-strength-fill"
                  style={{ width: `${strength.score}%` }}
                />
              </div>

              <p>
                This estimate measures basic complexity rules. It does not guarantee that a password
                is difficult to guess or has never been exposed in a data breach.
              </p>
            </div>

            {/* Checklist */}
            <div className="password-checklist">
              <div className="section-heading">
                <div>
                  <h3>Security Checklist</h3>
                  <p>Review the password characteristics below.</p>
                </div>
                <span className="findings-count">{passedCount}/{checks.length} checks</span>
              </div>
              <div className="password-checklist-items">
                {checks.map((c) => (
                  <div className="password-check-item" key={c.label}>
                    {c.passed
                      ? <CircleCheckBig size={19} style={{ color: '#4ade80' }} />
                      : <CircleX size={19} style={{ color: '#f87171' }} />
                    }
                    <span>{c.label}</span>
                    <strong style={{ color: c.passed ? '#4ade80' : '#f87171' }}>
                      {c.passed ? 'Passed' : 'Not met'}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="password-recommendations">
              <h3>Recommendations</h3>
              <ul>
                {password.length < 12 && (
                  <li>Use at least 12 characters, preferably a longer, randomly generated password.</li>
                )}
                {!/[A-Z]/.test(password) && (
                  <li>Consider including uppercase letters.</li>
                )}
                {!/[a-z]/.test(password) && (
                  <li>Include lowercase letters if appropriate.</li>
                )}
                {!/[0-9]/.test(password) && (
                  <li>Consider including numbers.</li>
                )}
                {!/[^A-Za-z0-9]/.test(password) && (
                  <li>Consider including special characters.</li>
                )}
                {passedCount === checks.length && (
                  <li>All basic complexity checks passed. Prefer a unique password generated by a trusted password manager.</li>
                )}
                <li>Avoid personal information, predictable patterns, and passwords reused across different accounts.</li>
              </ul>
            </div>

            <button
              type="button"
              className="secondary-button password-reset-button"
              onClick={reset}
            >
              <RefreshCw size={16} />
              Check Another Password
            </button>
          </>
        )}

        {/* Empty State */}
        {!password && (
          <div className="password-empty-state">
            <ShieldCheck size={30} style={{ color: '#3d5280' }} />
            <h3>Ready to Check</h3>
            <p>Enter a sample password above to see its complexity checks and recommendations.</p>
          </div>
        )}
      </section>

      {/* Disclaimer */}
      <div className="disclaimer-box" style={{ marginTop: '20px' }}>
        <ShieldCheck size={20} style={{ color: '#6366f1' }} />
        <div>
          <strong>Privacy Notice</strong>
          <p>
            This checker evaluates the password in your browser. It does not make an API request or
            save the password to investigation history. Its strength rating is a basic estimate,
            not a guarantee of security.
          </p>
        </div>
      </div>
    </div>
  );
}
