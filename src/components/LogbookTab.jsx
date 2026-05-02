import React, { useState, useRef } from 'react';
import { Plus, Trash2, Camera, ScanLine, CheckCircle2, AlertTriangle } from 'lucide-react';

const AI_FISH_DATABASE = [
  { name: "Robalo", size: "42cm", legal: true },
  { name: "Sargo", size: "18cm", legal: true },
  { name: "Dourada", size: "25cm", legal: true },
  { name: "Robalo (Subdimensionado)", size: "28cm", legal: false },
  { name: "Polvo", size: "1.2kg", legal: true },
];

const LogbookTab = ({ active, selectedZone }) => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("fishing_logs");
    return saved ? JSON.parse(saved) : [];
  });
  
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
      ...newLog
    };
    const updated = [log, ...logs];
    setLogs(updated);
    localStorage.setItem("fishing_logs", JSON.stringify(updated));
    setNewLog({ species: "", bait: "", note: "", image: null });
    setScanResult(null);
  };

  const deleteLog = (id) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem("fishing_logs", JSON.stringify(updated));
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
    
    // Simulate API delay
    setTimeout(() => {
      const randomFish = AI_FISH_DATABASE[Math.floor(Math.random() * AI_FISH_DATABASE.length)];
      setScanResult(randomFish);
      setNewLog(prev => ({ ...prev, species: randomFish.name }));
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="content-container" style={{ display: active ? 'block' : 'none', position: 'absolute', top: '70px', zIndex: 5, width: '100%', paddingBottom: '120px' }}>
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
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <ScanLine size={32} className="pulse" style={{ marginBottom: 8 }} />
                  <span>A analisar espécie...</span>
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
                    {log.bait && <span className="log-details" style={{display: 'block'}}>Isco: {log.bait}</span>}
                    {log.note && <span className="log-details" style={{display: 'block', fontStyle: 'italic'}}>"{log.note}"</span>}
                  </div>
                </div>
                <button 
                  onClick={() => deleteLog(log.id)}
                  style={{background: 'none', border: 'none', color: 'var(--status-bad)', cursor: 'pointer', padding: 8}}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogbookTab;
