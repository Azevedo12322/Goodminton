
export enum StudioTab {
  HOME = 'home',
  BRACKET = 'bracket',
  SCHEDULE = 'schedule',
  ADMIN = 'admin',
  RANKING = 'ranking'
}

export type GroupId = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'GC';

export interface Player {
  id: string;
  name: string;
  rank?: number;
}

export interface Match {
  id: string;
  groupId: GroupId;
  round: number; 
  label: string;
  player1Id: string | null;
  player2Id: string | null;
  score1?: number;
  score2?: number;
  winnerId?: string | null;
  loserId?: string | null;
  status: 'pending' | 'completed';
  time?: string;
  court?: string;
}

export interface TournamentState {
  players: Player[];
  matches: Match[];
  rankings: Record<number, string | null>;
}
