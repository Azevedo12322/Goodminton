
import React, { useState, useMemo } from 'react';
import { TournamentState, Match, Player } from '../../types';

interface RankingViewProps {
  state: TournamentState;
}

interface RankedPlayer {
  id: string;
  name: string;
  points: number;
}

const RankingView: React.FC<RankingViewProps> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<'final' | 'points'>('final');

  // Helper to get sum of points for a specific list of players in a specific list of matches
  const getPoolRankings = (playerIds: string[], matches: Match[]): RankedPlayer[] => {
    const results = playerIds.map(id => {
      const playerMatches = matches.filter(m => m.player1Id === id || m.player2Id === id);
      const totalPoints = playerMatches.reduce((sum, m) => {
        if (m.player1Id === id) return sum + (m.score1 || 0);
        if (m.player2Id === id) return sum + (m.score2 || 0);
        return sum;
      }, 0);
      return {
        id,
        name: state.players.find(p => p.id === id)?.name || 'Desconhecido',
        points: totalPoints
      };
    });
    return results.sort((a, b) => b.points - a.points);
  };

  const finalClassification = useMemo(() => {
    const classification: (RankedPlayer | null)[] = Array(21).fill(null);

    // 1-3: GC Pool
    const gcMatches = state.matches.filter(m => m.groupId === 'GC');
    const gcPlayers = Array.from(new Set(gcMatches.flatMap(m => [m.player1Id, m.player2Id]).filter(Boolean))) as string[];
    const gcRanked = getPoolRankings(gcPlayers, gcMatches);
    gcRanked.forEach((p, i) => { if (i < 3) classification[i] = p; });

    // 4-6: G2 Pool
    const g2Matches = state.matches.filter(m => m.groupId === 'G2');
    const g2Players = Array.from(new Set(g2Matches.flatMap(m => [m.player1Id, m.player2Id]).filter(Boolean))) as string[];
    const g2Ranked = getPoolRankings(g2Players, g2Matches);
    g2Ranked.forEach((p, i) => { if (i < 3) classification[i + 3] = p; });

    // 7-9: G3 Pool
    const g3PoolMatches = state.matches.filter(m => m.groupId === 'G3' && m.round === 1);
    const g3PoolPlayers = Array.from(new Set(g3PoolMatches.flatMap(m => [m.player1Id, m.player2Id]).filter(Boolean))) as string[];
    const g3Ranked = getPoolRankings(g3PoolPlayers, g3PoolMatches);
    g3Ranked.forEach((p, i) => { if (i < 3) classification[i + 6] = p; });

    // 10-11: G3 Leftovers (Losers of G3 Round 0)
    const g3PlayoffMatches = state.matches.filter(m => m.groupId === 'G3' && m.round === 0);
    const g3LeftoverIds = g3PlayoffMatches.map(m => m.loserId).filter(Boolean) as string[];
    const g3LeftoversRanked = getPoolRankings(g3LeftoverIds, g3PlayoffMatches);
    g3LeftoversRanked.forEach((p, i) => { if (i < 2) classification[i + 9] = p; });

    // 12-14: G4 Pool (Round 2)
    const g4PoolMatches = state.matches.filter(m => m.groupId === 'G4' && m.round === 2);
    const g4PoolPlayers = Array.from(new Set(g4PoolMatches.flatMap(m => [m.player1Id, m.player2Id]).filter(Boolean))) as string[];
    const g4Ranked = getPoolRankings(g4PoolPlayers, g4PoolMatches);
    g4Ranked.forEach((p, i) => { if (i < 3) classification[i + 11] = p; });

    // 15-16: G4 Leftovers (Losers of G4 Round 1 matches that lead to Pool)
    // In G4, winners of R1-M1, R1-M2, R1-M3 go to pool. Losers of M1 and M2 are the leftovers.
    const g4Phase2Matches = state.matches.filter(m => m.groupId === 'G4' && m.round === 1);
    const g4LeftoverIds = g4Phase2Matches.slice(0, 2).map(m => m.loserId).filter(Boolean) as string[];
    const g4LeftoversRanked = getPoolRankings(g4LeftoverIds, g4Phase2Matches);
    g4LeftoversRanked.forEach((p, i) => { if (i < 2) classification[i + 14] = p; });

    // 17-19: G5 Pool (Round 1)
    const g5PoolMatches = state.matches.filter(m => m.groupId === 'G5' && m.round === 1);
    const g5PoolPlayers = Array.from(new Set(g5PoolMatches.flatMap(m => [m.player1Id, m.player2Id]).filter(Boolean))) as string[];
    const g5Ranked = getPoolRankings(g5PoolPlayers, g5PoolMatches);
    g5Ranked.forEach((p, i) => { if (i < 3) classification[i + 16] = p; });

    // 20-21: G5 Leftovers (Losers of G5 Round 0)
    const g5PlayoffMatches = state.matches.filter(m => m.groupId === 'G5' && m.round === 0);
    const g5LeftoverIds = g5PlayoffMatches.map(m => m.loserId).filter(Boolean) as string[];
    const g5LeftoversRanked = getPoolRankings(g5LeftoverIds, g5PlayoffMatches);
    g5LeftoversRanked.forEach((p, i) => { if (i < 2) classification[i + 19] = p; });

    return classification;
  }, [state.matches, state.players]);

  // Global points ranking
  const playerPoints = useMemo(() => {
    const pointsMap: Record<string, number> = {};
    state.players.forEach(p => { pointsMap[p.id] = 0; });
    state.matches.forEach(m => {
      if (m.status === 'completed') {
        if (m.player1Id) pointsMap[m.player1Id] += (m.score1 || 0);
        if (m.player2Id) pointsMap[m.player2Id] += (m.score2 || 0);
      }
    });
    return Object.entries(pointsMap)
      .map(([id, points]) => ({
        id,
        name: state.players.find(p => p.id === id)?.name || 'Desconhecido',
        points
      }))
      .sort((a, b) => b.points - a.points);
  }, [state.matches, state.players]);

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fadeIn space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Ranking dos Loios</h2>
        <p className="text-slate-500 text-sm mt-2">Consulta a performance oficial dos atletas</p>
      </div>

      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit mx-auto">
        <button 
          onClick={() => setActiveTab('final')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'final' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Classificação Final
        </button>
        <button 
          onClick={() => setActiveTab('points')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'points' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Ranking de Pontos
        </button>
      </div>

      <div className="glass-effect rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
        {activeTab === 'final' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800">
                  <th className="px-4 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Posição</th>
                  <th className="px-4 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Atleta</th>
                  <th className="px-4 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Grupo Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {finalClassification.map((p, i) => {
                  const rank = i + 1;
                  const group = rank <= 3 ? 'Fase Final' : 
                                rank <= 6 ? 'Grupo 2' : 
                                rank <= 9 ? 'Grupo 3 Pool' : 
                                rank <= 11 ? 'Grupo 3 Extra' :
                                rank <= 14 ? 'Grupo 4 Pool' : 
                                rank <= 16 ? 'Grupo 4 Extra' :
                                rank <= 19 ? 'Grupo 5 Pool' : 'Grupo 5 Extra';
                  
                  return (
                    <tr key={rank} className={`hover:bg-emerald-500/5 transition-colors ${rank <= 3 ? 'bg-emerald-500/5' : ''}`}>
                      <td className="px-4 md:px-8 py-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm ${
                          rank === 1 ? 'bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/20' :
                          rank === 2 ? 'bg-slate-300 text-slate-950' :
                          rank === 3 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {rank}º
                        </span>
                      </td>
                      <td className={`px-4 md:px-8 py-4 font-bold text-sm ${p ? 'text-white' : 'text-slate-600'}`}>
                        {p ? p.name : 'A definir...'}
                      </td>
                      <td className="px-4 md:px-8 py-4 text-right">
                        <span className={`text-[9px] font-black px-2 py-1 rounded-full border whitespace-nowrap ${
                          rank <= 3 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-slate-800 text-slate-500'
                        }`}>
                          {group}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Atleta</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Pontos Totais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {playerPoints.map((p, i) => (
                  <tr key={p.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="px-8 py-4 text-xs font-black text-slate-500 italic">#{i + 1}</td>
                    <td className="px-8 py-4 font-bold text-sm text-white">{p.name}</td>
                    <td className="px-8 py-4 text-right">
                      <span className="text-lg font-mono font-black text-emerald-400">
                        {p.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl">
         <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Regras de Classificação</p>
         <ul className="text-[10px] text-slate-400 space-y-1 font-medium list-disc list-inside">
           <li>As posições de Pool (1-9, 12-14, 17-19) são decididas pela soma de pontos nos 3 jogos da Pool.</li>
           <li>As posições Extra (10-11, 15-16, 20-21) são decididas pela soma de pontos dos eliminados em suas respectivas fases.</li>
           <li>O ranking global de pontos considera todos os pontos marcados em qualquer fase do torneio.</li>
         </ul>
      </div>
    </div>
  );
};

export default RankingView;
