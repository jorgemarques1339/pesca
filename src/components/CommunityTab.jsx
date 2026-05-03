import React from 'react';
import { Heart, MessageCircle, Share2, MapPin, Trophy, Users as UsersIcon, Plus, CheckCircle2, Coins } from 'lucide-react';
import EliteTab from './EliteTab';

const MOCK_POSTS = [
  {
    id: 1,
    user: "João Pesca",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    time: "Há 2 horas",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    species: "Robalo",
    weight: "2.1 kg",
    location: "Costa de Peniche",
    likes: 24,
    comments: 5
  },
  {
    id: 2,
    user: "Mestre Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Silva",
    time: "Há 5 horas",
    image: "https://images.unsplash.com/photo-1599596632007-88544e314649?auto=format&fit=crop&w=600&q=80",
    species: "Sargo",
    weight: "0.8 kg",
    location: "Cabo Espichel",
    likes: 18,
    comments: 2
  },
  {
    id: 3,
    user: "Ana Marítima",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    time: "Ontem",
    image: "https://images.unsplash.com/photo-1507421303102-3c2250c6081e?auto=format&fit=crop&w=600&q=80",
    species: "Dourada",
    weight: "1.5 kg",
    location: "Ria de Aveiro",
    likes: 56,
    comments: 12
  },
  {
    id: 100,
    type: "tournament",
    user: "Clube Naval Setúbal",
    isPremium: true,
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Clube",
    time: "Aberto agora",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    title: "Torneio Open de Choco 🦑",
    stake: "50 $PESCA",
    votes: 42,
    endsIn: "4h 20m"
  }
];

