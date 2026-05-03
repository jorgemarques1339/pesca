import React from 'react';
import { Compass, X, Navigation, MapPin } from 'lucide-react';
import { getDistance, getBearing } from '../utils/geoUtils';

const NavigationPanel = ({ userPos, target, heading, onClose }) => {
  if (!userPos || !target) return null;

  const distance = getDistance(userPos, target);
  const bearing = getBearing(userPos, target);
  
  // Relative angle for the arrow
  const relativeAngle = (bearing - heading + 360) % 360;

  return (
    <div className="navigation-overlay glass-panel">
      <div className="nav-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Navigation size={20} color="var(--accent-cyan)" />
          <h2 style={{ margin: 0, fontSize: '1rem' }}>Navegação</h2>
        </div>
        <button onClick={onClose} className="close-btn-minimal"><X size={18} /></button>
      </div>

      <div className="nav-target-info">
        <MapPin size={14} color="var(--accent-blue)" />
        <span>Rumo a: <strong>{target.name}</strong></span>
      </div>

      <div className="compass-visual">
        <div className="compass-outer">
          <div className="compass-inner" style={{ transform: `rotate(${-heading}deg)` }}>
            <span className="n">N</span>
            <span className="e">E</span>
            <span className="s">S</span>
            <span className="w">W</span>
          </div>
          <div className="navigation-arrow" style={{ transform: `rotate(${relativeAngle}deg)` }}>
            <div className="arrow-head"></div>
          </div>
        </div>
      </div>

      <div className="nav-stats">
        <div className="nav-stat">
          <span className="stat-label">Distância</span>
          <span className="stat-value">{(distance < 1 ? (distance * 1000).toFixed(0) + 'm' : distance.toFixed(2) + 'km')}</span>
        </div>
        <div className="nav-stat">
          <span className="stat-label">Rumo</span>
          <span className="stat-value">{Math.round(bearing)}°</span>
        </div>
        <div className="nav-stat">
          <span className="stat-label">Proa</span>
          <span className="stat-value">{heading}°</span>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;
