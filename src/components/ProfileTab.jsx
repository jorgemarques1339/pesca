import React, { useState, useRef } from 'react';
import { 
  Wind, Waves, Moon, Plus, Trash2, Camera, ScanLine, CheckCircle2, 
  AlertTriangle, Share2, Info, Activity, User, Settings, Edit2, 
  BookOpen, ChevronRight, LogOut, Award, Star, Anchor, Briefcase,
  Grid, List, Bookmark, MapPin, Link as LinkIcon, MoreHorizontal, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { analyzeFishImage } from '../utils/aiEngine';

const ProfileTab = ({ active }) => {
  const {
    user,
    handleLogout,
    selectedZone,
    weatherData,
    solunarData,
    logs,
    handleAddLog: onAddLog,
    handleDeleteLog: onDeleteLog
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('grid'); 
  const [activeProfileView, setActiveProfileView] = useState('profile'); // profile, diary

  const renderProfileInfo = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-col">
      {/* Refined Header Bar */}
      <div className="flex-between items-center px-20 py-12">
        <div className="flex-center gap-4">
          <span className="font-black text-lg tracking-tight">{user.name.toLowerCase().replace(' ', '_')}</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="px-20 pt-10 pb-10">
        <div className="flex-between items-center mb-20">
          <div className="ig-avatar-container">
            <img src={user.avatar} alt="Avatar" className="ig-avatar" />
            <div className="ig-plus-btn"><Plus size={12} color="#fff" /></div>
          </div>
          
          <div className="flex-1 flex-center gap-24 ml-20">
            <div className="ig-stat-item">
              <span className="ig-stat-value">{logs.length}</span>
              <span className="ig-stat-label">Posts</span>
            </div>
            <div className="ig-stat-item">
              <span className="ig-stat-value">1,250</span>
              <span className="ig-stat-label">Seguidores</span>
            </div>
            <div className="ig-stat-item">
              <span className="ig-stat-value">450</span>
              <span className="ig-stat-label">A seguir</span>
            </div>
          </div>
        </div>

        <div className="ig-bio mb-20">
          <h2 className="m-0 text-sm font-bold">{user.name}</h2>
          <span className="text-xs opacity-50 block mb-4">Pescador Desportivo • Pro</span>
          <p className="text-sm m-0 leading-relaxed">{user.bio}</p>
          <div className="flex-center gap-12 mt-8">
            <div className="flex-center gap-4 text-xs opacity-60">
              <MapPin size={12} /> <span>Caxinas, Vila do Conde</span>
            </div>
            <div className="flex-center gap-4 text-xs text-blue">
              <LinkIcon size={12} /> <span>casafavais.pt</span>
            </div>
          </div>
        </div>

        {/* Refined Action Buttons */}
        <div className="flex gap-8 mb-24">
          <button className="ig-btn-secondary flex-1">Editar Perfil</button>
          <button className="ig-btn-secondary flex-1">Partilhar</button>
          <button 
            className="ig-btn-secondary flex-1 font-bold"
            onClick={() => setActiveProfileView('diary')}
            style={{ background: 'rgba(0, 112, 243, 0.15)', color: 'var(--accent-blue)' }}
          >
            Diário
          </button>
        </div>

        {/* Highlights */}
        <div className="ig-highlights-scroll mb-20">
          {[
            { label: 'Recordes', icon: '🏆' },
            { label: 'Material', icon: '🎣' },
            { label: 'Spots', icon: '📍' },
            { label: 'Dicas', icon: '💡' },
            { label: 'Novo', icon: <Plus size={24} strokeWidth={1} /> }
          ].map((h, i) => (
            <div key={i} className="ig-highlight-item">
              <div className="ig-highlight-circle">
                <span style={{ fontSize: h.label === 'Novo' ? 'inherit' : '1.5rem' }}>{h.icon}</span>
              </div>
              <span className="text-3xs mt-4">{h.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="ig-tabs-header border-t border-glass">
        <button 
          className={`ig-tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
          onClick={() => setActiveTab('grid')}
        >
          <Grid size={20} />
        </button>
        <button 
          className={`ig-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <Bookmark size={20} />
        </button>
        <button className="ig-tab-btn opacity-30">
          <User size={20} />
        </button>
      </div>

      {/* Post Grid */}
      <div className="ig-grid">
        {logs.length > 0 ? logs.map(log => (
          <div key={log.id} className="ig-grid-item">
            {log.image ? (
              <img src={log.image} alt="Catch" />
            ) : (
              <div className="ig-grid-placeholder">
                <span className="text-xs font-bold">{log.species}</span>
              </div>
            )}
            <div className="ig-grid-overlay">
              <div className="flex-center gap-4 text-white text-xs font-bold">
                <Star size={12} fill="white" /> 12
              </div>
            </div>
          </div>
        )) : (
          <div className="p-40 text-center opacity-30" style={{ gridColumn: 'span 3' }}>
            <Camera size={48} style={{ marginBottom: 12 }} />
            <p>Ainda não tens publicações</p>
          </div>
        )}
        
        {/* Fill with mock grid items if needed */}
        {[1,2,3,4,5,6].map(i => (
          <div key={`mock-${i}`} className="ig-grid-item">
            <img src={`https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80&sig=${i}`} alt="Mock" />
          </div>
        ))}
      </div>
      
      <div className="p-20">
        <button 
          className="profile-menu-item-slim text-red" 
          onClick={handleLogout}
          style={{ background: 'rgba(255, 69, 58, 0.05)', border: '1px solid rgba(255, 69, 58, 0.1)' }}
        >
          <div className="flex-center gap-12">
            <LogOut size={18} />
            <span className="font-bold text-sm">Terminar Sessão</span>
          </div>
        </button>
      </div>
    </motion.div>
  );

  const renderDiary = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-col">
      <button 
        onClick={() => setActiveProfileView('profile')} 
        className="flex-center gap-8 mb-20 text-xs font-bold text-secondary uppercase tracking-widest"
      >
        <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Voltar ao Perfil
      </button>

      <h1 className="ios-large-title">O Meu Diário</h1>
      <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20}}>Registe as suas capturas e use a IA para validar o tamanho legal.</p>
      
      <div className="glass-panel p-20 mb-24">
        {/* AI Camera Section */}
        <div style={{ marginBottom: 16 }}>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleImageCapture}
          />
          
          {!newLog.image ? (
            <button 
              className="ai-scan-placeholder"
              onClick={() => fileInputRef.current?.click()} 
            >
              <Camera size={32} />
              <span>Digitalizar Captura (IA)</span>
            </button>
          ) : (
            <div className="scan-image-preview">
              <img src={newLog.image} alt="Captura" />
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="scan-overlay"
                  >
                    <div className="scan-lines-container">
                      <ScanLine size={48} className="scan-bar-animated" />
                      <div className="scan-rect-focus"></div>
                    </div>
                    <div className="scan-status-capsule">
                      <Activity size={14} className="pulse-slow" />
                      <span>{getScanMessage()}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <AnimatePresence>
            {scanResult && !isScanning && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className={`ai-result-card ${scanResult.isLegal ? 'legal' : 'illegal'}`}
              >
                <div className="flex-between">
                  <div className="flex-center gap-10">
                    {scanResult.isLegal ? <CheckCircle2 color="var(--status-good)" size={24} /> : <AlertTriangle color="var(--status-bad)" size={24} />}
                    <div>
                      <strong className="species-name">{scanResult.name}</strong>
                      <span className="size-info">~{scanResult.estimatedSize}{scanResult.unit}</span>
                    </div>
                  </div>
                  <div className="legal-badge">
                    {scanResult.isLegal ? 'LEGAL' : 'CURTO'}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="log-form">
          <input 
            className="form-input" 
            placeholder="Espécie (ex: Robalo)" 
            value={newLog.species}
            onChange={(e) => setNewLog({...newLog, species: e.target.value})}
          />
          <input 
            className="form-input" 
            placeholder="Isco utilizado (ex: Casulo)" 
            value={newLog.bait}
            onChange={(e) => setNewLog({...newLog, bait: e.target.value})}
          />
          <textarea 
            className="form-input" 
            placeholder="Notas..." 
            rows="2"
            value={newLog.note}
            onChange={(e) => setNewLog({...newLog, note: e.target.value})}
          />
          <button className="btn-primary" onClick={handleAddLog}>
            <Plus size={18} /> Guardar Registo
          </button>
        </div>
      </div>

      <div className="logs-history">
        {logs.map(log => (
          <div key={log.id} className="log-item">
            <div className="flex-between" style={{ alignItems: 'flex-start' }}>
              <div className="flex-center gap-12" style={{ flex: 1 }}>
                {log.image && <img src={log.image} className="log-thumbnail" alt="Fish" />}
                <div style={{ flex: 1 }}>
                  <span className="log-date">{log.date} - {log.zone}</span>
                  <span className="log-species">{log.species}</span>
                  {log.metadata && (
                    <div className="log-meta-row">
                      <div className="meta-item"><Wind size={12} /> {log.metadata.wind}</div>
                      <div className="meta-item"><Waves size={12} /> {log.metadata.waves}</div>
                      <div className="meta-item"><Moon size={12} /> {log.metadata.moon}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="log-actions">
                <button className="action-btn delete" onClick={() => onDeleteLog(log.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="content-container pb-120 no-padding-mobile" style={{ display: active ? 'block' : 'none' }}>
      {activeProfileView === 'profile' && renderProfileInfo()}
      {activeProfileView === 'diary' && renderDiary()}
    </div>
  );
};

export default ProfileTab;
