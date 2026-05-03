import React from 'react';
import { Trophy, Medal, Target, TrendingUp, Users, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { getUnlockedAchievements, ACHIEVEMENTS } from '../utils/achievementUtils';
import { useAppContext } from '../context/AppContext';

const MOCK_LEADERBOARD = [
  { rank: 1, user: "Mestre Manuel", points: 2450, catches: 12 },
  { rank: 2, user: "Pescador_PT", points: 2100, catches: 9 },
  { rank: 3, user: "Sofia Mar", points: 1850, catches: 7 },
  { rank: 4, user: "Rui Vara", points: 1200, catches: 5 },
];

const EliteTab = ({ active, embedded }) => {
  const { logs } = useAppContext();
  const unlocked = getUnlockedAchievements(logs);
  const progress = (unlocked.length / ACHIEVEMENTS.length) * 100;

  return (
    <div className={embedded ? "" : "content-container"} style={{ display: active ? 'block' : 'none', padding: embedded ? 0 : undefined }}>
      {!embedded && <h1 className="ios-large-title">Elite Pescador</h1>}
      
      {/* Active Tournament Section */}
      <div className="glass-panel p-20 mb-24 border-gold">
        <div className="flex-between mb-16">
          <div className="flex-center gap-10">
            <Trophy color="#FFD700" size={24} />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Grande Troféu do Robalo</h2>
          </div>
          <span className="badge-live">LIVE</span>
        </div>

        <div className="tournament-meta mb-16" style={{ display: 'flex', gap: '20px' }}>
          <div className="meta-item">
            <Clock size={14} color="rgba(255,255,255,0.5)" />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Termina em: <strong style={{ color: '#FFD700' }}>04:22:15</strong></span>
          </div>
          <div className="meta-item">
            <Users size={14} color="rgba(255,255,255,0.5)" />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Participantes: <strong>42</strong></span>
          </div>
        </div>

        {/* Tournament Progress Bar */}
        <div style={{ marginBottom: 20 }}>
          <div className="flex-between mb-8">
            <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>Progresso do Torneio</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#FFD700' }}>65%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '65%', height: '100%', background: 'linear-gradient(to right, #FFD700, #FFA500)', boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}></div>
          </div>
        </div>

        <div className="leaderboard" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOCK_LEADERBOARD.map((item) => (
            <div key={item.rank} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              padding: '12px 16px', 
              background: item.rank === 1 ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.03)', 
              borderRadius: 16,
              border: item.rank === 1 ? '1px solid rgba(255,215,0,0.2)' : '1px solid transparent'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, width: 24, color: item.rank === 1 ? '#FFD700' : item.rank === 2 ? '#C0C0C0' : item.rank === 3 ? '#CD7F32' : 'var(--text-secondary)' }}>{item.rank}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.user}</span>
                  {item.rank === 1 && <ShieldCheck size={12} color="#FFD700" />}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>{item.catches} capturas • Robalo 72cm</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>{item.points}</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: 700 }}>PONTOS</div>
              </div>
            </div>
          ))}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <button className="btn-primary" style={{ background: 'linear-gradient(to right, #FFD700, #FFA500)', color: '#000', fontWeight: 800, border: 'none', borderRadius: '12px', padding: '12px' }}>
              ADERIR
            </button>
            <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <MessageSquare size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>CHAT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <h2 style={{ fontSize: '1.3rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Medal size={20} color="var(--accent-blue)" />
        Conquistas e Medalhas
      </h2>
      
      <div style={{ marginBottom: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
        <div className="flex-between mb-8" style={{ fontSize: '0.8rem' }}>
          <span>Progresso Elite</span>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{unlocked.length}/{ACHIEVEMENTS.length}</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: 3, transition: 'width 1s ease' }}></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlocked.some(u => u.id === ach.id);
          return (
            <div key={ach.id} className={`glass-panel p-16 ${isUnlocked ? 'border-blue' : ''}`} style={{ opacity: isUnlocked ? 1 : 0.4 }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{isUnlocked ? ach.icon : "🔒"}</div>
              <h4 style={{ fontSize: '0.9rem', margin: '0 0 4px 0' }}>{ach.name}</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>{ach.description}</p>
            </div>
          );
        })}
      </div>

      {/* Weekly Challenges Section */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Target size={20} color="var(--accent-orange)" />
          Desafios Semanais
        </h2>
        <div className="flex-col gap-12">
          <div className="glass-panel p-16 border-orange">
            <div className="flex-between mb-8">
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Mestre dos Sargos</span>
              <span className="badge-gold">100 $P</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>Captura 3 Sargos com mais de 20cm esta semana.</p>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <div style={{ width: '33%', height: '100%', background: 'var(--accent-orange)', boxShadow: '0 0 8px var(--accent-orange)' }}></div>
            </div>
            <span style={{ fontSize: '0.6rem', display: 'block', marginTop: '6px', opacity: 0.5 }}>1 / 3 CONCLUÍDO</span>
          </div>
        </div>
      </div>

      {/* Personal Stats Mini-Insights */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <TrendingUp size={20} color="var(--accent-cyan)" />
          Estatística Pessoal
        </h2>
        <div className="glass-panel p-16" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
            {logs.length > 0 
              ? `O teu isco mais mortífero: ${logs[0].bait || 'N/A'}`
              : "Regista a tua primeira captura para veres estatísticas!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default EliteTab;
