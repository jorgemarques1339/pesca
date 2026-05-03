import React from 'react';
import { Wind, Waves, Thermometer, Moon, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherWidget = ({ weatherData, solunarData }) => {
  const isMobile = window.innerWidth < 768;

  if (weatherData.loading) {
    return (
      <div className="glass-panel widget weather-widget-container loading">
        <span className="loading-text">Carregando mar e vento...</span>
      </div>
    );
  }

  // Compact Mobile Capsule Layout
  if (isMobile) {
    return (
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="weather-capsule-mobile"
      >
        {solunarData && (
          <div className="capsule-item probability">
            <Target size={14} color="var(--accent-cyan)" />
            <span className="v">{solunarData.probability}%</span>
          </div>
        )}
        
        {weatherData.data && (
          <>
            <div className="capsule-item">
              <Wind size={14} color="var(--accent-cyan)" />
              <span className="v">{weatherData.data.windKnots}kn</span>
            </div>
            <div className="capsule-item">
              <Waves size={14} color="var(--accent-blue)" />
              <span className="v">{weatherData.data.waveHeight}m</span>
            </div>
            <div className="capsule-item">
              <Thermometer size={14} color="var(--accent-cyan)" />
              <span className="v">{weatherData.data.temp}°</span>
            </div>
          </>
        )}

        {solunarData && (
          <div className="capsule-item moon">
            <Moon size={14} color="var(--text-secondary)" />
            <span className="v">{solunarData.moonPhase}</span>
          </div>
        )}
      </motion.div>
    );
  }

  // Professional Desktop Sidebar Layout
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel widget weather-widget-container"
    >
      <div className="widget-title">
        <Wind size={18} />
        Condições Atmosféricas
      </div>

      {solunarData && (
        <div className="solunar-container" style={{ marginBottom: 12 }}>
          <div className="probability-gauge">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${solunarData.probability}%` }}
              transition={{ duration: 1 }}
              className="gauge-fill" 
              style={{ background: solunarData.probability > 70 ? 'var(--status-good)' : 'var(--status-warning)' }}
            />
          </div>
          <div className="flex-between mt-8">
            <div className="flex-center gap-6">
              <Target size={16} color="var(--accent-cyan)" />
              <span className="v-bold">{solunarData.probability}%</span>
              <span className="l-small">Probabilidade</span>
            </div>
            <div className="flex-center gap-6">
              <Moon size={16} color="var(--text-secondary)" />
              <span className="v-bold">{solunarData.moonPhase}</span>
            </div>
          </div>
        </div>
      )}

      {weatherData.data && (
        <div className="stats-grid">
          {[
            { icon: Wind, label: "Vento", value: `${weatherData.data.windKnots} nós (${weatherData.data.windDir})` },
            { icon: Waves, label: "Ondulação", value: `${weatherData.data.waveHeight}m` },
            { icon: Thermometer, label: "Ar", value: `${weatherData.data.temp}°C` },
            { icon: ({ size, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>, label: "Água", value: `${weatherData.data.waterTemp}°C` }
          ].map((stat, i) => (
            <div key={i} className="weather-stat-row">
              <div className="flex-center gap-10">
                <stat.icon size={18} color="var(--accent-cyan)" />
                <span className="l-small">{stat.label}</span>
              </div>
              <span className="v-bold">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WeatherWidget;
