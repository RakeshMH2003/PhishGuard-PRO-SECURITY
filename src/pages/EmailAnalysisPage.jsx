import { useState } from 'react';
import { Mail, Search, LoaderCircle, CircleX } from 'lucide-react';
import { apiPost } from '../api';
import { ResultPanel } from '../components/ResultPanel';

export function EmailAnalysisPage() {
  const [activeTab, setActiveTab] = useState('address');

  // Email Address state
  const [emailAddr, setEmailAddr] = useState('');
  const [addrResult, setAddrResult] = useState(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState('');

  // Email Content state
  const [emailContent, setEmailContent] = useState('');
  const [contentResult, setContentResult] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState('');

  async function handleAddressSubmit(e) {
    e.preventDefault();
    setAddrError('');
    setAddrResult(null);
    const trimmed = emailAddr.trim();
    if (!trimmed) {
      setAddrError('Please enter an email address.');
      return;
    }
    setAddrLoading(true);
    try {
      const data = await apiPost('/analyze-email-address', { email: trimmed });
      setAddrResult(data);
    } catch (err) {
      setAddrError(err.message || 'Email address analysis failed.');
    } finally {
      setAddrLoading(false);
    }
  }

  async function handleContentSubmit(e) {
    e.preventDefault();
    setContentError('');
    setContentResult(null);
    const trimmed = emailContent.trim();
    if (!trimmed) {
      setContentError('Please enter email content to analyze.');
      return;
    }
    setContentLoading(true);
    try {
      const data = await apiPost('/analyze-email', { email_text: trimmed });
      setContentResult(data);
    } catch (err) {
      setContentError(err.message || 'Email content analysis failed.');
    } finally {
      setContentLoading(false);
    }
  }

  return (
    <div className="analysis-page">
      {/* Header */}
      <div className="page-header">
        <span className="page-eyebrow">INVESTIGATION TOOL</span>
        <h1>Email Analysis</h1>
        <p>Investigate suspicious email addresses and examine email messages for phishing indicators.</p>
      </div>

      {/* Tabs */}
      <div className="email-analysis-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          id="email-address-tab"
          aria-selected={activeTab === 'address'}
          className={`email-analysis-tab ${activeTab === 'address' ? 'active' : ''}`}
          onClick={() => setActiveTab('address')}
        >
          <Mail size={19} />
          Email Address Analysis
        </button>
        <button
          type="button"
          role="tab"
          id="email-content-tab"
          aria-selected={activeTab === 'content'}
          className={`email-analysis-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <Search size={19} />
          Email Content Analysis
        </button>
      </div>

      {/* Email Address Tab */}
      {activeTab === 'address' && (
        <div className="analysis-layout" role="tabpanel" aria-labelledby="email-address-tab">
          <section className="analysis-form-panel">
            <div className="form-panel-heading">
              <div className="form-panel-icon">
                <Mail size={23} />
              </div>
              <div>
                <h2>Investigate an Email Address</h2>
                <p>Enter the sender address you want to investigate.</p>
              </div>
            </div>

            <form onSubmit={handleAddressSubmit}>
              <div>
                <label htmlFor="email-address-input">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={19} />
                  <input
                    id="email-address-input"
                    type="email"
                    value={emailAddr}
                    onChange={(e) => setEmailAddr(e.target.value)}
                    placeholder="security@example.com"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="primary-button analyze-button"
                disabled={addrLoading}
              >
                {addrLoading ? (
                  <>
                    <LoaderCircle size={18} className="spin-icon" />
                    Investigating Address...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Analyze Email Address
                  </>
                )}
              </button>
            </form>

            {addrError && (
              <div className="error-message">
                <CircleX size={19} />
                <p>{addrError}</p>
              </div>
            )}

            <p className="form-safety-note">
              Address analysis can inspect domain configuration and available reputation indicators.
              It cannot independently confirm mailbox ownership.
            </p>
          </section>

          <div>
            {addrResult ? (
              <ResultPanel result={addrResult} type="email-address" />
            ) : (
              <section className="result-panel empty-result">
                <Mail size={28} />
                <h3>Address Analysis Results</h3>
                <p>
                  Enter an email address to investigate its domain configuration and
                  available security indicators.
                </p>
              </section>
            )}
          </div>
        </div>
      )}

      {/* Email Content Tab */}
      {activeTab === 'content' && (
        <div className="analysis-layout" role="tabpanel" aria-labelledby="email-content-tab">
          <section className="analysis-form-panel">
            <div className="form-panel-heading">
              <div className="form-panel-icon">
                <Search size={23} />
              </div>
              <div>
                <h2>Investigate Email Content</h2>
                <p>Paste the suspicious message below.</p>
              </div>
            </div>

            <form onSubmit={handleContentSubmit}>
              <div>
                <label htmlFor="email-content-input">Email Content</label>
                <textarea
                  id="email-content-input"
                  className="email-textarea"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Paste the suspicious email message here..."
                  rows={8}
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button analyze-button"
                disabled={contentLoading}
              >
                {contentLoading ? (
                  <>
                    <LoaderCircle size={18} className="spin-icon" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Analyze Email Content
                  </>
                )}
              </button>
            </form>

            {contentError && (
              <div className="error-message">
                <CircleX size={19} />
                <p>{contentError}</p>
              </div>
            )}

            <p className="form-safety-note">
              Remove passwords, private information, and other sensitive data before submitting email content.
            </p>
          </section>

          <div>
            {contentResult ? (
              <ResultPanel result={contentResult} type="email" />
            ) : (
              <section className="result-panel empty-result">
                <Mail size={28} />
                <h3>Content Analysis Results</h3>
                <p>
                  Submit email content to view the risk assessment and phishing indicators
                  returned by the analyzer.
                </p>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
