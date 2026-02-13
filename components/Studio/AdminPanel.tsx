
import React, { useState } from 'react';
import { TournamentState, Match } from '../../types';

interface AdminPanelProps {
  state: TournamentState;
  onUpdateMatch: (match: Match) => void;
  onLogin: (success: boolean) => void;
  isLoggedIn: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ state, onUpdateMatch, onLogin, isLoggedIn }) => {
  const [password, setPassword] = useState('');
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<Partial<Match>>({});
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedPassword = typeof import.meta.env.VITE_ADMIN_PASSWORD === 'string' ? import.meta.env.VITE_ADMIN_PASSWORD : '';
    if (expectedPassword && password === expectedPassword) {
      onLogin(true);
    } else {
      alert('Password incorreta!');
    }
  };

  const startEdit = (match: Match) => {
    setEditingMatch(match.id);
    setMatchData({ ...match });
    setScore1(match.score1 || 0);
    setScore2(match.score2 || 0);
  };

  const setWinner = (playerId: string | null) => {
    if (!playerId || !matchData) return;
    
    const isP1 = playerId === matchData.player1Id;
    
    onUpdateMatch({
      ...(matchData as Match),
      winnerId: playerId,
      loserId: isP1 ? matchData.player2Id : matchData.player1Id,
      score1: score1,
      score2: score2,
      status: 'completed'
    });
    setEditingMatch(null);
  };

  const getGroupLabel = (gid: string) => {
    if (gid === 'GC') return 'Fase Final';
    return gid.replace('G', 'Grupo ');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-8 sm:py-20 px-3 animate-fadeIn">
        <form onSubmit={handleLogin} className="glass-effect p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <p className="text-sm text-slate-400">Apenas para os organizadores do torneio.</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Palavra-passe"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 text-base text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full py-4 min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] touch-manipulation">
              Entrar no Painel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-2 sm:px-0 animate-fadeIn space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-bold tracking-tighter italic">Gestão Admin</h2>
          <p className="text-slate-500 text-[10px] sm:text-xs uppercase font-black tracking-widest mt-1">Controlo Total do Torneio</p>
        </div>
        <button onClick={() => onLogin(false)} className="px-4 py-2.5 min-h-[44px] text-xs font-black text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest bg-slate-900 rounded-xl border border-slate-800 touch-manipulation w-fit">Sair</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {state.matches.map((m) => {
          const p1 = state.players.find(p => p.id === m.player1Id);
          const p2 = state.players.find(p => p.id === m.player2Id);
          const p1Name = p1?.name || '???';
          const p2Name = p2?.name || '???';
          const isCompleted = m.status === 'completed';

          return (
            <div key={m.id} className={`glass-effect p-4 sm:p-6 rounded-xl sm:rounded-[2rem] border transition-all duration-500 ${isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800'}`}>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">{getGroupLabel(m.groupId)}</p>
                  <h4 className="text-lg font-bold flex items-center gap-3">
                    <span className={m.winnerId === m.player1Id ? 'text-emerald-400' : 'text-white'}>{p1Name}</span>
                    <span className="text-slate-600 text-xs italic font-normal">vs</span>
                    <span className={m.winnerId === m.player2Id ? 'text-emerald-400' : 'text-white'}>{p2Name}</span>
                  </h4>
                  {isCompleted && (
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                        Resultado: <span className="text-white font-mono">{m.score1} - {m.score2}</span>
                      </p>
                      <div className="h-1 w-1 rounded-full bg-slate-700" />
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                        Vencedor: <span className="text-emerald-400">{state.players.find(p => p.id === m.winnerId)?.name}</span>
                      </p>
                    </div>
                  )}
                </div>

                {editingMatch === m.id ? (
                  <div className="flex flex-col gap-4 w-full min-w-0 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest ml-1">Score {p1Name.split(' ')[0]}</label>
                        <input 
                          type="number"
                          value={score1}
                          onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-center focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest ml-1">Score {p2Name.split(' ')[0]}</label>
                        <input 
                          type="number"
                          value={score2}
                          onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono text-center focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[9px] uppercase font-black text-slate-400 text-center tracking-widest">Escolher Vencedor</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setWinner(m.player1Id)}
                          disabled={!m.player1Id}
                          className="flex-1 px-3 sm:px-4 py-3 min-h-[44px] bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/30 rounded-xl text-[10px] font-black transition-all text-white uppercase tracking-widest truncate touch-manipulation"
                        >
                          {p1Name.split(' ')[0]}
                        </button>
                        <button 
                          onClick={() => setWinner(m.player2Id)}
                          disabled={!m.player2Id}
                          className="flex-1 px-3 sm:px-4 py-3 min-h-[44px] bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/30 rounded-xl text-[10px] font-black transition-all text-white uppercase tracking-widest truncate touch-manipulation"
                        >
                          {p2Name.split(' ')[0]}
                        </button>
                      </div>
                    </div>
                    
                    <button onClick={() => setEditingMatch(null)} className="text-[9px] text-slate-500 uppercase font-black hover:text-white tracking-widest transition-colors">Cancelar Edição</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => startEdit(m)}
                    className="px-4 sm:px-6 py-3 min-h-[44px] bg-slate-900 hover:bg-slate-800 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border border-slate-800 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 group touch-manipulation"
                  >
                    <span>{isCompleted ? 'Alterar Resultado' : 'Lançar Resultado'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPanel;
