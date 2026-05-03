import { Wind, Waves, Thermometer, Moon, Target } from 'lucide-react';

const WeatherWidget = ({ weatherData, solunarData }) => {
  return (
    <div className="glass-panel widget weather-widget-container">
      <div className="widget-title">
        <Wind size={18} />
        Condições Atmosféricas
      </div>

      {solunarData && (
        <div className="solunar-container" style={{ marginBottom: 8 }}>
          <div className="probability-gauge">
            <div className="gauge-fill" style={{ width: `${solunarData.probability}%`, background: solunarData.probability > 70 ? 'var(--status-good)' : solunarData.probability > 40 ? 'var(--status-warning)' : 'var(--status-bad)' }}></div>
          </div>
          <div className="solunar-info-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div className="solunar-stat">
              <Target size={16} color="var(--accent-cyan)" />
              <span className="solunar-value">{solunarData.probability}%</span>
              <span className="solunar-label"> Probabilidade</span>
            </div>
            <div className="solunar-stat">
              <Moon size={16} color="var(--text-secondary)" />
              <span className="solunar-value">{solunarData.moonPhase}</span>
            </div>
          </div>
        </div>
      )}
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
