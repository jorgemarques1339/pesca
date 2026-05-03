import React, { useState, useRef } from 'react';
import { Wind, Waves, Moon, Plus, Trash2, Camera, ScanLine, CheckCircle2, AlertTriangle, Share2, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { analyzeFishImage } from '../utils/aiEngine';

const LogbookTab = ({ active }) => {
  const {
    selectedZone,
    weatherData,
    solunarData,
    logs,
    handleAddLog: onAddLog,
    handleDeleteLog: onDeleteLog
  } = useAppContext();

  const [newLog, setNewLog] = useState({ species: "", bait: "", note: "", image: null });
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: Idle, 1: Biometrics, 2: Database, 3: Finalizing
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
    setScanStep(0);
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLog(prev => ({ ...prev, image: reader.result }));
        startAIScan(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAIScan = async (imageData) => {
    setIsScanning(true);
    setScanResult(null);
    
    // Step 1: Biometrics
    setScanStep(1);
    await new Promise(r => setTimeout(r, 800));
    
    // Step 2: Database
    setScanStep(2);
    const result = await analyzeFishImage(imageData);
    
    // Step 3: Finalizing
    setScanStep(3);
    await new Promise(r => setTimeout(r, 600));
    
    setScanResult(result);
    setNewLog(prev => ({ ...prev, species: result.name }));
    setIsScanning(false);
  };

  const getScanMessage = () => {
    switch(scanStep) {
      case 1: return "Deteção de Biometria...";
      case 2: return "Cruzando base de dados...";
      case 3: return "Validando conformidade legal...";
      default: return "";
    }
  };

  return (
    <div className="content-container tab-panel-container" style={{ display: active ? 'block' : 'none' }}>
      <h1 className="ios-large-title">Diário de Pesca</h1>
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
                      <span className="size-info">~{scanResult.estimatedSize}{scanResult.unit} (IA Confidence: {scanResult.analysisMetadata.probability}%)</span>
                    </div>
                  </div>
                  <div className="legal-badge">
                    {scanResult.isLegal ? 'LEGAL' : 'CURTO'}
                  </div>
                </div>
                <div className="analysis-details">
                  <Info size={14} />
                  <p>{scanResult.analysisMetadata.recommendation}</p>
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
            placeholder="Notas sobre a maré ou local..." 
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
                <button className="action-btn share" onClick={() => alert("Partilhado!")}><Share2 size={16} /></button>
                <button className="action-btn delete" onClick={() => onDeleteLog(log.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogbookTab;
