import React from 'react';
import { AreaChart, Activity, ArrowUp, ArrowDown } from 'lucide-react';

const TideChartPopup = ({ tides }) => {
  if (!tides || tides.length === 0) return <div>Sem dados de maré disponíveis.</div>;

  // Simple SVG Line Chart implementation
  const height = 60;
  const width = 180;
  const padding = 10;
  
  // Normalize tide heights (usually between 0 and 4 meters in Portugal)
  const maxH = 4.5;
  const points = tides.map((t, i) => {
    const x = (i / (tides.length - 1)) * (width - 2 * padding) + padding;
    const y = height - (t.height / maxH) * (height - 2 * padding) - padding;
    return `${x},${y}`;
  }).join(' ');

  const currentTide = tides[0]; // Assuming first is current or next

  return (
    <div style={{ minWidth: '200px', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Curva da Maré</h4>
        <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>
          {currentTide.state === 'ENCHENTE' ? <ArrowUp size={10} color="#30d158" /> : <ArrowDown size={10} color="#ff453a" />}
          {currentTide.state}
        </div>
      </div>

      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Background Grid */}
        <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        
        {/* Tide Curve */}
        <polyline
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        
        {/* Data Points */}
        {tides.map((t, i) => {
          const x = (i / (tides.length - 1)) * (width - 2 * padding) + padding;
          const y = height - (t.height / maxH) * (height - 2 * padding) - padding;
          return (
            <circle key={i} cx={x} cy={y} r="3" fill={i === 0 ? "var(--accent-cyan)" : "white"} />
          );
        })}
      </svg>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', opacity: 0.8 }}>
        <div>
          <span style={{ display: 'block', color: 'var(--text-secondary)' }}>PRÓXIMA MARÉ</span>
          <strong>{tides[0].time} ({tides[0].height}m)</strong>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', color: 'var(--text-secondary)' }}>COEFICIENTE</span>
          <strong>{tides[0].coef || 75}</strong>
        </div>
      </div>
    </div>
  );
};

export default TideChartPopup;
