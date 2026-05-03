import React, { useMemo } from 'react';
import { useARNavigation } from '../hooks/useARNavigation';
import './AROverlay.css';

/**
 * AROverlay Component
 * Sobreposição de Realidade Aumentada para Batimetria e Correntes.
 */
const AROverlay = ({ bathymetryData = [], currents = [] }) => {
  const { orientation, location, isSupported } = useARNavigation();

  // Simulação de contornos batimétricos projetados
  const projectedContours = useMemo(() => {
    // Filtra dados próximos ao utilizador e projeta com base na bússola (alpha)
    return bathymetryData.map((point, index) => ({
      ...point,
      screenPos: {
        x: 50 + Math.sin((orientation.alpha + point.bearing) * (Math.PI / 180)) * 40,
        y: 50 + Math.cos(orientation.beta * (Math.PI / 180)) * 20
      }
    }));
  }, [orientation, bathymetryData]);

  if (!isSupported) {
    return <div className="ar-error">O seu dispositivo não suporta Realidade Aumentada.</div>;
  }

  return (
    <div className="ar-container">
      {/* HUD de Telemetria */}
      <div className="ar-hud top">
        <div className="hud-item">
          <span className="label">BÚSSOLA</span>
          <span className="value">{Math.round(orientation.alpha)}°</span>
        </div>
        <div className="hud-item">
          <span className="label">LAT</span>
          <span className="value">{location?.latitude?.toFixed(4) || '---'}</span>
        </div>
        <div className="hud-item">
          <span className="label">LON</span>
          <span className="value">{location?.longitude?.toFixed(4) || '---'}</span>
        </div>
      </div>

      {/* Visualização de Contornos (Batimetria) */}
      <svg className="ar-view" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="depthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 255, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 100, 255, 0.6)" />
          </linearGradient>
        </defs>
        
        {projectedContours.map((p, i) => (
          <g key={i} style={{ transform: `translate(${p.screenPos.x}px, ${p.screenPos.y}px)` }}>
            <circle r={p.depth / 5} fill="url(#depthGradient)" stroke="cyan" strokeWidth="0.5" />
            <text y="-5" fontSize="3" fill="white" textAnchor="middle">-{p.depth}m</text>
          </g>
        ))}

        {/* Vetores de Corrente de Retorno */}
        {currents.map((c, i) => (
          <path
            key={`current-${i}`}
            d="M 50 50 L 50 30"
            stroke="rgba(255, 50, 50, 0.8)"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
            style={{ 
              transform: `rotate(${orientation.alpha + c.direction}deg)`,
              transformOrigin: '50% 50%'
            }}
          />
        ))}
      </svg>

      {/* Painel Inferior Glassmorphism */}
      <div className="ar-hud bottom glass">
        <h3>RELEVO SUBMARINO EM TEMPO REAL</h3>
        <p>A apontar para: <strong>Baixio das Agulhas</strong></p>
        <div className="depth-indicator">
          <div className="depth-bar" style={{ height: '60%' }}></div>
          <span>PROFUNDIDADE ATUAL: 12.4m</span>
        </div>
      </div>
    </div>
  );
};

export default AROverlay;
