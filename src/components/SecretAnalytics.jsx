import React, { useState, useEffect } from 'react';
import SowmyaNamePage from './SowmyaNamePage';
import { 
  getLocalSessions, 
  fetchRemoteSessions, 
  formatDuration, 
  CLOUD_TOPIC 
} from '../utils/visitorTracker';

/**
 * SecretAnalytics Component
 * Hidden intelligence dashboard protected by passcode "Yash@sowmya".
 * Completely stealthy with zero clues on the lock screen.
 */
export default function SecretAnalytics({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewNamePage, setViewNamePage] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passError, setPassError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Clear password state whenever entering or leaving
  useEffect(() => {
    setPasswordInput('');
    setPassError('');
    setShowPassword(false);
    setIsReadOnly(true);
    setViewNamePage(false);
  }, []);

  const [sessions, setSessions] = useState([]);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [copiedTopic, setCopiedTopic] = useState(false);

  const loadData = async () => {
    // 1. Load local sessions first
    const local = getLocalSessions();
    setSessions(local);

    // 2. Fetch remote sessions from cloud
    setIsLoadingCloud(true);
    try {
      const remote = await fetchRemoteSessions();
      if (remote && remote.length > 0) {
        // Merge local and remote, deduplicating by session ID
        const mergedMap = new Map();
        [...remote, ...local].forEach((s) => {
          if (s.id) {
            const existing = mergedMap.get(s.id);
            if (!existing || (s.totalSeconds || 0) > (existing.totalSeconds || 0)) {
              mergedMap.set(s.id, s);
            }
          }
        });
        const combined = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.openedAt || 0) - new Date(a.openedAt || 0)
        );
        setSessions(combined);
      }
    } catch (err) {
      console.warn('Remote sync failed:', err);
    } finally {
      setIsLoadingCloud(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      // Auto-refresh every 10 seconds while secret page is open
      const interval = setInterval(loadData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === 'Yash@sowmya') {
      setIsAuthenticated(true);
      setPassError('');
    } else {
      setPassError('Incorrect passcode.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleCopyTopic = () => {
    navigator.clipboard?.writeText?.(CLOUD_TOPIC);
    setCopiedTopic(true);
    setTimeout(() => setCopiedTopic(false), 2500);
  };

  const handleClearLocal = () => {
    if (window.confirm('Clear local visit history on this device?')) {
      localStorage.removeItem('sowmya_bday_secret_analytics_v1');
      setSessions([]);
    }
  };

  // If not authenticated, render the discreet Passcode Screen (no clues, no tabs, no hints)
  if (!isAuthenticated) {
    return (
      <article className="secret-auth-container" aria-label="Passcode Gate">
        <div className="secret-auth-card">
          <div className="secret-lock-icon" aria-hidden="true">🔒</div>
          <h1 className="secret-auth-title">Passcode Required</h1>
          <p className="secret-auth-desc">
            Enter passcode to continue.
          </p>

          <form onSubmit={handlePasswordSubmit} className="secret-auth-form" noValidate autoComplete="off">
            {/* Honeypot dummy inputs to suppress browser password autofill */}
            <input type="text" name="fake_user" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            <input type="password" name="fake_pass" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <div className="secret-input-wrapper">
              <input
                id="secret-manual-key"
                name="secret_manual_key"
                type={showPassword ? 'text' : 'password'}
                className={`secret-pass-input ${isShaking ? 'error-shake' : ''}`}
                placeholder="Enter passcode..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passError) setPassError('');
                }}
                readOnly={isReadOnly}
                onFocus={() => setIsReadOnly(false)}
                onClick={() => setIsReadOnly(false)}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label="Passcode input"
              />
              <button
                type="button"
                className="pass-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>

            {passError && (
              <p className="secret-auth-error" role="alert">
                {passError}
              </p>
            )}

            <div className="secret-auth-actions">
              <button type="submit" className="secret-auth-submit">
                Unlock
              </button>
              <button 
                type="button" 
                onClick={onBack} 
                className="secret-auth-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </article>
    );
  }

  // Inside Authenticated Dashboard: Optionally preview the 20-languages page
  if (viewNamePage) {
    return (
      <div className="secret-preview-container">
        <div className="secret-preview-bar">
          <button
            type="button"
            onClick={() => setViewNamePage(false)}
            className="secret-btn"
          >
            ← Back to Secret Dashboard
          </button>
          <span className="secret-badge">Page 4 Preview: Sowmya in 20 Languages</span>
          <button
            type="button"
            onClick={onBack}
            className="secret-btn lock"
          >
            ✕ Exit to Message
          </button>
        </div>
        <SowmyaNamePage onBack={() => setViewNamePage(false)} />
      </div>
    );
  }

  const latestSession = sessions[0] || null;

  return (
    <article className="secret-analytics-container" aria-label="Secret Intelligence Dashboard">
      {/* Top Nav */}
      <nav className="secret-nav">
        <button 
          type="button" 
          onClick={onBack} 
          className="back-button"
          aria-label="Return to message"
        >
          <span className="arrow">←</span>
          <span>Back to Message</span>
        </button>

        <div className="secret-actions">
          <button
            type="button"
            onClick={() => setViewNamePage(true)}
            className="secret-btn"
            title="Preview the 20 Languages constellation page"
          >
            🌌 View 20 Languages Page
          </button>
          <button 
            type="button" 
            onClick={loadData} 
            className="secret-btn"
            disabled={isLoadingCloud}
          >
            {isLoadingCloud ? 'Syncing...' : '🔄 Sync Cloud'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(false);
              setPasswordInput('');
            }}
            className="secret-btn lock"
            title="Lock secret dashboard"
          >
            🔒 Lock
          </button>
        </div>
      </nav>

      {/* Secret Header */}
      <header className="secret-header">
        <div className="secret-badge">🔒 Hidden Visitor Tracker</div>
        <h1 className="secret-title">Secret Activity Intelligence</h1>
        <p className="secret-subtitle">
          Untraceable dashboard tracking who opened the site, opening timestamps, and time spent per page.
        </p>
      </header>

      {/* Primary KPI Cards */}
      <div className="secret-kpi-grid">
        <div className="secret-kpi-card">
          <span className="kpi-label">Latest Visitor</span>
          <span className="kpi-value gold">
            {latestSession ? latestSession.name : 'No visits yet'}
          </span>
          <span className="kpi-sub">
            {latestSession ? latestSession.openedAtFormatted : 'Waiting for someone to open'}
          </span>
        </div>

        <div className="secret-kpi-card">
          <span className="kpi-label">Total Time Spent</span>
          <span className="kpi-value">
            {latestSession ? formatDuration(latestSession.totalSeconds) : '0s'}
          </span>
          <span className="kpi-sub">Across all 4 pages</span>
        </div>

        <div className="secret-kpi-card">
          <span className="kpi-label">Total Sessions</span>
          <span className="kpi-value gold">{sessions.length}</span>
          <span className="kpi-sub">Times site was unlocked</span>
        </div>
      </div>

      {/* Latest Session Breakdown */}
      {latestSession && (
        <section className="secret-breakdown-card">
          <h2 className="breakdown-title">
            Page Breakdown for: <em>{latestSession.name}</em>
          </h2>

          <div className="breakdown-grid">
            <div className="breakdown-item">
              <div className="breakdown-page-name">Page 1: Birthday Screen</div>
              <div className="breakdown-stats">
                <span>⏱️ {formatDuration(latestSession.pageTimes?.birthday || 0)}</span>
                <span className="dot">•</span>
                <span>👀 {latestSession.pageVisits?.birthday || 1} views</span>
              </div>
            </div>

            <div className="breakdown-item highlight">
              <div className="breakdown-page-name">Page 2: Eyes & Love Quote (Music)</div>
              <div className="breakdown-stats">
                <span>⏱️ {formatDuration(latestSession.pageTimes?.quote || 0)}</span>
                <span className="dot">•</span>
                <span>👀 {latestSession.pageVisits?.quote || 0} views</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-page-name">Page 3: Watermark Portrait & Note</div>
              <div className="breakdown-stats">
                <span>⏱️ {formatDuration(latestSession.pageTimes?.message || 0)}</span>
                <span className="dot">•</span>
                <span>👀 {latestSession.pageVisits?.message || 0} views</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-page-name">Page 4: Sowmya in 20 Languages</div>
              <div className="breakdown-stats">
                <span>⏱️ {formatDuration(latestSession.pageTimes?.name || 0)}</span>
                <span className="dot">•</span>
                <span>👀 {latestSession.pageVisits?.name || 0} views</span>
              </div>
            </div>
          </div>

          {/* Device details */}
          <div className="device-info-bar">
            <span>📱 <strong>Device:</strong> {latestSession.device?.os || 'Mobile/Desktop'}</span>
            <span>📐 <strong>Screen:</strong> {latestSession.device?.screen || 'N/A'}</span>
            <span>🌐 <strong>Language:</strong> {latestSession.device?.language || 'en'}</span>
          </div>
        </section>
      )}

      {/* All Sessions Log Table */}
      <section className="secret-log-section">
        <div className="log-header-row">
          <h2 className="log-title">All Visiting History ({sessions.length})</h2>
          {sessions.length > 0 && (
            <button 
              type="button" 
              onClick={handleClearLocal}
              className="clear-local-btn"
            >
              Clear Local
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="empty-log-state">
            <p>No recorded sessions yet.</p>
            <p className="empty-sub">
              Open the website, type a name, and navigate between pages to record your first visit!
            </p>
          </div>
        ) : (
          <div className="sessions-list">
            {sessions.map((sess, idx) => (
              <div key={sess.id || idx} className="session-item">
                <div className="session-main">
                  <div className="session-name-row">
                    <span className="session-name">{sess.name}</span>
                    <span className="session-duration">
                      ⏳ {formatDuration(sess.totalSeconds)}
                    </span>
                  </div>
                  <div className="session-meta">
                    <span>📅 {sess.openedAtFormatted || sess.openedAt}</span>
                    <span>•</span>
                    <span>📱 {sess.device?.os || 'Device'}</span>
                  </div>
                </div>

                <div className="session-pages-pills">
                  <span className="page-pill">
                    P1: {formatDuration(sess.pageTimes?.birthday || 0)}
                  </span>
                  <span className="page-pill">
                    P2: {formatDuration(sess.pageTimes?.quote || 0)}
                  </span>
                  <span className="page-pill">
                    P3: {formatDuration(sess.pageTimes?.message || 0)}
                  </span>
                  <span className="page-pill">
                    P4: {formatDuration(sess.pageTimes?.name || 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Phone Push Notification Alert Setup Box */}
      <section className="ntfy-info-card">
        <h3 className="ntfy-title">🔔 Get Instant Alerts on Your Phone</h3>
        <p className="ntfy-text">
          Want your phone to buzz the exact second Sowmya opens the link?
          Install the free <strong>ntfy</strong> app (iOS / Android) and subscribe to this secret topic:
        </p>
        <div className="topic-copy-row">
          <code className="topic-code">{CLOUD_TOPIC}</code>
          <button 
            type="button" 
            onClick={handleCopyTopic} 
            className="copy-btn"
          >
            {copiedTopic ? '✓ Copied!' : 'Copy Topic'}
          </button>
        </div>
        <p className="ntfy-hint">
          Or view it in any browser anytime at: 
          <a 
            href={`https://ntfy.sh/${CLOUD_TOPIC}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ntfy-link"
          >
            ntfy.sh/{CLOUD_TOPIC}
          </a>
        </p>
      </section>
    </article>
  );
}
