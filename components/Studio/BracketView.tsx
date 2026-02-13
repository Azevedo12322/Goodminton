
import React, { useState } from 'react';
import { TournamentState, Match, GroupId } from '../../types';

interface BracketViewProps {
  state: TournamentState;
  onMatchClick?: (matchId: string) => void;
}

const BracketView: React.FC<BracketViewProps> = ({ state, onMatchClick }) => {
  const [activeGroup, setActiveGroup] = useState<GroupId>('G1');
  const [selectedRound, setSelectedRound] = useState<number>(0);

  const getPlayerName = (id: string | null) => {
    if (!id) return 'A definir...';
    return state.players.find(p => p.id === id)?.name || 'Desconhecido';
  };

  const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
    const isPlayer1Winner = match.winnerId === match.player1Id && match.winnerId !== null;
    const isPlayer2Winner = match.winnerId === match.player2Id && match.winnerId !== null;
    const isCompleted = match.status === 'completed';

    return (
      <div 
        onClick={() => onMatchClick?.(match.id)}
        className={`glass-effect p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border mb-3 sm:mb-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.99] touch-manipulation ${
          isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between text-[9px] mb-2.5 text-slate-500 font-black uppercase tracking-widest">
          <span>{match.label}</span>
          {isCompleted && <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">FIM</span>}
        </div>
        <div className="space-y-1.5">
          <div className={`flex justify-between items-center p-2 rounded-xl transition-colors ${isPlayer1Winner ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-900/50 border border-transparent'}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className={`text-xs truncate ${isPlayer1Winner ? 'font-black text-white' : 'text-slate-400 font-medium'}`}>
                {getPlayerName(match.player1Id)}
              </span>
              {isCompleted && isPlayer1Winner && (
                <span className="text-[7px] font-black bg-emerald-500 text-slate-950 px-1 rounded-sm shrink-0">WIN</span>
              )}
            </div>
            <span className={`text-xs font-mono font-bold ${isPlayer1Winner ? 'text-emerald-400' : 'text-slate-500'}`}>{match.score1 ?? '-'}</span>
          </div>
          <div className={`flex justify-between items-center p-2 rounded-xl transition-colors ${isPlayer2Winner ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-900/50 border border-transparent'}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className={`text-xs truncate ${isPlayer2Winner ? 'font-black text-white' : 'text-slate-400 font-medium'}`}>
                {getPlayerName(match.player2Id)}
              </span>
              {isCompleted && isPlayer2Winner && (
                <span className="text-[7px] font-black bg-emerald-500 text-slate-950 px-1 rounded-sm shrink-0">WIN</span>
              )}
            </div>
            <span className={`text-xs font-mono font-bold ${isPlayer2Winner ? 'text-emerald-400' : 'text-slate-500'}`}>{match.score2 ?? '-'}</span>
          </div>
        </div>
      </div>
    );
  };

  const groupMatches = state.matches.filter(m => m.groupId === activeGroup);
  const maxRound = Math.max(...groupMatches.map(m => m.round), 0);
  const rounds = Array.from({ length: maxRound + 1 }, (_, i) => i);

  const groupLabels: Record<GroupId, {title: string, desc: string, note?: string}> = {
    G1: { title: "Grupo 1", desc: "Os 3 vencedores da Ronda 3 avançam para a Fase Final." },
    GC: { title: "Fase Final", desc: "Os 3 vencedores da Ronda 3 do Grupo 1 jogam todos contra todos para decidir o Grande Campeão.", note: "A colocação neste grupo será definida pela quantidade de pontos somados das 3 partidas efetuadas." },
    G2: { title: "Grupo 2", desc: "Os 3 perdedores da Ronda 3 (Classificados - G1-R3) jogam todos contra todos para definir o 4º ao 6º lugar.", note: "A colocação neste grupo será definida pela quantidade de pontos somados das 3 partidas efetuadas." },
    G3: { title: "Grupo 3", desc: "Play-offs entre perdedores dos Pré-Classificados (G1-R2). O melhor que perdeu (B) avança direto para a Pool. É aqui que se definem os lugares de 7º a 11º.", note: "A Ronda de Pool é uma liga (todos contra todos) entre os vencedores dos play-offs e o melhor que perdeu (B)." },
    G4: { title: "Grupo 4", desc: "Play-offs entre perdedores da Ronda 1 (G1-R1). O melhor que perdeu (B) avança direto para a Pool. É aqui que se definem os lugares de 12º a 16º." },
    G5: { title: "Grupo 5", desc: "Fase de consolação para os perdedores dos playoffs. Definem os lugares finais do torneio." }
  };

  const handleGroupChange = (gid: GroupId) => {
    setActiveGroup(gid);
    setSelectedRound(0);
  };

  // Logic to find the player assigned to Slot B for G3, G4, and G5
  const getSlotBName = (gid: 'G3' | 'G4' | 'G5') => {
    let matchId = '';
    if (gid === 'G3') matchId = 'G3-R1-M1';
    else if (gid === 'G4') matchId = 'G4-R1-M3';
    else if (gid === 'G5') matchId = 'G5-R1-M1';
    
    const bId = state.matches.find(m => m.id === matchId)?.player2Id;
    return bId ? getPlayerName(bId) : null;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Group Selector */}
      <div className="flex flex-wrap gap-2">
        {(['G1', 'G2', 'G3', 'G4', 'G5', 'GC'] as GroupId[]).map(gid => (
          <button
            key={gid}
            onClick={() => handleGroupChange(gid)}
            className={`px-3 sm:px-4 py-2.5 min-h-[44px] rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all touch-manipulation ${
              activeGroup === gid 
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {gid === 'GC' ? 'Fase Final' : gid.replace('G', 'Grupo ')} {activeGroup === gid && '•'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Active Group Info */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 sm:p-5 rounded-xl sm:rounded-[2rem] flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{groupLabels[activeGroup].title}</p>
            <p className="text-xs text-slate-400 font-medium">{groupLabels[activeGroup].desc}</p>
          </div>
        </div>

        {groupLabels[activeGroup].note && (
          <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3 animate-fadeIn">
            <div className="text-blue-400 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <p className="text-[11px] text-blue-200 font-semibold leading-relaxed">
              <span className="uppercase font-black mr-1 text-blue-400">Nota:</span>
              {groupLabels[activeGroup].note}
            </p>
          </div>
        )}

        {/* Round Selector for Mobile */}
        {rounds.length > 1 && (
          <div className="flex justify-center md:hidden animate-fadeIn">
            <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl">
              {rounds.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRound(r)}
                  className={`px-4 sm:px-6 py-2 min-h-[40px] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all touch-manipulation ${
                    selectedRound === r 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {activeGroup === 'G1' ? `Ronda ${r + 1}` : (r === 0 ? 'Playoffs' : 'Ronda de Pool')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bracket View Container */}
      <div className="overflow-x-auto custom-scrollbar pb-6 -mx-3 sm:mx-0 px-2 sm:px-4">
        <div className={`flex md:gap-16 p-2 sm:p-4 min-h-[500px] sm:min-h-[700px] ${rounds.length > 1 ? 'md:min-w-[1200px]' : 'min-w-full justify-center'}`}>
          {rounds.map(r => {
            const isR3 = r === 2 && activeGroup === 'G1';
            const isPool = activeGroup === 'GC' || activeGroup === 'G2' || ((activeGroup === 'G3' || activeGroup === 'G4' || activeGroup === 'G5') && r === rounds.length - 1);
            
            const poolLabel = 'Ronda de Pool';
            const mobilePoolLabel = 'Pool Round';

            const getRoundHeader = () => {
                if (isPool) return poolLabel;
                if ((activeGroup === 'G3' || activeGroup === 'G4' || activeGroup === 'G5') && r === 0) return 'Playoffs de Acesso';
                if ((activeGroup === 'G3' || activeGroup === 'G4') && r === 1) return 'Fase Intermédia';
                return `Ronda ${r + 1}`;
            };

            return (
              <div 
                key={r} 
                className={`flex-1 flex-col items-center ${selectedRound === r ? 'flex' : 'hidden md:flex'}`}
              >
                <h4 className="text-[9px] font-black uppercase text-slate-600 border-b border-slate-800/50 w-full pb-3 mb-10 text-center tracking-[0.3em] hidden md:block">
                  {getRoundHeader()}
                </h4>
                
                <div className="md:hidden text-center mb-8">
                   <span className="text-[8px] font-black uppercase text-emerald-500 tracking-[0.4em] bg-emerald-500/10 px-3 py-1 rounded-full">
                     {isPool ? mobilePoolLabel : getRoundHeader()}
                   </span>
                </div>

                <div className={`flex-1 w-full flex flex-col justify-around relative transition-transform duration-500 ${isR3 ? 'md:translate-y-12' : ''}`}>
                  {groupMatches.filter(m => {
                    // Filter out the match replaced by Slot B in G4
                    if (activeGroup === 'G4' && r === 1 && m.id === 'G4-R1-M3') return false;
                    return m.round === r;
                  }).map(m => (
                    <div key={m.id} className="flex justify-center w-full">
                      <div className="w-full max-w-[280px]">
                        <MatchCard match={m} />
                      </div>
                    </div>
                  ))}
                  
                  {/* Slot B Box logic for G3, G4, and now G5 */}
                  {( (activeGroup === 'G3' && r === 0) || (activeGroup === 'G4' && r === 1) || (activeGroup === 'G5' && r === 0) ) && (
                    <div className="flex justify-center w-full mt-4">
                       <div className={`w-full max-w-[280px] border-2 rounded-2xl p-4 text-center transition-all ${
                         getSlotBName(activeGroup as 'G3' | 'G4' | 'G5') 
                          ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10' 
                          : 'border-dashed border-slate-800 opacity-50'
                       }`}>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                              Slot B: Melhor que perdeu {activeGroup === 'G3' ? 'G1-R2' : (activeGroup === 'G4' ? 'G1-R1' : 'G4-R1')}
                            </p>
                            <span className="text-[8px] font-black bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 ml-2 shrink-0">B</span>
                          </div>
                          {getSlotBName(activeGroup as 'G3' | 'G4' | 'G5') ? (
                            <p className="text-sm font-black text-emerald-400 animate-fadeIn">{getSlotBName(activeGroup as 'G3' | 'G4' | 'G5')}</p>
                          ) : (
                            <p className="text-[10px] font-bold text-slate-500 italic">A definir por pontos...</p>
                          )}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BracketView;
