import React, { useState, useRef } from 'react';
import { Wind, Waves, Moon, Plus, Trash2, Camera, ScanLine, CheckCircle2, AlertTriangle, Share2 } from 'lucide-react';

const AI_FISH_DATABASE = [
  { name: "Robalo", size: "42cm", legal: true },
  { name: "Sargo", size: "18cm", legal: true },
  { name: "Dourada", size: "25cm", legal: true },
  { name: "Robalo (Subdimensionado)", size: "28cm", legal: false },
  { name: "Polvo", size: "1.2kg", legal: true },
];

const LogbookTab = ({ active, selectedZone, weatherData, tides, solunarData, logs, onAddLog, onDeleteLog }) => {
  const [newLog, setNewLog] = useState({ species: "", bait: "", note: "", image: null });
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleAddLog = () => {
    if (!newLog.species) return;

    const log = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      zone: selectedZone ? selectedZone.name : "Local Desconhecido",
      metadata: {
        wind: weatherData?.data ? `${weatherData.data.windKnots}kn ${weatherData.data.windDir}` : "N/A",
        waves: weatherData?.data ? `${weatherData.data.waveHeight}m` : "N/A",
        moon: solunarData?.moonPhase || "N/A",
        prob: solunarData?.probability || 0
      },
      ...newLog
    };

    onAddLog(log);
    setNewLog({ species: "", bait: "", note: "", image: null });
    setScanResult(null);
  };

  const deleteLog = (id) => {
    onDeleteLog(id);
  };

  const shareLog = (log) => {
    const sharedPosts = JSON.parse(localStorage.getItem("community_posts") || "[]");
    const newPost = {
      id: Date.now(),
      user: "Eu (Pescador)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      time: "Agora",
      image: log.image,
      species: log.species,
      weight: "N/A", // Could calculate from guide if needed
      location: log.zone,
      likes: 0,
      comments: 0,
      isLocal: true
    };
    localStorage.setItem("community_posts", JSON.stringify([newPost, ...sharedPosts]));
    alert("Captura partilhada com a comunidade!");
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file reading and AI Scanning
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLog(prev => ({ ...prev, image: reader.result }));
        simulateAIScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate API delay with random fish
    setTimeout(() => {
      const randomFish = AI_FISH_DATABASE[Math.floor(Math.random() * AI_FISH_DATABASE.length)];
      setScanResult(randomFish);
      setNewLog(prev => ({ ...prev, species: randomFish.name }));
      setIsScanning(false);
    }, 2500);
  };

  const confirmDelete = (id) => {
    if (window.confirm("Tem a certeza que deseja remover este registo?")) {
      deleteLog(id);
    }
  };

  return (
    <div className="content-container" style={{ display: active ? 'block' : 'none' }}>
      <h1 className="ios-large-title">Diário de Pesca</h1>
      <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20}}>Registe as suas capturas e use a IA para identificar a espécie.</p>
      
      <div style={{background: 'var(--bg-secondary)', padding: 16, borderRadius: 16, marginBottom: 20}}>
        
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
              onClick={() => fileInputRef.current?.click()} 
              style={{ width: '100%', padding: '24px', background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', color: 'var(--accent-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Camera size={32} />
              <span>Tirar foto ao peixe (Scanner IA)</span>
            </button>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={newLog.image} alt="Captura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {isScanning && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    <rect x="20%" y="20%" width="60%" height="60%" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeDasharray="10 5" className="scan-rect" />
                    <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="rgba(100, 210, 255, 0.3)" strokeWidth="1" className="scan-line-diag" />
                  </svg>
                  <ScanLine size={48} className="scan-bar" />
                  <div style={{ zIndex: 1, background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                    A ANALISAR BIOMETRIA...
                  </div>
                </div>
              )}
            </div>
          )}

          {scanResult && !isScanning && (
            <div style={{ padding: '12px', background: scanResult.legal ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${scanResult.legal ? 'var(--status-good)' : 'var(--status-bad)'}`, borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {scanResult.legal ? <CheckCircle2 color="var(--status-good)" size={24} /> : <AlertTriangle color="var(--status-bad)" size={24} />}
              <div>
                <strong style={{ display: 'block', color: scanResult.legal ? 'var(--status-good)' : 'var(--status-bad)' }}>
                  {scanResult.name} (Aprox. {scanResult.size})
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {scanResult.legal ? 'Tamanho dentro da lei.' : 'Atenção: Espécime parece subdimensionado!'}
                </span>
              </div>
            </div>
          )}
        </div>

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
          placeholder="Notas adicionais (estado do mar, maré, etc)" 
          rows="2"
          value={newLog.note}
          onChange={(e) => setNewLog({...newLog, note: e.target.value})}
        />
        <button className="btn-primary" onClick={handleAddLog}>
          <Plus size={18} /> Adicionar Registo
        </button>
      </div>

      <div>
        {logs.length === 0 ? (
          <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Ainda sem registos.</p>
        ) : (
          logs.map(log => (
            <div key={log.id} className="log-item">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  {log.image && (
                    <img src={log.image} alt="Fish" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <span className="log-date">{log.date} - {log.zone}</span>
                    <span className="log-species">{log.species}</span>
                    
                    {/* Environmental Metadata */}
                    {log.metadata && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px', opacity: 0.8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                          <Wind size={12} color="var(--accent-cyan)" /> {log.metadata.wind}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                          <Waves size={12} color="var(--accent-blue)" /> {log.metadata.waves}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                          <Moon size={12} color="var(--text-secondary)" /> {log.metadata.moon}
                        </div>
                      </div>
                    )}

                    {log.bait && <span className="log-details" style={{display: 'block'}}>Isco: {log.bait}</span>}
                    {log.note && <span className="log-details" style={{display: 'block', fontStyle: 'italic'}}>"{log.note}"</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={() => shareLog(log)}
                    style={{background: 'rgba(10, 132, 255, 0.1)', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', padding: 8, borderRadius: 8}}
                    title="Partilhar na Comunidade"
                  >
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={() => confirmDelete(log.id)}
                    style={{background: 'rgba(255, 69, 58, 0.1)', border: 'none', color: 'var(--status-bad)', cursor: 'pointer', padding: 8, borderRadius: 8}}
                    title="Remover registo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogbookTab;
