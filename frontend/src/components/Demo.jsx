import { useState } from 'react';
import { Link } from 'react-router';
import './Demo.css';

const VERDICT_MAP = {
  verified:      { label: 'Verified',      color: '#10B981' },
  unverified:    { label: 'Unverified',    color: '#F59E0B' },
  misleading:    { label: 'Misleading',    color: '#EF4444' },
  false:         { label: 'False',         color: '#EF4444' },
  needs_context: { label: 'Needs Context', color: '#6366F1' },
};

export default function Demo() {
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [limitHit, setLimitHit] = useState(false);
  const [error, setError]       = useState('');

  const alreadyUsed = () => localStorage.getItem('veribot_demo_used') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (alreadyUsed()) {
      setLimitHit(true);
      return;
    }

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/veribot/demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Secret': import.meta.env.VITE_APP_SECRET ?? '',
        },
        body: JSON.stringify({ input_query: query }),
      });

      const data = await res.json();

      if (res.status === 429 || data.demo_limit) {
        localStorage.setItem('veribot_demo_used', 'true');
        setLimitHit(true);
        return;
      }

      if (!data.success) {
        setError(data.message ?? 'Something went wrong. Please try again.');
        return;
      }

      localStorage.setItem('veribot_demo_used', 'true');
      setResult(data.analysis);
    } catch {
      setError('Could not connect to VeriBot. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const verdictInfo = result ? (VERDICT_MAP[result.ground_truth_verdict] ?? VERDICT_MAP.unverified) : null;

  return (
    <section className="landing-demo" id="demo">
      <div className="demo-container">

        <div className="demo-header">
          <h2 className="demo-title">See VeriBot investigate a claim.</h2>
          <p className="demo-subtitle">
            Paste any headline or viral post below. VeriBot searches live sources,
            checks it against the CRAAP framework, and tells you what it found.
          </p>
        </div>

        {!limitHit && !result && (
          <form className="demo-form" onSubmit={handleSubmit}>
            <textarea
              className="demo-input"
              rows={3}
              placeholder='e.g. "Government cancels all school holidays starting next month." or paste a URL...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            {error && <p className="demo-error">{error}</p>}
            <button
              type="submit"
              className="btn-demo-submit"
              disabled={loading || !query.trim()}
            >
              {loading ? 'VeriBot is investigating...' : 'Verify This Claim'}
            </button>
          </form>
        )}

        {loading && (
          <div className="demo-loading">
            <div className="demo-spinner" />
            <p>Searching live sources and running CRAAP analysis...</p>
          </div>
        )}

        {result && verdictInfo && (
          <div className="demo-result">
            <div className="result-verdict-row">
              <span className="result-verdict-label">Verdict:</span>
              <span
                className="result-verdict-chip"
                style={{ color: verdictInfo.color, borderColor: verdictInfo.color }}
              >
                {verdictInfo.label}
              </span>
              {result.bias_detected && (
                <span className="result-bias-chip">Idol Bias Detected</span>
              )}
            </div>

            <p className="result-summary">{result.summary}</p>

            {result.bias_detected && result.bias_explanation && (
              <div className="result-bias-box">
                <span className="bias-box-label">Bias Note</span>
                <p>{result.bias_explanation}</p>
              </div>
            )}

            {result.sources?.length > 0 && (
              <div className="result-sources">
                <span className="sources-label">Sources checked</span>
                <ul>
                  {result.sources.map((s, i) => (
                    <li key={i}>
                      <a href={s.url} target="_blank" rel="noreferrer">{s.title ?? s.url}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="result-cta">
              <p>Want the full Socratic quiz and CRAAP breakdown? Sign in to unlock everything.</p>
              <Link to="/login" className="btn-result-login">Sign In for Full Access</Link>
            </div>
          </div>
        )}

        {limitHit && (
          <div className="demo-limit-wall">
            <img src="/mascot.png" alt="VeriBot" className="limit-mascot" />
            <h3>You have used your free demo.</h3>
            <p>Sign in to verify unlimited claims, take full Socratic quizzes, and track your Media Literacy score.</p>
            <Link to="/login" className="btn-result-login">Sign In to Continue</Link>
          </div>
        )}

      </div>
    </section>
  );
}
