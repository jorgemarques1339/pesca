import React from 'react';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';

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
  }
];

const CommunityTab = ({ active }) => {
  return (
    <div className="content-container" style={{ display: active ? 'block' : 'none', position: 'absolute', top: '70px', zIndex: 5, width: '100%', paddingBottom: '120px' }}>
      <h1 className="ios-large-title">Comunidade</h1>
      <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20}}>Vê o que está a morder na costa portuguesa.</p>
      
      <div className="feed-container">
        {MOCK_POSTS.map(post => (
          <div key={post.id} className="post-card" style={{ background: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={post.avatar} alt={post.user} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{post.user}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{post.time}</span>
              </div>
            </div>
            
            <div style={{ width: '100%', height: '250px', background: `url(${post.image}) center/cover` }} />
            
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent-blue)' }}>{post.species} <span style={{color: 'var(--text-primary)', fontSize: '1rem'}}>({post.weight})</span></h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                    <MapPin size={14} /> {post.location}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer' }}>
                  <Heart size={20} /> {post.likes}
                </button>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer' }}>
                  <MessageCircle size={20} /> {post.comments}
                </button>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', marginLeft: 'auto', cursor: 'pointer' }}>
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityTab;
