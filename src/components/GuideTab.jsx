import React, { useState } from 'react';
import { Scale, Info, Calculator } from 'lucide-react';

const SPECIES_DATA = [
  { name: "Robalo", scientific: "Dicentrarchus labrax", minSize: "36 cm", habitat: "Costa rochosa, estuários", bait: "Ameijoa, Casulo, Amostras", k: 0.012 },
  { name: "Sargo", scientific: "Diplodus sargus", minSize: "15 cm", habitat: "Zonas rochosas, surfcasting", bait: "Caranguejo, Minhoca", k: 0.018 },
  { name: "Dourada", scientific: "Sparus aurata", minSize: "19 cm", habitat: "Fundos de areia, estuários", bait: "Caranguejo, Lingueirão", k: 0.021 },
  { name: "Pargo", scientific: "Pagrus pagrus", minSize: "20 cm", habitat: "Águas profundas, fundos mistos", bait: "Lula, Choco, Sardinha", k: 0.023 },
  { name: "Linguado", scientific: "Solea solea", minSize: "24 cm", habitat: "Fundos de areia", bait: "Minhoca, Ganso", k: 0.009 },
];

const GuideTab = ({ active }) => {
  const [length, setLength] = useState(40);
  const [selectedSpecies, setSelectedSpecies] = useState(SPECIES_DATA[0]);

  const estimatedWeight = (selectedSpecies.k * Math.pow(length, 3) / 1000).toFixed(2);

  return (
    <div className="content-container" style={{ display: active ? 'block' : 'none' }}>
      <h1 className="ios-large-title">Guia de Espécies</h1>
      
      {/* Weight Calculator Section */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 24, background: 'rgba(10, 132, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, color: 'var(--accent-cyan)' }}>
          <Calculator size={20} />
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Calculadora de Peso Estimado</h2>
        </div>
        
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <select 
            className="form-input" 
            style={{ marginBottom: 0, flex: 1 }}
            value={selectedSpecies.name}
            onChange={(e) => setSelectedSpecies(SPECIES_DATA.find(s => s.name === e.target.value))}
          >
            {SPECIES_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '0 12px' }}>
            <input 
              type="number" 
              value={length} 
              onChange={(e) => setLength(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#fff', width: '100%', fontSize: '1.1rem', fontWeight: 600, textAlign: 'right' }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>cm</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block' }}>Peso Estimado</span>
          <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{estimatedWeight} kg</span>
        </div>
      </div>

      <h2 style={{ fontSize: '1.3rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Scale size={20} color="var(--accent-blue)" />
        Tamanhos Mínimos e Info
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SPECIES_DATA.map((fish) => (
          <div key={fish.name} className="glass-panel" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{fish.name}</h3>
                <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{fish.scientific}</span>
              </div>
              <div style={{ background: 'var(--accent-blue)', padding: '4px 8px', borderRadius: 6, fontSize: '0.9rem', fontWeight: 700 }}>
                {fish.minSize}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12, fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                <Info size={14} />
                <span>Habitat: {fish.habitat}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                <Scale size={14} />
                <span>Iscos: {fish.bait}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p style={{ marginTop: 24, fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        * O peso é uma estimativa baseada em coeficientes biológicos (k).<br/>
        Consulte sempre o Diário da República para atualizações legislativas.
      </p>
    </div>
  );
};

export default GuideTab;
