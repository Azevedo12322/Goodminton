import type { TournamentState } from './types';

function getApiBase(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

function isValidState(data: unknown): data is TournamentState {
  return (
    data !== null &&
    typeof data === 'object' &&
    Array.isArray((data as TournamentState).players) &&
    Array.isArray((data as TournamentState).matches)
  );
}

export type FetchStateResult =
  | { ok: true; state: TournamentState; serverSavedAt?: string; storagePersistent?: boolean }
  | { ok: false; state: null; error: 'network' | 'not_found' | 'invalid' };

export async function fetchState(): Promise<FetchStateResult> {
  const base = getApiBase();
  const url = `${base}/api/state?t=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const storagePersistent = res.headers.get('X-Storage-Persistent') === 'true';
    if (res.status === 404) return { ok: false, state: null, error: 'not_found' };
    if (!res.ok) return { ok: false, state: null, error: 'invalid' };
    const data = await res.json();
    const { _serverSavedAt, ...rest } = data;
    const state = rest as TournamentState;
    if (!isValidState(state)) return { ok: false, state: null, error: 'invalid' };
    if (!state.rankings || typeof state.rankings !== 'object') {
      state.rankings = Object.fromEntries(Array.from({ length: 21 }, (_, i) => [i + 1, null]));
    }
    return { ok: true, state, serverSavedAt: _serverSavedAt, storagePersistent };
  } catch {
    return { ok: false, state: null, error: 'network' };
  }
}


export async function verifyAdminPassword(password: string): Promise<boolean> {
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.trim() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveState(tournament: TournamentState, adminPassword: string): Promise<boolean> {
  const base = getApiBase();
  try {
    const res = await fetch(`${base}/api/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': adminPassword,
      },
      body: JSON.stringify({ tournament }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
