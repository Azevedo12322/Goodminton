
import React from 'react';
import { ICONS } from '../../constants';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 py-4 sm:py-8 px-1 animate-fadeIn">
      <header className="text-center space-y-3 sm:space-y-4">
        <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black tracking-widest uppercase">
          Site Oficial
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
          Acompanha o Torneio <br/> 
          <span className="text-emerald-500">12ºCT1</span>
        </h1>
        <p className="text-base sm:text-xl text-slate-400 font-medium px-2">
          Acompanha por aqui o torneio de badminton da turma 12ºCT1.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          { 
            title: 'Chaves Dinâmicas', 
            desc: 'Vê quem está a ganhar e quem são os próximos adversários no nosso sistema de grupos multinível.',
            icon: ICONS.Bracket
          },
          { 
            title: 'Agenda Atualizada', 
            desc: 'Não percas nenhum match. Aqui podes verificar quando é que cada aluno vai competir.',
            icon: ICONS.Schedule
          },
          { 
            title: 'Resultados em Tempo Real', 
            desc: 'Atualizações imediatas após cada jogo para saberes quem avança na competição.',
            icon: ICONS.Home
          }
        ].map((feat, i) => (
          <div key={i} className="glass-effect p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-slate-800 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <feat.icon />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{feat.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-effect rounded-2xl sm:rounded-[3rem] p-5 sm:p-10 overflow-hidden relative border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10" />
        <div className="relative z-10 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold">O que podes ver aqui?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-emerald-500 mt-1">●</div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <strong className="text-white">Progressão Multinível:</strong> Uma estrutura de 21 jogadores que garante caminhos de progressão estratégica para que todos disputem a sua posição final.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-500 mt-1">●</div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <strong className="text-white">Estatísticas e Rankings:</strong> Aqui poderás verificar os jogadores mais consistentes e melhor qualificados no Ranking dos Loios.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-emerald-500 mt-1">●</div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <strong className="text-white">Sistema de Pontos:</strong> Algoritmo que calcula a classificação final de 1º a 21º lugar com base no desempenho acumulado.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-500 mt-1">●</div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <strong className="text-white">Gestão Centralizada:</strong> Tudo o que precisas de saber sobre o torneio da turma, desde a fase de grupos até à Grande Final, num só lugar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
