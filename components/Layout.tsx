
import React, { useState } from 'react';
import { StudioTab, Player, Match, GroupId } from '../types';
import { ICONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  onLogout?: () => void;
  onRefresh?: () => void;
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  loggedPlayer: Player | null;
  matches: Match[];
  lastServerSavedAt?: string | null;
  storagePersistent?: boolean;
}

function formatLastUpdated(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffM = Math.floor(diffMs / 60000);
    if (diffM < 1) return 'agora';
    if (diffM < 60) return `há ${diffM} min`;
    const diffH = Math.floor(diffM / 60);
    if (diffH < 24) return `há ${diffH}h`;
    return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  sidebar, 
  onLogout, 
  onRefresh,
  activeTab, 
  onTabChange, 
  loggedPlayer, 
  matches,
  lastServerSavedAt,
  storagePersistent,
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
            GOODMINTON CT1
          </h1>
          <button onClick={() => setIsMenuOpen(false)} className="text-slate-500 hover:text-white p-3 -m-2 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation" aria-label="Fechar menu">
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
              className={`w-full flex items-center px-5 py-3.5 min-h-[48px] text-sm font-semibold rounded-2xl transition-all touch-manipulation ${
                activeTab === id
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-900/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 active:bg-slate-800'
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
        <header className="h-14 sm:h-16 border-b border-slate-800/50 flex items-center justify-between px-3 sm:px-4 md:px-8 glass-effect shrink-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-3 -m-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 rounded-xl transition-all touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Abrir menu"
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
          <div className="flex-1 flex justify-center items-center gap-2 px-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors touch-manipulation"
                title="Atualizar resultados"
                aria-label="Atualizar resultados"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            )}
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
            {lastServerSavedAt && (
              <span className="hidden md:inline text-[10px] text-slate-500 ml-1" title={lastServerSavedAt}>
                Atualizado {formatLastUpdated(lastServerSavedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {onLogout && (
              <button 
                onClick={onLogout}
                className="px-3 md:px-4 py-2.5 min-h-[44px] bg-slate-900 hover:bg-red-900/20 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group touch-manipulation"
              >
                <span className="hidden sm:inline">Sair</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            )}
          </div>
        </header>
        {storagePersistent === false && (
          <div className="shrink-0 px-3 sm:px-4 md:px-8 py-2 bg-amber-500/15 border-b border-amber-500/30 text-amber-200/90 text-xs">
            <strong>PC e telemóvel podem mostrar dados diferentes.</strong> No Railway: adicionar um volume (montar <code className="bg-slate-800/50 px-1 rounded">/data</code>) e variável <code className="bg-slate-800/50 px-1 rounded">DATA_PATH=/data</code>.
          </div>
        )}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-8 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-[calc(2rem+env(safe-area-inset-bottom,0px))] overscroll-behavior-y-contain">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
