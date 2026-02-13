
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Layout from './components/Layout';
import Home from './components/Studio/Home';
import BracketView from './components/Studio/BracketView';
import ScheduleView from './components/Studio/ScheduleView';
import AdminPanel from './components/Studio/AdminPanel';
import RankingView from './components/Studio/RankingView';
import { StudioTab, TournamentState, Match, Player, GroupId } from './types';

const INITIAL_PLAYER_NAMES = [
  "Diogo Shan", "Renato Albino", "Igor Tobultoc", "Pedro Rodrigues", 
  "Salvador Rodrigues", "Rafael Gonçalves", "Daniil Anfinogenov", "Daniel Rodrigues",
  "Pedro Borges", "Chirag Carsane", "Alexandre Blanch", "Gonçalo Arriegas",
  "Afonso Santos", "Rodrigu Rus", "Francisco Azevedo", "Nuno Santos",
  "Ruben Smet", "Shamin Sayed", "Margarida Rato", "Francisco Godinho", "Catarina Neves"
];

const INITIAL_PLAYERS: Player[] = INITIAL_PLAYER_NAMES.map((name, i) => ({
  id: `p-${i + 1}`,
  name: name
}));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>(StudioTab.HOME);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedPlayer, setLoggedPlayer] = useState<Player | null>(() => {
    try {
      const saved = localStorage.getItem('goodminton_state_v5_g2pool_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loginInput, setLoginInput] = useState('');
  
  const [tournament, setTournament] = useState<TournamentState>(() => {
    try {
      const saved = localStorage.getItem('goodminton_state_v5_g2pool');
      if (saved) return JSON.parse(saved);
    } catch {
      // Tampered or corrupted localStorage; use default state
    }

    const matches: Match[] = [];
    
    // --- G1: MAIN GAMES (Ronda 1, 2, 3) ---
    for(let i = 0; i < 10; i++) {
      matches.push({
        id: `G1-R0-M${i+1}`, groupId: 'G1', round: 0, label: 'G1-R1: Fase Inicial',
        player1Id: INITIAL_PLAYERS[i*2].id, player2Id: INITIAL_PLAYERS[i*2+1].id, status: 'pending'
      });
    }
    for(let i = 0; i < 5; i++) {
      matches.push({ id: `G1-R1-M${i+1}`, groupId: 'G1', round: 1, label: 'G1-R2: Pré-Classificados', player1Id: null, player2Id: null, status: 'pending' });
    }
    for(let i = 0; i < 3; i++) {
      matches.push({ 
        id: `G1-R2-M${i+1}`, 
        groupId: 'G1', 
        round: 2, 
        label: 'G1-R3: Classificados', 
        player1Id: null, 
        player2Id: i === 2 ? INITIAL_PLAYERS[20].id : null, 
        status: 'pending' 
      });
    }

    // --- GC: FASE FINAL ---
    matches.push({ id: `GC-R0-M1`, groupId: 'GC', round: 0, label: 'Pool Final: Jogo 1', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `GC-R0-M2`, groupId: 'GC', round: 0, label: 'Pool Final: Jogo 2', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `GC-R0-M3`, groupId: 'GC', round: 0, label: 'Pool Final: Jogo 3', player1Id: null, player2Id: null, status: 'pending' });

    // --- G2: SEMI-LOSERS (R3) ---
    matches.push({ id: `G2-R0-M1`, groupId: 'G2', round: 0, label: 'Pool G2: Jogo 1', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G2-R0-M2`, groupId: 'G2', round: 0, label: 'Pool G2: Jogo 2', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G2-R0-M3`, groupId: 'G2', round: 0, label: 'Pool G2: Jogo 3', player1Id: null, player2Id: null, status: 'pending' });

    // --- G3: LOSERS R2 (PLAYOFF + POOL) ---
    matches.push({ id: `G3-R0-M1`, groupId: 'G3', round: 0, label: 'Playoff G3: Jogo A', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G3-R0-M2`, groupId: 'G3', round: 0, label: 'Playoff G3: Jogo B', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G3-R1-M1`, groupId: 'G3', round: 1, label: 'Pool G3: Jogo 1', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G3-R1-M2`, groupId: 'G3', round: 1, label: 'Pool G3: Jogo 2', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G3-R1-M3`, groupId: 'G3', round: 1, label: 'Pool G3: Jogo 3', player1Id: null, player2Id: null, status: 'pending' });

    // --- G4: LOSERS R1 ---
    for(let i = 0; i < 5; i++) {
        matches.push({ id: `G4-R0-M${i+1}`, groupId: 'G4', round: 0, label: 'Playoff G4: Jogo ' + (i+1), player1Id: null, player2Id: null, status: 'pending' });
    }
    for(let i = 0; i < 3; i++) {
        matches.push({ id: `G4-R1-M${i+1}`, groupId: 'G4', round: 1, label: 'G4-R2: Jogo ' + (i+1), player1Id: null, player2Id: null, status: 'pending' });
    }
    for(let i = 0; i < 3; i++) {
        matches.push({ id: `G4-R2-M${i+1}`, groupId: 'G4', round: 2, label: 'Pool G4: Jogo ' + (i+1), player1Id: null, player2Id: null, status: 'pending' });
    }

    // --- G5: PERDEDORES G4 ---
    matches.push({ id: `G5-R0-M1`, groupId: 'G5', round: 0, label: 'Playoff G5: Jogo 1', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G5-R0-M2`, groupId: 'G5', round: 0, label: 'Playoff G5: Jogo 2', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G5-R1-M1`, groupId: 'G5', round: 1, label: 'Pool G5: Jogo 1', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G5-R1-M2`, groupId: 'G5', round: 1, label: 'Pool G5: Jogo 2', player1Id: null, player2Id: null, status: 'pending' });
    matches.push({ id: `G5-R1-M3`, groupId: 'G5', round: 1, label: 'Pool G5: Jogo 3', player1Id: null, player2Id: null, status: 'pending' });

    return {
      players: INITIAL_PLAYERS,
      matches: matches,
      rankings: Object.fromEntries(Array.from({length: 21}, (_, i) => [i + 1, null]))
    };
  });

  useEffect(() => {
    localStorage.setItem('goodminton_state_v5_g2pool', JSON.stringify(tournament));
  }, [tournament]);

  useEffect(() => {
    if (loggedPlayer) {
      localStorage.setItem('goodminton_state_v5_g2pool_user', JSON.stringify(loggedPlayer));
    } else {
      localStorage.removeItem('goodminton_state_v5_g2pool_user');
    }
  }, [loggedPlayer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = INITIAL_PLAYERS.find(p => p.name.toLowerCase() === loginInput.trim().toLowerCase());
    if (found) {
      setLoggedPlayer(found);
    } else {
      alert("Atleta não encontrado. Por favor, insere o nome de um jogador oficial.");
    }
  };

  const handleLogout = () => {
    setLoggedPlayer(null);
    setIsAdmin(false);
  };

  const updateMatch = (updatedMatch: Match) => {
    setTournament(prev => {
      const { winnerId, loserId, id, groupId, round } = updatedMatch;
      let newMatches = prev.matches.map(m => m.id === id ? updatedMatch : m);

      if (groupId === 'G1') {
        const matchNum = parseInt(id.split('-M')[1]);

        if (winnerId) {
          let targetMatchId = '';
          let isPlayer1 = false;

          if (round === 0) { // Ronda 1 -> Ronda 2
            targetMatchId = `G1-R1-M${Math.ceil(matchNum / 2)}`;
            isPlayer1 = matchNum % 2 !== 0;
          } else if (round === 1) { // Ronda 2 -> Ronda 3
            if (matchNum <= 4) {
              targetMatchId = `G1-R2-M${Math.ceil(matchNum / 2)}`;
              isPlayer1 = matchNum % 2 !== 0;
            } else if (matchNum === 5) {
              targetMatchId = `G1-R2-M3`;
              isPlayer1 = true;
            }
          } else if (round === 2) { // Ronda 3 -> Final
            if (matchNum === 1) {
              newMatches = newMatches.map(m => {
                if (m.id === 'GC-R0-M1') return { ...m, player1Id: winnerId };
                if (m.id === 'GC-R0-M3') return { ...m, player2Id: winnerId };
                return m;
              });
            } else if (matchNum === 2) {
              newMatches = newMatches.map(m => {
                if (m.id === 'GC-R0-M1') return { ...m, player2Id: winnerId };
                if (m.id === 'GC-R0-M2') return { ...m, player1Id: winnerId };
                return m;
              });
            } else if (matchNum === 3) {
              newMatches = newMatches.map(m => {
                if (m.id === 'GC-R0-M2') return { ...m, player2Id: winnerId };
                if (m.id === 'GC-R0-M3') return { ...m, player1Id: winnerId };
                return m;
              });
            }
          }

          if (targetMatchId) {
            newMatches = newMatches.map(m => m.id === targetMatchId ? { ...m, [isPlayer1 ? 'player1Id' : 'player2Id']: winnerId } : m);
          }
        }

        if (loserId) {
          if (round === 0) { // Perdedores Ronda 1 -> G4
            const g1r0Matches = newMatches.filter(m => m.groupId === 'G1' && m.round === 0);
            const targetG4Idx = g1r0Matches.findIndex(m => m.id === id);
            const g4MatchId = `G4-R0-M${Math.ceil((targetG4Idx + 1) / 2)}`;
            const isP1 = (targetG4Idx + 1) % 2 !== 0;
            newMatches = newMatches.map(m => m.id === g4MatchId ? { ...m, [isP1 ? 'player1Id' : 'player2Id']: loserId } : m);
          } else if (round === 1) { // Perdedores Ronda 2 -> G3
            const g1r1Matches = newMatches.filter(m => m.groupId === 'G1' && m.round === 1);
            const allFinished = g1r1Matches.every(m => m.status === 'completed');
            if (allFinished) {
              const losersWithScores = g1r1Matches.map(m => ({
                id: m.loserId!,
                score: m.loserId === m.player1Id ? (m.score1 || 0) : (m.score2 || 0)
              })).sort((a, b) => b.score - a.score);
              const bestLoser = losersWithScores[0].id;
              const others = losersWithScores.slice(1).map(l => l.id);
              newMatches = newMatches.map(m => {
                if (m.id === 'G3-R0-M1') return { ...m, player1Id: others[0], player2Id: others[1] };
                if (m.id === 'G3-R0-M2') return { ...m, player1Id: others[2], player2Id: others[3] };
                if (m.id === 'G3-R1-M1') return { ...m, player2Id: bestLoser };
                if (m.id === 'G3-R1-M3') return { ...m, player1Id: bestLoser };
                return m;
              });
            }
          } else if (round === 2) { // Perdedores Ronda 3 -> G2
            if (matchNum === 1) {
              newMatches = newMatches.map(m => {
                if (m.id === 'G2-R0-M1') return { ...m, player1Id: loserId };
                if (m.id === 'G2-R0-M3') return { ...m, player2Id: loserId };
                return m;
              });
            } else if (matchNum === 2) {
              newMatches = newMatches.map(m => {
                if (m.id === 'G2-R0-M1') return { ...m, player2Id: loserId };
                if (m.id === 'G2-R0-M2') return { ...m, player1Id: loserId };
                return m;
              });
            } else if (matchNum === 3) {
              newMatches = newMatches.map(m => {
                if (m.id === 'G2-R0-M2') return { ...m, player2Id: loserId };
                if (m.id === 'G2-R0-M3') return { ...m, player1Id: loserId };
                return m;
              });
            }
          }
        }
      }

      // --- G3 Progression ---
      if (groupId === 'G3' && round === 0 && winnerId) {
        const matchNum = parseInt(id.split('-M')[1]);
        if (matchNum === 1) {
          newMatches = newMatches.map(m => {
            if (m.id === 'G3-R1-M1') return { ...m, player1Id: winnerId };
            if (m.id === 'G3-R1-M2') return { ...m, player1Id: winnerId };
            return m;
          });
        } else if (matchNum === 2) {
          newMatches = newMatches.map(m => {
            if (m.id === 'G3-R1-M2') return { ...m, player2Id: winnerId };
            if (m.id === 'G3-R1-M3') return { ...m, player2Id: winnerId };
            return m;
          });
        }
      }

      // --- G4 Progression ---
      if (groupId === 'G4') {
          const matchNum = parseInt(id.split('-M')[1]);
          if (round === 0) { // Playoffs
              if (winnerId) {
                let targetMatchId = '';
                let isPlayer1 = false;
                if (matchNum === 1 || matchNum === 2) {
                    targetMatchId = 'G4-R1-M1';
                    isPlayer1 = matchNum === 1;
                } else if (matchNum === 3 || matchNum === 4) {
                    targetMatchId = 'G4-R1-M2';
                    isPlayer1 = matchNum === 3;
                } else if (matchNum === 5) {
                    targetMatchId = 'G4-R1-M3';
                    isPlayer1 = true;
                }
                if (targetMatchId) {
                    newMatches = newMatches.map(m => m.id === targetMatchId ? { ...m, [isPlayer1 ? 'player1Id' : 'player2Id']: winnerId } : m);
                }
              }
              
              const g4r0Matches = newMatches.filter(m => m.groupId === 'G4' && m.round === 0);
              const allG4R0Finished = g4r0Matches.every(m => m.status === 'completed');
              if (allG4R0Finished) {
                  // Winners go to G4-R1, Losers go to G5-R0
                  const losersWithScores = g4r0Matches.map(m => ({
                    id: m.loserId!,
                    score: m.loserId === m.player1Id ? (m.score1 || 0) : (m.score2 || 0)
                  })).sort((a, b) => b.score - a.score);

                  // Best loser of G4-R0 fills Slot B for G4-R1-M3 (G1-R1 Source)
                  const bestLoserId = losersWithScores[0].id;
                  newMatches = newMatches.map(m => {
                    if (m.id === 'G4-R1-M3') return { ...m, player2Id: bestLoserId };
                    return m;
                  });

                  // Top 4 losers (including the best one) go to G5-R0
                  const g5PlayoffCandidates = losersWithScores.slice(0, 4).map(l => l.id);
                  newMatches = newMatches.map(m => {
                    if (m.id === 'G5-R0-M1') return { ...m, player1Id: g5PlayoffCandidates[0], player2Id: g5PlayoffCandidates[1] };
                    if (m.id === 'G5-R0-M2') return { ...m, player1Id: g5PlayoffCandidates[2], player2Id: g5PlayoffCandidates[3] };
                    return m;
                  });
              }
          } else if (round === 1) { // Fase Intermédia
              if (winnerId) {
                  if (matchNum === 1) {
                      newMatches = newMatches.map(m => {
                        if (m.id === 'G4-R2-M1') return { ...m, player1Id: winnerId };
                        if (m.id === 'G4-R2-M3') return { ...m, player2Id: winnerId };
                        return m;
                      });
                  } else if (matchNum === 2) {
                      newMatches = newMatches.map(m => {
                        if (m.id === 'G4-R2-M1') return { ...m, player2Id: winnerId };
                        if (m.id === 'G4-R2-M2') return { ...m, player1Id: winnerId };
                        return m;
                      });
                  } else if (matchNum === 3) {
                      newMatches = newMatches.map(m => {
                        if (m.id === 'G4-R2-M2') return { ...m, player2Id: winnerId };
                        if (m.id === 'G4-R2-M3') return { ...m, player1Id: winnerId };
                        return m;
                      });
                  }
              }
              
              const g4r1Matches = newMatches.filter(m => m.groupId === 'G4' && m.round === 1);
              const allG4R1Finished = g4r1Matches.every(m => m.status === 'completed');
              if (allG4R1Finished) {
                  const losersWithScores = g4r1Matches.map(m => ({
                    id: m.loserId!,
                    score: m.loserId === m.player1Id ? (m.score1 || 0) : (m.score2 || 0)
                  })).sort((a, b) => b.score - a.score);
                  
                  const bestLoserId = losersWithScores[0].id; // Best loser of G4-R1 (Fase Intermédia)
                  // Best loser of G4-R1 goes to G5 Pool as Slot B
                  newMatches = newMatches.map(m => {
                    if (m.id === 'G5-R1-M1') return { ...m, player2Id: bestLoserId };
                    if (m.id === 'G5-R1-M3') return { ...m, player1Id: bestLoserId };
                    return m;
                  });
              }
          }
      }

      // --- G5 Progression ---
      if (groupId === 'G5') {
        const matchNum = parseInt(id.split('-M')[1]);
        if (round === 0 && winnerId) {
          if (matchNum === 1) {
            newMatches = newMatches.map(m => {
              if (m.id === 'G5-R1-M1') return { ...m, player1Id: winnerId };
              if (m.id === 'G5-R1-M2') return { ...m, player1Id: winnerId };
              return m;
            });
          } else if (matchNum === 2) {
            newMatches = newMatches.map(m => {
              if (m.id === 'G5-R1-M2') return { ...m, player2Id: winnerId };
              if (m.id === 'G5-R1-M3') return { ...m, player2Id: winnerId };
              return m;
            });
          }
        }
      }

      return { ...prev, matches: newMatches };
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case StudioTab.HOME: return <Home />;
      case StudioTab.BRACKET: return <BracketView state={tournament} />;
      case StudioTab.SCHEDULE: return <ScheduleView state={tournament} />;
      case StudioTab.RANKING: return <RankingView state={tournament} />;
      case StudioTab.ADMIN: return (
        <AdminPanel 
          state={tournament} 
          onUpdateMatch={updateMatch} 
          isLoggedIn={isAdmin} 
          onLogin={setIsAdmin} 
        />
      );
      default: return <Home />;
    }
  };

  if (!loggedPlayer) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        <form onSubmit={handleLogin} className="glass-effect p-10 rounded-[2.5rem] border border-slate-800 space-y-8 w-full max-w-md animate-fadeIn">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent italic tracking-tighter">
              GOODMINTON CT1
            </h1>
            <p className="text-slate-400 text-sm">Bem-vindo! Entra com o teu nome de atleta.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nome e Apelido</label>
              <input
                type="text"
                placeholder="Ex: Diogo Shan"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
              />
            </div>
            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
              Entrar no Torneio
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">Turma 12ºCT1 • 2026</p>
        </form>
      </div>
    );
  }

  return (
    <Layout 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      loggedPlayer={loggedPlayer} 
      matches={tournament.matches}
      sidebar={
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isAdmin={isAdmin} 
          loggedPlayer={loggedPlayer} 
          matches={tournament.matches} 
        />
      }
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
