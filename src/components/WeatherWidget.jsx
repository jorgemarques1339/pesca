import React from 'react';
import { Wind, Waves, Thermometer } from 'lucide-react';

const WeatherWidget = ({ weatherData }) => {
  return (
    <div className="glass-panel widget weather-widget-container">
      <div className="widget-title">
        <Wind size={18} />
        Condições Atmosféricas
      </div>
      {weatherData.loading ? (
        <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "10px" }}>A carregar dados...</div>
      ) : weatherData.error ? (
        <div style={{ color: "var(--status-bad)", textAlign: "center", padding: "10px" }}>{weatherData.error}</div>
      ) : weatherData.data ? (
        <>
          <div className="weather-stat">
            <div className="stat-left">
              <Wind className="stat-icon" size={20} />
              <span className="stat-label">Vento</span>
            </div>
            <span className="stat-value">{weatherData.data.windKnots} nós ({weatherData.data.windDir})</span>
          </div>

          <div className="weather-stat">
            <div className="stat-left">
              <Waves className="stat-icon" size={20} />
              <span className="stat-label">Ondulação</span>
            </div>
            <span className="stat-value">{weatherData.data.waveHeight}m</span>
          </div>

          <div className="weather-stat">
            <div className="stat-left">
              <Thermometer className="stat-icon" size={20} />
              <span className="stat-label">Temp. Ar</span>
            </div>
            <span className="stat-value">{weatherData.data.temp}°C</span>
          </div>

          <div className="weather-stat">
            <div className="stat-left">
              <svg className="stat-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
              <span className="stat-label">Temp. Água</span>
            </div>
            <span className="stat-value">{weatherData.data.waterTemp}°C</span>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WeatherWidget;
