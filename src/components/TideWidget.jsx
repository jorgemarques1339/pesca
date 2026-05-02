import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TideWidget = ({ title, data }) => {
  if (!data) return null;

  // Generate a fake sine wave for the chart that mimics a tide chart
  const generateChartData = () => {
    const points = [];
    // We just generate a nice looking wave since we don't have hourly data
    for (let i = 0; i <= 24; i += 2) {
      // Create a double wave pattern for semi-diurnal tides
      const height = Math.sin((i / 12) * Math.PI * 2) * 2 + 2; 
      points.push({ time: `${i}:00`, height });
    }
    return points;
  };

  const chartData = generateChartData();

  return (
    <div className="tide-card">
      <div className="tide-card-header">
        <h4>{title}</h4>
      </div>
      
      <div className="tide-card-chart">
        <ResponsiveContainer width="100%" height={50}>
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorTide${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="height" stroke="var(--accent-blue)" fillOpacity={1} fill={`url(#colorTide${title})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="tide-card-times">
        <div className="tide-time">
          <span className="tide-label">Preia-mar</span>
          <span className="tide-val">{data.preia1}</span>
          <span className="tide-val">{data.preia2}</span>
        </div>
        <div className="tide-time">
          <span className="tide-label">Baixa-mar</span>
          <span className="tide-val">{data.baixa1}</span>
          <span className="tide-val">{data.baixa2}</span>
        </div>
      </div>
    </div>
  );
};

export default TideWidget;
