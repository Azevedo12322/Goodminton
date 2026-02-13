
import React from 'react';
import { StudioTab, Player, Match, GroupId } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  isAdmin: boolean;
  loggedPlayer?: Player | null;
  matches?: Match[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isAdmin, loggedPlayer, matches = [] }) => {
  const navItems = [
    { id: StudioTab.HOME, label: 'Início', Icon: ICONS.Home },
    { id: StudioTab.BRACKET, label: 'Chaves (Grupos)', Icon: ICONS.Bracket },
    { id: StudioTab.SCHEDULE, label: 'Agenda', Icon: ICONS.Schedule },
    { id: StudioTab.RANKING, label: 'Classificação', Icon: ICONS.Dashboard },
    { id: StudioTab.ADMIN, label: 'Gestão Admin', Icon: ICONS.Admin },
  ];

  return (
    <aside className="w-64 glass-effect border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="p-8">
        <h1 className="text-xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent italic tracking-tighter">
          GOODMINTON_CT1
        </h1>
        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.2em] font-bold">Turma 12ºCT1 • 2026</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full flex items-center px-5 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
              activeTab === id
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-900/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Icon />
            <span className="ml-3">{label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-8 mt-auto border-t border-slate-900/50">
         <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em]">CT1 • 2026</p>
      </div>
    </aside>
  );
};

export default Sidebar;
