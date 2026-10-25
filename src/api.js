const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Generic POST request to the backend API.
 * Throws an Error with a human-readable message on failure.
 */
export async function apiPost(endpoint, body) {
  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      'Cannot connect to the backend. Check that your backend is running and your API URL is correct.'
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The backend returned an invalid response.');
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || 'The analysis request failed.');
  }

  return data;
}

/** Safely extract the risk level string */
export function getRiskLevel(result) {
  return String(result?.risk_level || result?.riskLevel || result?.risk || 'Unknown');
}

/** Safely extract the risk score (0-100) */
export function getRiskScore(result) {
  const score = Number(result?.risk_score ?? result?.score ?? result?.security_score ?? 0);
  return Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0;
}

/** Safely extract the findings array */
export function getFindings(result) {
  if (Array.isArray(result?.findings)) return result.findings;
  if (Array.isArray(result?.results)) return result.results;
  return [];
}

/** Normalise a severity / status string to a CSS-safe class segment */
export function getSeverityClass(finding) {
  return String(finding?.severity || finding?.status || finding?.risk || 'info').toLowerCase();
}

/** Map an arbitrary risk/severity string to one of: low | medium | high | unknown */
export function normaliseSeverity(level) {
  const t = String(level).toLowerCase();
  if (['safe', 'secure', 'pass', 'passed', 'success', 'good', 'low'].includes(t)) return 'low';
  if (['medium', 'moderate', 'warning'].includes(t)) return 'medium';
  if (['high', 'critical', 'danger', 'error', 'failed'].includes(t)) return 'high';
  return 'unknown';
}
