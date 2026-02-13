
import React, { useState } from 'react';
import { StudioTab, Player, Match, GroupId } from '../types';
import { ICONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  onLogout?: () => void;
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  loggedPlayer: Player | null;
  matches: Match[];
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  sidebar, 
  onLogout, 
  activeTab, 
  onTabChange, 
  loggedPlayer, 
  matches 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: StudioTab.HOME, label: 'Início', Icon: ICONS.Home },
    { id: StudioTab.BRACKET, label: 'Chaves', Icon: ICONS.Bracket },
    { id: StudioTab.SCHEDULE, label: 'Agenda', Icon: ICONS.Schedule },
    { id: StudioTab.RANKING, label: 'Classificação', Icon: ICONS.Dashboard },
    { id: StudioTab.ADMIN, label: 'Gestão Admin', Icon: ICONS.Admin },
  ];

  const getGroupLabel = (gid: GroupId) => {
    if (gid === 'GC') return 'Fase Final';
    return gid.replace('G', 'Grupo ');
  };

  const getPlayerStatus = () => {
    if (!loggedPlayer || !matches.length) return { group: 'N/A', nextInfo: 'Sem dados' };
    
    const userMatches = matches.filter(m => m.player1Id === loggedPlayer.id || m.player2Id === loggedPlayer.id);
    const activeGroupId = userMatches.length > 0 ? userMatches[userMatches.length - 1].groupId : 'G1' as GroupId;

    const pendingMatches = matches.filter(m => m.status === 'pending');
    const userNextMatchIdx = pendingMatches.findIndex(m => 
      m.player1Id === loggedPlayer.id || m.player2Id === loggedPlayer.id
    );

    let nextInfo = "";
    if (userNextMatchIdx === -1) nextInfo = "Concluído";
    else if (userNextMatchIdx === 0) nextInfo = "Jogas a seguir!";
    else nextInfo = `Jogo em ${userNextMatchIdx}`;

    return { group: getGroupLabel(activeGroupId), nextInfo };
  };

  const status = getPlayerStatus();
  const firstName = loggedPlayer?.name.split(' ')[0] || 'Atleta';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100 relative">
      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-out md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between border-b border-slate-800">
          <h1 className="text-lg font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent italic tracking-tighter px-1">
            GOODMINTON_CT1
          </h1>
          <button onClick={() => setIsMenuOpen(false)} className="text-slate-500 hover:text-white p-2 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => {
                onTabChange(id);
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center px-5 py-3.5 text-sm font-semibold rounded-2xl transition-all ${
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
      </div>

      {/* Main Sidebar (Desktop Only) */}
      {sidebar}

      <main className="flex-1 relative flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-4 md:px-8 glass-effect shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 rounded-xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            </button>
            <div className="text-xl font-black text-emerald-400 italic tracking-tighter shrink-0 pr-2">CT1</div>
          </div>

          {/* Central Status Info (Mobile & Desktop) */}
          <div className="flex-1 flex justify-center px-2">
            <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 bg-slate-900/50 border border-slate-800 rounded-full">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{firstName}</span>
              <div className="h-3 w-[1px] bg-slate-800" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{status.group}</span>
              <div className="h-3 w-[1px] bg-slate-800" />
              <span className="text-[10px] font-bold text-slate-200 uppercase tracking-tighter italic">{status.nextInfo}</span>
            </div>
            
            {/* Ultra-compact for small phones */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-[9px] font-black text-emerald-400 uppercase">{status.group}</span>
              <span className="text-[9px] text-slate-500">•</span>
              <span className="text-[9px] font-black text-slate-200">{status.nextInfo}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {onLogout && (
              <button 
                onClick={onLogout}
                className="px-3 md:px-4 py-1.5 bg-slate-900 hover:bg-red-900/20 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
              >
                <span className="hidden xs:inline">Sair</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
