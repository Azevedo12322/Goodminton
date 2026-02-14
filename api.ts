import type { TournamentState } from './types';

function isValidState(data: unknown): data is TournamentState {
  return (
    data !== null &&
    typeof data === 'object' &&
    Array.isArray((data as TournamentState).players) &&
    Array.isArray((data as TournamentState).matches)
  );
}

export async function fetchState(): Promise<TournamentState | null> {
  try {
    const res = await fetch(`/api/state?t=${Date.now()}`, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    if (!isValidState(data)) return null;
    const state = data as TournamentState;
    if (!state.rankings || typeof state.rankings !== 'object') {
      state.rankings = Object.fromEntries(Array.from({ length: 21 }, (_, i) => [i + 1, null]));
    }
    return state;
  } catch {
    return null;
  }
}

export async function saveState(tournament: TournamentState, adminPassword: string): Promise<boolean> {
  try {
    const res = await fetch('/api/state', {
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
