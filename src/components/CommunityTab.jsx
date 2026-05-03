import React from 'react';
import { Heart, MessageCircle, Share2, MapPin, Trophy, Users as UsersIcon, Plus, CheckCircle2, Coins, Store, Zap, ChevronLeft, Search, CheckCheck, MoreHorizontal, MessageSquare, Send, Camera, Info, Smile, Paperclip, Mic, Edit2, ChevronDown, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EliteTab from './EliteTab';
import { useAppContext } from '../context/AppContext';

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
    comments: 5,
    isVerified: true,
    isPro: false
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
    comments: 2,
    isVerified: true,
    isPro: true
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
    comments: 12,
    isVerified: false,
    isPro: false
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

const CommunityTab = ({ active }) => {
  const { user, handleLogin, logs } = useAppContext();
  const [activeSubTab, setActiveSubTab] = React.useState('social'); // 'social', 'elite', 'messages', 'chat'
  const [selectedChat, setSelectedChat] = React.useState(null);
  
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPass, setLoginPass] = React.useState('');

  const MOCK_CHATS = [
    { id: 1, name: "Mestre Silva", lastMsg: "Amanhã o mar vai estar bom em Peniche!", time: "12m", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Silva", online: true },
    { id: 2, name: "Ana Mar", lastMsg: "Parabéns por aquele Robalo! 🔥", time: "1h", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", online: false },
    { id: 3, name: "João P.", lastMsg: "Qual foi o isco que usaste?", time: "3h", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao", online: true },
  ];

  const renderMessages = () => (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="flex-col bg-telegram-list min-h-screen">
      {/* Telegram List Header */}
      <div className="flex-between items-center p-16 bg-telegram-dark sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-16">
          <button onClick={() => setActiveSubTab('social')} className="p-4"><ChevronLeft size={24} /></button>
          <span className="font-bold text-lg">Mensagens</span>
        </div>
        <div className="flex gap-20 opacity-70">
          <Search size={22} />
        </div>
      </div>

      {/* Telegram Category Tabs */}
      <div className="flex gap-20 px-16 py-8 bg-telegram-dark border-b border-white-05 overflow-x-auto scrollbar-hide">
        {['Tudo', 'Pessoais', 'Canais', 'Grupos'].map((tab, i) => (
          <div key={i} className={`pb-8 px-4 text-sm font-bold whitespace-nowrap ${i === 0 ? 'text-telegram-blue border-b-2 border-telegram-blue' : 'opacity-50'}`}>
            {tab}
          </div>
        ))}
      </div>
      
      {/* Conversation List */}
      <div className="flex-col mt-4">
        {MOCK_CHATS.map(chat => (
          <div 
            key={chat.id} 
            className="flex items-center gap-14 p-14 hover:bg-white-05 cursor-pointer transition-all"
            onClick={() => { setSelectedChat(chat); setActiveSubTab('chat'); }}
          >
            <div className="relative">
              <div className={`tg-avatar-ring ${chat.online ? 'online' : ''}`}>
                <img src={chat.avatar} alt="Avatar" className="w-56 h-56 rounded-full" />
              </div>
            </div>
            <div className="flex-1 flex-col justify-center">
              <div className="flex-between items-center">
                <span className="font-bold text-base text-white">{chat.name}</span>
                <span className="text-2xs opacity-40">{chat.time}</span>
              </div>
              <div className="flex-between items-center mt-2">
                <p className="text-sm opacity-50 truncate m-0 flex-1 pr-10">{chat.lastMsg}</p>
                {chat.id === 1 && <div className="tg-unread-badge">2</div>}
                {chat.id === 2 && <CheckCheck size={14} className="text-telegram-blue opacity-80" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="tg-fab">
        <Edit2 size={24} color="#fff" />
      </button>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="flex-col bg-telegram min-h-screen">
      <div className="flex-between items-center p-12 bg-glass border-b border-white-10 sticky top-0 z-10">
        <div className="flex items-center gap-12">
          <button onClick={() => setActiveSubTab('messages')} className="p-4"><ChevronLeft size={24} /></button>
          <div className="flex items-center gap-12">
            <img src={selectedChat?.avatar} alt="Avatar" className="w-40 h-40 rounded-full" />
            <div className="flex-col">
              <span className="font-bold text-sm leading-tight">{selectedChat?.name}</span>
              <span className="text-3xs text-cyan">visto recentemente</span>
            </div>
          </div>
        </div>
        <div className="flex gap-16 opacity-70">
          <MoreHorizontal size={22} />
        </div>
      </div>

      <div className="flex-1 p-16 flex-col gap-8 overflow-y-auto" style={{ paddingBottom: '80px' }}>
        <div className="tg-date-divider">Hoje</div>
        
        <div className="tg-bubble-received">
          E ai Jorge, como correu a pesca hoje?
          <span className="tg-msg-time">22:05</span>
        </div>

        <div className="tg-bubble-sent">
          Boas! Correu bem, saquei um robalo de 2kg.
          <div className="tg-msg-footer">
            <span className="tg-msg-time">22:07</span>
            <CheckCheck size={12} className="tg-ticks" />
          </div>
        </div>

        <div className="tg-bubble-received">
          {selectedChat?.lastMsg}
          <span className="tg-msg-time">22:10</span>
        </div>
      </div>

      <div className="p-8 pb-20 bg-telegram border-t border-white-05 flex items-center gap-8 fixed bottom-0 left-0 w-full z-20">
        <div className="tg-input-wrapper">
          <button className="p-8 opacity-50"><Smile size={22} /></button>
          <input type="text" placeholder="Mensagem" className="tg-input" />
          <button className="p-8 opacity-50"><Paperclip size={22} /></button>
        </div>
        <button className="tg-mic-btn">
          <Mic size={22} color="#fff" />
        </button>
      </div>
    </motion.div>
  );

  const [localPosts] = React.useState(() => {
    const saved = localStorage.getItem("community_posts");
    return saved ? JSON.parse(saved) : [];
  });

  if (!user.isLoggedIn) {
    return (
      <div className="content-container flex-center" style={{ display: active ? 'flex' : 'none', minHeight: '80vh', flexDirection: 'column' }}>
        <div className="premium-card p-32 bg-glass text-center" style={{ maxWidth: '320px' }}>
          <div className="icon-box-cyan" style={{ margin: '0 auto 20px auto' }}>
            <Users size={32} className="text-cyan" />
          </div>
          <h2 className="m-0 text-xl font-bold">Aceder à Comunidade</h2>
          <p className="text-sm text-secondary mt-8 mb-24">Faça login para ver o que outros pescadores estão a capturar.</p>
          
          <div className="flex-col gap-12">
            <input 
              type="email" 
              className="form-input" 
              placeholder="Email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input 
              type="password" 
              className="form-input" 
              placeholder="Senha" 
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
            />
            <button 
              className="btn-primary w-full py-14"
              onClick={() => handleLogin(loginEmail, loginPass)}
              style={{ border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
            >
              ENTRAR
            </button>
          </div>
          <p className="text-2xs text-secondary mt-20">Ainda não tens conta? <span className="text-cyan font-bold">Regista-te aqui</span></p>
        </div>
      </div>
    );
  }

  const allPosts = [...localPosts, ...MOCK_POSTS];

  return (
    <div className="content-container pb-120 no-padding-mobile modern-bg" style={{ display: active ? 'block' : 'none', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        {activeSubTab === 'social' && (
          <motion.div 
            key="modern-social"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex-col"
          >
            {/* Meta-Modern Header */}
            <div className="premium-social-header px-20 pt-16 pb-12 sticky top-0 z-40">
              <div className="flex-between items-center">
                <div className="flex-col">
                  <h1 className="modern-logo m-0">PESCA.SOCIAL</h1>
                  <span className="text-3xs font-black tracking-widest text-gradient-cyan">FUTURE FISHING</span>
                </div>

                <div className="flex gap-14 items-center">
                  <button onClick={() => setActiveSubTab('elite')} className="elite-floating-btn">
                    <Trophy size={18} />
                    <span>ELITE</span>
                  </button>
                  <button onClick={() => setActiveSubTab('messages')} className="chat-minimal-btn">
                    <MessageCircle size={24} className="opacity-80" />
                    <div className="chat-unread-dot"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Futuristic Stories */}
            <div className="flex gap-14 px-20 py-20 overflow-x-auto scrollbar-hide">
              <div className="story-pill">
                <div className="story-add-widget">
                  <Plus size={28} />
                </div>
                <span className="text-3xs font-bold opacity-40 uppercase tracking-tighter">Tu</span>
              </div>
              {['Mestre Silva', 'Ana Mar', 'João P.', 'Sofia', 'Pedro', 'Lucas'].map((name, i) => (
                <div key={i} className="story-pill">
                  <div className="story-ring-futuristic">
                    <div className="story-avatar-squircle">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} className="w-full h-full object-cover" alt={name} />
                    </div>
                  </div>
                  <span className="text-3xs font-bold opacity-60 uppercase tracking-tighter">{name.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            {/* Modern Feed */}
            <div className="px-16 flex-col">
              {allPosts.map(post => (
                <div key={post.id} className="modern-post-card">
                  {/* Post Header */}
                  <div className="flex-between items-center p-16">
                    <div className="flex items-center gap-12">
                      <div className="w-40 h-40 rounded-12 bg-white-05 p-2 overflow-hidden border border-white-10">
                        <img src={post.avatar} alt="User" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-col">
                        <span className="font-black text-sm tracking-tight">{post.user}</span>
                        <div className="flex items-center gap-4 opacity-40">
                          <MapPin size={10} />
                          <span className="text-3xs font-bold uppercase">{post.location || 'Portugal'}</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-32 h-32 flex-center rounded-8 hover:bg-white-05 transition-colors">
                      <MoreHorizontal size={18} opacity={0.4} />
                    </button>
                  </div>
                  
                  {/* Image with depth */}
                  <div className="post-image-container">
                    <img src={post.image} alt="Catch" className="w-full aspect-square object-cover" />
                    {/* Floating Info Overlay */}
                    <div className="absolute top-16 right-16 px-12 py-6 rounded-12 bg-black/40 backdrop-blur-md border border-white-10">
                      <span className="text-2xs font-black text-gradient-cyan uppercase tracking-widest">{post.species || 'ROBALO'}</span>
                    </div>
                  </div>

                  {/* Actions & Content */}
                  <div className="p-16">
                    <div className="flex-between items-center mb-20">
                      <div className="post-action-pill">
                        <Heart size={22} className="cursor-pointer hover:text-red transition-all" />
                        <MessageSquare size={22} className="cursor-pointer hover:text-cyan transition-all" />
                        <Send size={22} className="cursor-pointer hover:scale-110 transition-all" />
                      </div>
                      <Bookmark size={22} className="opacity-40 cursor-pointer" />
                    </div>
                    
                    <div className="flex-col gap-6">
                      <div className="flex items-center gap-8">
                        <div className="flex -space-x-8">
                          {[1, 2, 3].map(i => (
                            <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-18 h-18 rounded-full border-2 border-black" alt="" />
                          ))}
                        </div>
                        <span className="text-xs font-bold opacity-60">{post.likes} pescadores gostaram</span>
                      </div>
                      <p className="m-0 text-sm leading-relaxed mt-4">
                        <span className="font-black mr-8 text-gradient-cyan">{post.user}</span>
                        {post.caption || `Excelente jornada na costa portuguesa. A natureza nunca deixa de surpreender.`}
                      </p>
                      <button className="text-xs font-bold opacity-30 mt-8 uppercase tracking-widest hover:opacity-100 transition-opacity">Ver {post.comments} comentários</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'elite' && (
          <motion.div 
            key="elite-view"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 modern-bg z-50 flex-col overflow-y-auto"
          >
            <div className="flex-between items-center p-20 sticky top-0 bg-black/40 backdrop-blur-xl z-20 border-b border-white-05">
              <button onClick={() => setActiveSubTab('social')} className="flex items-center gap-8 font-black text-xs uppercase tracking-widest text-cyan">
                <ChevronLeft size={24} /> Voltar
              </button>
              <span className="font-black tracking-tighter text-gold text-lg">ELITE AREA</span>
            </div>
            <div className="p-20 pb-120">
              <EliteTab active={true} embedded={true} />
            </div>
          </motion.div>
        )}

        {activeSubTab === 'messages' && (
          <motion.div 
            key="messages-view"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-telegram-list z-50 flex-col"
          >
            {renderMessages()}
          </motion.div>
        )}

        {activeSubTab === 'chat' && (
          <motion.div 
            key="chat-view"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-telegram z-60 flex-col"
          >
            {renderChat()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityTab;