const CommunityTab = ({ active, logs }) => {
  const [activeSubTab, setActiveSubTab] = React.useState('social'); // 'social' or 'elite'
  
  const [localPosts, setLocalPosts] = React.useState(() => {
    const saved = localStorage.getItem("community_posts");
    return saved ? JSON.parse(saved) : [];
  });

  const allPosts = [...localPosts, ...MOCK_POSTS];

  return (
    <div className="content-container" style={{ display: active ? 'block' : 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 className="ios-large-title" style={{ margin: 0 }}>
            {activeSubTab === 'social' ? 'Comunidade' : 'Elite'}
          </h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {activeSubTab === 'social' ? 'O que está a morder na costa' : 'Ranking & Competições'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Elite/Social Toggle */}
          <button 
            onClick={() => setActiveSubTab(activeSubTab === 'social' ? 'elite' : 'social')}
            style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '16px', 
              padding: '8px 12px', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              color: activeSubTab === 'elite' ? '#FFD700' : 'var(--text-primary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              minWidth: '80px'
            }}
          >
            {activeSubTab === 'social' ? (
              <>
                <Trophy size={20} />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: 0.5 }}>TORNEIOS</span>
              </>
            ) : (
              <>
                <UsersIcon size={20} />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: 0.5 }}>SOCIAL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {activeSubTab === 'social' ? (
        <div className="instagram-feed" style={{ maxWidth: '500px', margin: '0 auto' }}>
          {/* Stories Bar */}
          <div className="stories-bar" style={{ 
            display: 'flex', 
            gap: '15px', 
            padding: '10px 0 20px 0', 
            overflowX: 'auto', 
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '10px',
            scrollbarWidth: 'none'
          }}>
            {['O teu story', 'Mestre Silva', 'Ana Mar', 'João P.', 'Sofia'].map((name, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px', gap: '5px' }}>
                <div style={{ 
                  padding: '2px', 
                  borderRadius: '50%', 
                  background: i === 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' 
                }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '50%', 
                    background: '#222',
                    border: '2px solid var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: i === 0 ? '20px' : '10px'
                  }}>
                    {i === 0 ? '+' : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} style={{ width: '100%', borderRadius: '50%' }} alt="" />}
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
              </div>
            ))}
          </div>

          {allPosts.map(post => {
            if (post.type === 'tournament') {
              return (
                <div key={post.id} className="insta-card tournament-card" style={{ 
                  background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)', 
                  borderRadius: '24px', 
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ border: '2px solid #FFD700', borderRadius: '50%', padding: '2px' }}>
                      <img src={post.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#FFD700' }}>{post.user} ⭐</h4>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{post.time} • Expira em {post.endsIn}</span>
                    </div>
                  </div>

                  <div style={{ padding: '0 16px 16px 16px' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1.4rem', fontWeight: 800 }}>{post.title}</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <button 
                        onClick={() => alert("Presença Confirmada!")}
                        style={{ 
                          background: 'rgba(255,215,0,0.1)', 
                          border: '1px solid #FFD700', 
                          borderRadius: '12px', 
                          padding: '12px', 
                          color: '#FFD700',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <CheckCircle2 size={24} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>CONFIRMAR (VOTAR)</span>
                        <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>{post.votes} confirmados</span>
                      </button>

                      <button 
                        onClick={() => alert("Janela de Apostas Aberta: 50 $PESCA")}
                        style={{ 
                          background: 'rgba(0,242,255,0.1)', 
                          border: '1px solid #00f2ff', 
                          borderRadius: '12px', 
                          padding: '12px', 
                          color: '#00f2ff',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Coins size={24} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>APOSTAR</span>
                        <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>Stake: {post.stake}</span>
                      </button>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      <strong>Regras:</strong> Maior exemplar de Robalo capturado entre as 06:00 e as 12:00. Local: Setúbal.
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={post.id} className="insta-card" style={{ 
                background: 'var(--bg-secondary)', 
                borderRadius: '0', 
                marginBottom: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)' 
              }}>
                {/* Header: Avatar + User */}
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    padding: '2px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' 
                  }}>
                    <img src={post.avatar} alt={post.user} style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: '#fff',
                      display: 'block',
                      border: '2px solid var(--bg-secondary)'
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{post.user}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                      <MapPin size={10} /> {post.location}
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>•••</button>
                </div>
                
                {/* Image: Full Width Square */}
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '1/1', 
                  background: `url(${post.image}) center/cover`,
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }} />
                
                {/* Actions */}
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                    <Heart size={24} style={{ cursor: 'pointer' }} />
                    <MessageCircle size={24} style={{ cursor: 'pointer' }} />
                    <Share2 size={24} style={{ cursor: 'pointer' }} />
                    <div style={{ marginLeft: 'auto' }}>
                      <Trophy size={22} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  </div>
                  
                  {/* Engagement Info */}
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>
                    {post.likes} gostos
                  </div>
                  
                  {/* Caption */}
                  <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>{post.user}</span>
                    Novo recorde de <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{post.species}</span> com {post.weight}! A maré estava perfeita. 🎣
                  </div>
                  
                  {/* Comments Link */}
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', cursor: 'pointer' }}>
                    Ver os {post.comments} comentários
                  </div>
                  
                  {/* Time */}
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', marginTop: '8px' }}>
                    {post.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="elite-sub-container">
          {/* Premium Create Section */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: 'rgba(255,215,0,0.05)', 
            padding: '16px', 
            borderRadius: '20px', 
            border: '1px dashed rgba(255,215,0,0.3)',
            marginBottom: '24px'
          }}>
            <div>
              <h4 style={{ margin: 0, color: '#FFD700', fontSize: '1rem' }}>És um utilizador Premium?</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Cria o teu próprio torneio e gere a comunidade.</p>
            </div>
            <button 
              onClick={() => alert("Funcionalidade Premium: Criar Novo Torneio")}
              style={{ 
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', 
                border: 'none', 
                borderRadius: '12px', 
                padding: '10px 20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                color: '#000',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
              }}
            >
              <Plus size={18} />
              <span style={{ fontSize: '0.8rem' }}>CRIAR NOVO</span>
            </button>
          </div>

          <EliteTab active={true} logs={logs} embedded={true} />
        </div>
      )}
    </div>
  );
};

export default CommunityTab;
