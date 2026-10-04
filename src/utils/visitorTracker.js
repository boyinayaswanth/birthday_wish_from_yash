/**
 * VisitorTracker Utility
 * Silently records:
 * - Who opened the site (Name entered)
 * - Exact opening date and time
 * - Time spent on each page (Page 1, Page 2, Page 3)
 * - Number of page visits
 * - Device, screen, and browser information
 * - Syncs locally to localStorage AND remotely to cloud pub/sub (ntfy)
 *   so the creator can see visits across different devices!
 */

const STORAGE_KEY = 'sowmya_bday_secret_analytics_v1';
// Unique topic for remote cross-device sync (free, zero-config, CORS enabled)
export const CLOUD_TOPIC = 'sowmya_bday_yaswanth_secret_tracker_2026';

let currentSession = null;
let activePage = null;
let pageEnterTimestamp = null;
let durationInterval = null;

function getDeviceInfo() {
  const ua = navigator.userAgent || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
  let os = 'Unknown Device';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS (Apple)';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Windows/i.test(ua)) os = 'Windows PC';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS (Mac)';
  else if (/Linux/i.test(ua)) os = 'Linux';

  return {
    isMobile,
    os,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || 'en',
    userAgent: ua
  };
}

export function startTrackingSession(name) {
  const now = new Date();
  const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  currentSession = {
    id: sessionId,
    name: name || 'Anonymous',
    openedAt: now.toISOString(),
    openedAtFormatted: now.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }),
    device: getDeviceInfo(),
    pageTimes: {
      birthday: 0,
      quote: 0,
      message: 0,
      name: 0
    },
    pageVisits: {
      birthday: 1,
      quote: 0,
      message: 0,
      name: 0
    },
    totalSeconds: 0,
    lastUpdated: now.toISOString()
  };

  activePage = 'birthday';
  pageEnterTimestamp = Date.now();

  saveSessionLocal(currentSession);
  syncToCloud(currentSession, '🚀 Site Unlocked');

  // Start periodic 5s tracker to keep duration fresh
  if (durationInterval) clearInterval(durationInterval);
  durationInterval = setInterval(() => {
    updateDurations();
  }, 5000);

  return currentSession;
}

export function trackPageChange(newPage) {
  if (!currentSession) return;

  const now = Date.now();
  if (activePage && pageEnterTimestamp) {
    const elapsedSeconds = Math.round((now - pageEnterTimestamp) / 1000);
    currentSession.pageTimes[activePage] = (currentSession.pageTimes[activePage] || 0) + elapsedSeconds;
  }

  activePage = newPage;
  pageEnterTimestamp = now;

  if (newPage && currentSession.pageVisits[newPage] !== undefined) {
    currentSession.pageVisits[newPage] = (currentSession.pageVisits[newPage] || 0) + 1;
  }

  updateDurations();
  saveSessionLocal(currentSession);
  syncToCloud(currentSession, `📄 Navigated to ${newPage}`);
}

function updateDurations() {
  if (!currentSession || !activePage || !pageEnterTimestamp) return;

  const now = Date.now();
  const elapsed = Math.round((now - pageEnterTimestamp) / 1000);
  const currentTotal = Object.values(currentSession.pageTimes).reduce((a, b) => a + b, 0) + elapsed;
  currentSession.totalSeconds = currentTotal;
  currentSession.lastUpdated = new Date().toISOString();

  saveSessionLocal(currentSession);
}

function saveSessionLocal(session) {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    let allSessions = existingRaw ? JSON.parse(existingRaw) : [];

    const existingIdx = allSessions.findIndex((s) => s.id === session.id);
    if (existingIdx >= 0) {
      allSessions[existingIdx] = session;
    } else {
      allSessions.unshift(session);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allSessions.slice(0, 50)));
  } catch (err) {
    console.warn('Local storage error:', err);
  }
}

export function getLocalSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function syncToCloud(session, actionTitle) {
  try {
    const payload = {
      title: `${session.name} opened Sowmya's Birthday: ${actionTitle}`,
      message: JSON.stringify({
        id: session.id,
        name: session.name,
        openedAt: session.openedAtFormatted,
        device: `${session.device.os} (${session.device.screen})`,
        pageTimes: session.pageTimes,
        pageVisits: session.pageVisits,
        totalSeconds: session.totalSeconds,
        lastUpdated: session.lastUpdated
      }),
      priority: 3,
      tags: ['tada', 'sparkles']
    };

    // Silently notify cloud pub/sub
    fetch(`https://ntfy.sh/${CLOUD_TOPIC}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(() => {});
  } catch (err) {
    // Fail silently so user experience is never interrupted
  }
}

export async function fetchRemoteSessions() {
  try {
    const res = await fetch(`https://ntfy.sh/${CLOUD_TOPIC}/json?poll=1`, {
      method: 'GET'
    });
    if (!res.ok) return [];

    const text = await res.text();
    const lines = text.trim().split('\n');
    const cloudSessionsMap = new Map();

    for (const line of lines) {
      if (!line) continue;
      try {
        const item = JSON.parse(line);
        if (item.message) {
          const parsed = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
          if (parsed.id) {
            cloudSessionsMap.set(parsed.id, parsed);
          }
        }
      } catch {
        // Skip unparseable lines
      }
    }

    return Array.from(cloudSessionsMap.values()).reverse();
  } catch (err) {
    console.warn('Failed to fetch remote sessions:', err);
    return [];
  }
}

export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}
