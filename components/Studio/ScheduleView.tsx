
import React from 'react';
import { TournamentState } from '../../types';

interface ScheduleViewProps {
  state: TournamentState;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ state }) => {
  const upcoming = state.matches.filter(m => m.status === 'pending' && m.player1Id && m.player2Id);

  const getPlayerName = (id: string | null) => {
    return state.players.find(p => p.id === id)?.name || '???';
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Próximos Encontros</h2>
      
      {upcoming.length === 0 ? (
        <div className="glass-effect p-20 rounded-[3rem] text-center border-dashed border-2 border-slate-800">
          <p className="text-slate-500 font-medium">Não há jogos agendados de momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcoming.map((match) => (
            <div key={match.id} className="glass-effect p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 flex items-center justify-center hover:border-emerald-500/30 transition-all group">
              <div className="flex-1 flex items-center justify-between sm:justify-around gap-2 sm:gap-8">
                <div className="text-center flex-1 min-w-0">
                  <p className="text-[13px] sm:text-lg md:text-xl font-bold text-white truncate sm:whitespace-normal">
                    {getPlayerName(match.player1Id)}
                  </p>
                </div>
                
                <div className="text-center shrink-0 px-2 sm:px-8">
                  <div className="text-xl sm:text-3xl font-black text-emerald-500 italic tracking-tighter">VS</div>
                </div>

                <div className="text-center flex-1 min-w-0">
                  <p className="text-[13px] sm:text-lg md:text-xl font-bold text-white truncate sm:whitespace-normal">
                    {getPlayerName(match.player2Id)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
