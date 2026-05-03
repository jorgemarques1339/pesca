import React from 'react';
import { Trophy, Medal, Target, TrendingUp, Users } from 'lucide-react';
import { getUnlockedAchievements, ACHIEVEMENTS } from '../utils/achievementUtils';

const MOCK_LEADERBOARD = [
  { rank: 1, user: "Mestre Manuel", points: 2450, catches: 12 },
  { rank: 2, user: "Pescador_PT", points: 2100, catches: 9 },
  { rank: 3, user: "Sofia Mar", points: 1850, catches: 7 },
  { rank: 4, user: "Rui Vara", points: 1200, catches: 5 },
];

const EliteTab = ({ active, logs, embedded }) => {
  const unlocked = getUnlockedAchievements(logs);
  const progress = (unlocked.length / ACHIEVEMENTS.length) * 100;

  return (
    <div className={embedded ? "" : "content-container"} style={{ display: active ? 'block' : 'none', padding: embedded ? 0 : undefined }}>
      {!embedded && <h1 className="ios-large-title">Elite Pescador</h1>}
      
      {/* Active Tournament Section */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 24, border: '1px solid rgba(255, 215, 0, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Trophy color="#FFD700" size={24} />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Grande Troféu do Robalo</h2>
          </div>
          <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255,215,0,0.1)', color: '#FFD700', borderRadius: 10, fontWeight: 700 }}>LIVE</span>
        </div>

        <div className="leaderboard" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOCK_LEADERBOARD.map((item) => (
            <div key={item.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, width: 24, color: item.rank <= 3 ? '#FFD700' : 'var(--text-secondary)' }}>{item.rank}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.user}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>{item.catches} capturas válidas</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{item.points} pts</span>
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: 8, background: 'linear-gradient(to right, #FFD700, #FFA500)', color: '#000' }}>
            Aderir ao Torneio
          </button>
        </div>
      </div>

      {/* Achievements Section */}
      <h2 style={{ fontSize: '1.3rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Medal size={20} color="var(--accent-blue)" />
        Conquistas e Medalhas
      </h2>
      
      <div style={{ marginBottom: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.8rem' }}>
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
            <div key={ach.id} className="glass-panel" style={{ padding: 16, opacity: isUnlocked ? 1 : 0.4, border: isUnlocked ? '1px solid var(--accent-blue)' : '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{isUnlocked ? ach.icon : "🔒"}</div>
              <h4 style={{ fontSize: '0.9rem', margin: '0 0 4px 0' }}>{ach.name}</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>{ach.description}</p>
            </div>
          );
        })}
      </div>

      {/* Personal Stats Mini-Insights */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <TrendingUp size={20} color="var(--accent-cyan)" />
          Estatística Pessoal
        </h2>
        <div className="glass-panel" style={{ padding: 16, textAlign: 'center' }}>
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
