import React, { useState } from 'react';
import { Download, X, CheckCircle2, Loader2, Database } from 'lucide-react';

const OFFLINE_ZONES = [
  { 
    id: 'norte', 
    name: 'Costa Norte', 
    desc: 'Viana do Castelo até Aveiro',
    bounds: { minLat: 40.6, maxLat: 42.2, minLon: -9.5, maxLon: -8.5 }
  },
  { 
    id: 'centro', 
    name: 'Costa Centro', 
    desc: 'Figueira da Foz até Setúbal',
    bounds: { minLat: 38.3, maxLat: 40.6, minLon: -10.0, maxLon: -8.8 }
  },
  { 
    id: 'sul', 
    name: 'Costa Sul / Algarve', 
    desc: 'Sines até Vila Real de S. António',
    bounds: { minLat: 36.6, maxLat: 38.3, minLon: -9.5, maxLon: -7.3 }
  }
];

const OfflineModal = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('offline_zones_completed');
    return saved ? JSON.parse(saved) : [];
  });

  const lon2tile = (lon, zoom) => Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const lat2tile = (lat, zoom) => Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

  const downloadZone = async (zone) => {
    setDownloading(zone.id);
    setProgress(0);
    
    const zooms = [8, 10, 12, 13]; // Levels for offline use
    let totalTiles = 0;
    let currentTile = 0;

    // Calculate total
    zooms.forEach(z => {
      const x1 = lon2tile(zone.bounds.minLon, z);
      const x2 = lon2tile(zone.bounds.maxLon, z);
      const y1 = lat2tile(zone.bounds.maxLat, z);
      const y2 = lat2tile(zone.bounds.minLat, z);
      totalTiles += (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);
    });

    try {
      for (const z of zooms) {
        const xMin = Math.min(lon2tile(zone.bounds.minLon, z), lon2tile(zone.bounds.maxLon, z));
        const xMax = Math.max(lon2tile(zone.bounds.minLon, z), lon2tile(zone.bounds.maxLon, z));
        const yMin = Math.min(lat2tile(zone.bounds.maxLat, z), lat2tile(zone.bounds.minLat, z));
        const yMax = Math.max(lat2tile(zone.bounds.maxLat, z), lat2tile(zone.bounds.minLat, z));

        for (let x = xMin; x <= xMax; x++) {
          for (let y = yMin; y <= yMax; y++) {
            const urls = [
              `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
              `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/${z}/${y}/${x}`,
              `https://tiles.openseamap.org/seamark/${z}/${x}/${y}.png`
            ];

            // Fetch and ignore to populate cache
            await Promise.all(urls.map(url => fetch(url, { mode: 'no-cors' }).catch(() => {})));
            
            currentTile++;
            setProgress(Math.round((currentTile / totalTiles) * 100));
            
            // Throttling to prevent browser lag
            if (currentTile % 20 === 0) await new Promise(r => setTimeout(r, 100));
          }
        }
      }

      const newCompleted = [...completed, zone.id];
      setCompleted(newCompleted);
      localStorage.setItem('offline_zones_completed', JSON.stringify(newCompleted));
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(null);
      setProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <div className="modal-header">
          <div className="modal-title-group">
            <Database className="modal-icon" size={24} />
            <h2>Mapas Offline</h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <p className="modal-description">
          Descarregue as zonas costeiras para garantir que o mapa e as cartas náuticas funcionam sem internet no alto mar.
        </p>

        <div className="zones-list">
          {OFFLINE_ZONES.map(zone => {
            const isDone = completed.includes(zone.id);
            const isDownloading = downloading === zone.id;

            return (
              <div key={zone.id} className={`zone-card ${isDone ? 'done' : ''}`}>
                <div className="zone-info">
                  <h3>{zone.name}</h3>
                  <p>{zone.desc}</p>
                </div>
                
                <button 
                  className={`download-btn ${isDone ? 'completed' : ''} ${isDownloading ? 'loading' : ''}`}
                  onClick={() => !isDone && !downloading && downloadZone(zone)}
                  disabled={isDownloading || (downloading && !isDownloading)}
                >
                  {isDownloading ? (
                    <div className="progress-container">
                      <Loader2 className="spin" size={18} />
                      <span>{progress}%</span>
                    </div>
                  ) : isDone ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Download size={20} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <p>Recomendado descarregar via Wi-Fi.</p>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }
        .modal-content {
          width: 100%;
          max-width: 450px;
          padding: 24px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          animation: modal-pop 0.3s ease-out;
        }
        @keyframes modal-pop {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .modal-icon { color: var(--accent-blue); }
        .modal-header h2 { margin: 0; font-size: 1.4rem; }
        .close-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .modal-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 24px;
        }
        .zones-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .zone-card {
          background: rgba(255,255,255,0.05);
          padding: 16px;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .zone-card.done { border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.05); }
        .zone-info h3 { margin: 0 0 4px 0; font-size: 1.1rem; }
        .zone-info p { margin: 0; font-size: 0.8rem; color: var(--text-secondary); }
        .download-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: none;
          background: var(--accent-blue);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .download-btn.completed { background: var(--status-good); cursor: default; }
        .download-btn.loading { width: 80px; border-radius: 20px; background: rgba(255,255,255,0.1); cursor: wait; }
        .progress-container { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem; }
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .modal-footer { margin-top: 24px; text-align: center; }
        .modal-footer p { font-size: 0.8rem; color: var(--text-secondary); opacity: 0.7; }
      `}</style>
    </div>
  );
};

export default OfflineModal;
