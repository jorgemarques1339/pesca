import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const LogbookTab = ({ active, selectedZone }) => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("fishing_logs");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newLog, setNewLog] = useState({ species: "", bait: "", note: "" });

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
    setNewLog({ species: "", bait: "", note: "" });
  };

  const deleteLog = (id) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem("fishing_logs", JSON.stringify(updated));
  };

  return (
    <div className="content-container" style={{ display: active ? 'block' : 'none', position: 'absolute', top: '70px', zIndex: 5, width: '100%' }}>
      <h1 className="ios-large-title">Diário de Pesca</h1>
      <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20}}>Registe as suas capturas localmente no dispositivo.</p>
      
      <div style={{background: 'var(--bg-secondary)', padding: 16, borderRadius: 16, marginBottom: 20}}>
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
                <div>
                  <span className="log-date">{log.date} - {log.zone}</span>
                  <span className="log-species">{log.species}</span>
                  {log.bait && <span className="log-details" style={{display: 'block'}}>Isco: {log.bait}</span>}
                  {log.note && <span className="log-details" style={{display: 'block', fontStyle: 'italic'}}>"{log.note}"</span>}
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
