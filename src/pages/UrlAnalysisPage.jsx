import { useState } from 'react';
import { Link2, Search, LoaderCircle, CircleX } from 'lucide-react';
import { apiPost } from '../api';
import { ResultPanel } from '../components/ResultPanel';

export function UrlAnalysisPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL to analyze.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiPost('/analyze-url', { url: trimmed });
      setResult(data);
    } catch (err) {
      setError(err.message || 'The URL analysis request failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="analysis-page">
      {/* Header */}
      <div className="page-header">
        <span className="page-eyebrow">INVESTIGATION TOOL</span>
        <h1>URL Analysis</h1>
        <p>Investigate a URL and review its security indicators, threat information, and DNS records.</p>
      </div>

      <div className="analysis-layout">
        {/* Form Panel */}
        <section className="analysis-form-panel">
          <div className="form-panel-heading">
            <div className="form-panel-icon">
              <Link2 size={23} />
            </div>
            <div>
              <h2>Investigate a URL</h2>
              <p>Enter the full URL you want to examine.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="url-input">Target URL</label>
              <div className="input-with-icon">
                <Link2 size={19} />
                <input
                  id="url-input"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              className="primary-button analyze-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="spin-icon" />
                  Analyzing URL...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Analyze URL
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <CircleX size={19} />
              <p>{error}</p>
            </div>
          )}

          <p className="form-safety-note">
            Only analyze URLs you are authorized to investigate. A security analysis does not guarantee a website is safe.
          </p>
        </section>

        {/* Results Area */}
        <div>
          {result ? (
            <ResultPanel result={result} type="url" />
          ) : (
            <section className="result-panel empty-result">
              <Search size={28} />
              <h3>Analysis Results</h3>
              <p>
                Enter a URL and start an investigation to view its risk assessment, findings,
                DNS information, and available threat intelligence.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
