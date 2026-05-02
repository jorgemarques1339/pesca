import React from 'react';
import { Waves } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const TideWidget = ({ tideData, selectedZone }) => {
  // Mock data for the tide curve to make it visual
  const chartData = [
    { time: '00:00', level: 2 },
    { time: '06:00', level: 8 },
    { time: '12:00', level: 2 },
    { time: '18:00', level: 8 },
    { time: '23:59', level: 2 },
  ];

  return (
    <div className="glass-panel tide-widget-bottom">
      <div className="tide-title-vertical">
        <h3 className="widget-title">
          <Waves size={18} /> Tábua de Marés
        </h3>
        <span className="zone-name">
          {selectedZone ? selectedZone.name : "Vila do Conde"}
        </span>
      </div>

      <div className="tide-horizontal-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {tideData.loading ? (
          <div style={{ color: "var(--text-secondary)", alignSelf: 'center' }}>
            A carregar dados do tabuademares.com...
          </div>
        ) : tideData.error ? (
          <div style={{ color: "var(--status-bad)", alignSelf: 'center' }}>{tideData.error}</div>
        ) : (
          <div style={{ display: 'flex', width: '100%', height: '100%', gap: '16px' }}>
            {/* Visual Chart */}
            <div style={{ flex: 1, minWidth: '150px', height: '60px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTide" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="level" stroke="var(--accent-blue)" fillOpacity={1} fill="url(#colorTide)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Text Data */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {tideData.data.preia1 && (
                <div className="tide-item high">
                  <span>Preia-mar</span>
                  <strong>{tideData.data.preia1}</strong>
                </div>
              )}
              {tideData.data.baixa1 && (
                <div className="tide-item low">
                  <span>Baixa-mar</span>
                  <strong>{tideData.data.baixa1}</strong>
                </div>
              )}
              {tideData.data.preia2 && (
                <div className="tide-item high">
                  <span>Preia-mar</span>
                  <strong>{tideData.data.preia2}</strong>
                </div>
              )}
              {tideData.data.baixa2 && (
                <div className="tide-item low">
                  <span>Baixa-mar</span>
                  <strong>{tideData.data.baixa2}</strong>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {!tideData.loading && !tideData.error && (
        <a
          href={`https://www.tideschart.com${selectedZone ? selectedZone.tabuaUrl : "/Portugal/Porto/Vila-do-Conde/"}`}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: "0.8rem",
            color: "var(--accent-blue)",
            textDecoration: "none",
            marginLeft: "auto",
            alignSelf: "flex-end",
            position: "absolute",
            right: "16px",
            bottom: "8px",
          }}
        >
          Fonte
        </a>
      )}
    </div>
  );
};

export default TideWidget;
