import React from 'react';
import { Waves } from 'lucide-react';

const TideWidget = ({ title, data }) => {
  if (!data) return null;

  return (
    <div className="apple-tide-widget">
      <div className="atw-header">
        <Waves size={14} className="atw-icon" />
        <span className="atw-title">MARÉS • {title}</span>
      </div>
      
      {/* Wave Graph SVG Mock */}
      <div className="atw-graph">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
           <defs>
             <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="rgba(10, 132, 255, 0.4)" />
               <stop offset="100%" stopColor="rgba(10, 132, 255, 0)" />
             </linearGradient>
           </defs>
           <path d="M0 25 Q 25 5, 50 25 T 100 25 L 100 40 L 0 40 Z" fill="url(#waveGradient)" />
           <path d="M0 25 Q 25 5, 50 25 T 100 25" fill="none" stroke="rgb(10, 132, 255)" strokeWidth="1.5" />
           <circle cx="25" cy="15" r="2" fill="white" className="pulse-dot" />
        </svg>
      </div>

      <div className="atw-footer">
        <div className="atw-col">
          <span className="atw-label">PREIA-MAR</span>
          <span className="atw-time">{data.preia1 || '--:--'}</span>
          <span className="atw-time">{data.preia2 || '--:--'}</span>
        </div>
        <div className="atw-col" style={{ alignItems: 'flex-end' }}>
          <span className="atw-label">BAIXA-MAR</span>
          <span className="atw-time">{data.baixa1 || '--:--'}</span>
          <span className="atw-time">{data.baixa2 || '--:--'}</span>
        </div>
      </div>
    </div>
  );
};

export default TideWidget;
