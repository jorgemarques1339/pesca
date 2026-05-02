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
           <path d="M0 20 Q 25 5, 50 20 T 100 20 L 100 40 L 0 40 Z" fill="rgba(10, 132, 255, 0.2)" />
           <path d="M0 20 Q 25 5, 50 20 T 100 20" fill="none" stroke="rgb(10, 132, 255)" strokeWidth="2" />
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
