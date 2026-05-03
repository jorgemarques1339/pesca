import React from 'react';
import { SVGOverlay } from 'react-leaflet';
import { motion } from 'framer-motion';

const WindVectorLayer = ({ weatherData }) => {
  if (!weatherData?.data) return null;

  const { windDir, windKnots } = weatherData.data;
  
  // Create a grid of points over the Portuguese coast
  const points = [];
  for (let lat = 37.0; lat <= 42.0; lat += 0.5) {
    for (let lng = -10.5; lng <= -8.5; lng += 0.5) {
      points.push({ lat, lng });
    }
  }

  return (
    <>
      {points.map((p, i) => (
        <SVGOverlay 
          key={i} 
          bounds={[[p.lat - 0.1, p.lng - 0.1], [p.lat + 0.1, p.lng + 0.1]]}
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g style={{ 
              transform: `rotate(${windDir}deg)`, 
              transformOrigin: 'center',
              opacity: Math.min(windKnots / 30, 1) // Opacity based on intensity
            }}>
              {/* Arrow Shape */}
              <line x1="50" y1="80" x2="50" y2="20" stroke="var(--accent-cyan)" strokeWidth="8" strokeLinecap="round" />
              <path d="M 30 40 L 50 20 L 70 40" fill="none" stroke="var(--accent-cyan)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </SVGOverlay>
      ))}
    </>
  );
};

export default WindVectorLayer;
