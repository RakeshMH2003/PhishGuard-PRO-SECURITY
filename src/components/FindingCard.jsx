import { normaliseSeverity, getSeverityClass } from '../api';
import { TriangleAlert, CircleCheck } from 'lucide-react';

/** Small coloured badge showing the severity of a finding */
export function StatusBadge({ finding }) {
  const raw = getSeverityClass(finding);
  const norm = normaliseSeverity(raw);
  return (
    <span className={`status-badge status-${norm}`}>
      {raw}
    </span>
  );
}

/** Finding card used in the results panel */
export function FindingCard({ finding, index }) {
  const raw = getSeverityClass(finding);
  const isSafe = ['low', 'safe', 'secure', 'pass', 'passed', 'success', 'good', 'info', 'informational'].includes(raw);

  return (
    <div className="finding-card">
      <div className="finding-icon">
        {isSafe
          ? <CircleCheck size={20} style={{ color: '#4ade80' }} />
          : <TriangleAlert size={20} style={{ color: '#f59e0b' }} />
        }
      </div>
      <div className="finding-content">
        <div className="finding-title-row">
          <h4>{finding.name || finding.title || finding.check || `Finding ${index + 1}`}</h4>
          <StatusBadge finding={finding} />
        </div>
        <p>{finding.evidence || finding.description || finding.message || finding.details || 'No additional details were returned by the backend.'}</p>
        {finding.points !== undefined && (
          <p>Risk points: {finding.points}</p>
        )}
        {finding.recommendation && (
          <div>
            <strong>Recommendation</strong>
            <p>{finding.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
