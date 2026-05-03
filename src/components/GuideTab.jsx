import React, { useState } from 'react';
import { 
  Scale, Info, Calculator, Fish, Gavel, Zap, Ruler, 
  ChevronRight, AlertCircle, CheckCircle2, ChevronDown,
  Waves, Target, BookOpen, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SPECIES_DATA = [
  { 
    name: "Robalo", 
    scientific: "Dicentrarchus labrax", 
    minSize: 36, 
    unit: "cm",
    habitat: "Costa rochosa, estuários", 
    bait: "Casulo, Caranguejo, Amostras (Vinil)", 
    technique: "Spinning, Surfcasting",
    defeso: "Nenhum (Geral)",
    k: 0.012,
    image: "https://images.unsplash.com/photo-1534320309096-17ce1f77021d?auto=format&fit=crop&q=80&w=400"
  },
  { 
    name: "Sargo", 
    scientific: "Diplodus sargus", 
    minSize: 15, 
    unit: "cm",
    habitat: "Zonas rochosas com espuma", 
    bait: "Caranguejo, Mexilhão, Camarão", 
    technique: "Boia, Chumbadinha",
    defeso: "Fev/Mar (Zonas Protegidas)",
    k: 0.018,
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=400"
  },
  { 
    name: "Dourada", 
    scientific: "Sparus aurata", 
    minSize: 19, 
    unit: "cm",
    habitat: "Canais de ria, fundos mistos", 
    bait: "Caranguejo 2-cascas, Lingueirão", 
    technique: "Fundo, Surfcasting",
    defeso: "Nenhum",
    k: 0.021,
    image: "https://images.unsplash.com/photo-1498654203975-e99571b0cc46?auto=format&fit=crop&q=80&w=400"
  },
  { 
    name: "Choco", 
    scientific: "Sepia officinalis", 
    minSize: 10, 
    unit: "cm",
    habitat: "Águas calmas, estuários", 
    bait: "Toneiras, Palhaços", 
    technique: "Eging",
    defeso: "Nenhum",
    k: 0.015,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=400"
  }
];

const KNOTS_DATA = [
  { name: "Nó Palomar", use: "Anzóis e Destorcedores", difficulty: "Fácil", color: "#30d158", steps: ["Passe a linha duplicada pelo olho", "Faça um nó simples", "Passe o anzol pela laçada", "Aperte com saliva"] },
  { name: "Nó de Sangue", use: "Unir duas linhas", difficulty: "Médio", color: "#ff9f0a", steps: ["Cruze as linhas", "Dê 5 voltas em cada lado", "Passe as pontas pelo centro", "Aperte devagar"] },
  { name: "Nó de Anzol", use: "Anzóis de pata", difficulty: "Difícil", color: "#ff453a", steps: ["Faça uma laçada na haste", "Enrole a ponta 6-8 vezes", "Passe pelo arco", "Puxe pela linha principal"] }
];

const GuideTab = ({ active }) => {
  const [activeSubTab, setActiveSubTab] = useState('fish'); // fish, rules, knots, ruler
  const [selectedFish, setSelectedFish] = useState(null);
  
  const [calcSpecies, setCalcSpecies] = useState(SPECIES_DATA[0]);
  const [length, setLength] = useState(40);

  const estimatedWeight = (calcSpecies.k * Math.pow(length, 3) / 1000).toFixed(2);

  const subTabs = [
    { id: 'fish', label: 'Peixes', icon: Fish, color: 'var(--accent-blue)' },
    { id: 'rules', label: 'Regras', icon: Gavel, color: 'var(--status-good)' },
    { id: 'knots', label: 'Nós', icon: Zap, color: 'var(--accent-orange)' },
    { id: 'ruler', label: 'Régua', icon: Ruler, color: 'var(--accent-cyan)' }
  ];

  const renderFishTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-col gap-16">
      {/* Weight Calculator - Modernized */}
      <div className="premium-card bg-gradient-blue p-20">
        <div className="flex-between mb-20">
          <div className="flex-center gap-12">
            <div className="icon-box-white">
              <Calculator size={22} className="text-blue" />
            </div>
            <div>
              <h3 className="m-0 text-white text-lg">Bio-Calculadora</h3>
              <p className="m-0 text-white-50 text-2xs uppercase tracking-wider">Peso Estimado por Espécie</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-2 gap-12 mb-20">
          <div className="input-group-glass">
            <label>ESPÉCIE</label>
            <select 
              value={calcSpecies.name}
              onChange={(e) => setCalcSpecies(SPECIES_DATA.find(s => s.name === e.target.value))}
            >
              {SPECIES_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="input-group-glass">
            <label>COMPRIMENTO (CM)</label>
            <input type="number" value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
        </div>

        <div className="weight-display">
          <span className="weight-value">{estimatedWeight}</span>
          <span className="weight-unit">KG</span>
        </div>
      </div>

      {/* Fish Grid */}
      <div className="flex-col gap-12">
        {SPECIES_DATA.map((fish, idx) => (
          <motion.div 
            key={fish.name} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`fish-card-premium ${selectedFish?.name === fish.name ? 'expanded' : ''}`}
            onClick={() => setSelectedFish(selectedFish?.name === fish.name ? null : fish)}
          >
            <div className="fish-card-header">
              <div className="fish-image-container">
                <img src={fish.image} alt={fish.name} />
                <div className="fish-size-badge">{fish.minSize}cm</div>
              </div>
              <div className="fish-info-main">
                <h4 className="m-0 text-lg font-bold">{fish.name}</h4>
                <p className="m-0 text-xs text-secondary italic">{fish.scientific}</p>
                <div className="fish-tags">
                  <span className="tag-pill"><Waves size={10}/> {fish.habitat.split(',')[0]}</span>
                  <span className={`tag-pill ${fish.defeso === 'Nenhum' ? 'safe' : 'alert'}`}>
                    <AlertCircle size={10}/> {fish.defeso === 'Nenhum' ? 'Livre' : 'Defeso'}
                  </span>
                </div>
              </div>
              <ChevronDown className={`chevron-anim ${selectedFish?.name === fish.name ? 'open' : ''}`} size={20} />
            </div>
            
            <AnimatePresence>
              {selectedFish?.name === fish.name && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="fish-card-body"
                >
                  <div className="body-grid">
                    <div className="detail-item">
                      <Target size={14} className="text-cyan" />
                      <div>
                        <label>TÉCNICA</label>
                        <span>{fish.technique}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Zap size={14} className="text-orange" />
                      <div>
                        <label>ISCOS</label>
                        <span>{fish.bait}</span>
                      </div>
                    </div>
                  </div>
                  <div className="defeso-info">
                    <Info size={14} />
                    <p><strong>Status Legal:</strong> {fish.defeso}. Verifique sempre o zoneamento local no mapa.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderRulesTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-col gap-16">
      <div className="premium-card bg-glass p-20 border-l-green">
        <div className="flex-center gap-12 mb-16">
          <div className="icon-box-green">
            <Gavel size={22} className="text-green" />
          </div>
          <h3 className="m-0 text-lg">Regras Gerais 2024</h3>
        </div>
        <div className="rules-list">
          <div className="rule-item">
            <CheckCircle2 size={16} className="text-green" />
            <p><strong>Quota Diária:</strong> Máximo de 5kg por pescador em águas oceânicas.</p>
          </div>
          <div className="rule-item">
            <CheckCircle2 size={16} className="text-green" />
            <p><strong>Aparelhagem:</strong> Máximo 3 anzóis por linha (ou 3 amostras).</p>
          </div>
          <div className="rule-item">
            <CheckCircle2 size={16} className="text-green" />
            <p><strong>Distâncias:</strong> Mantenha 50m de distância de outros pescadores.</p>
          </div>
        </div>
      </div>

      <div className="premium-card bg-glass p-20 border-l-red">
        <div className="flex-center gap-12 mb-16">
          <div className="icon-box-red">
            <AlertCircle size={22} className="text-red" />
          </div>
          <h3 className="m-0 text-lg">Zonas Interditas</h3>
        </div>
        <p className="text-sm text-secondary mb-12">A pesca é estritamente proibida ou condicionada nas seguintes áreas:</p>
        <div className="reserve-cards">
          <div className="reserve-mini-card">
            <strong>Berlengas</strong>
            <span>Taxa e Registo Prévio</span>
          </div>
          <div className="reserve-mini-card">
            <strong>Arrábida</strong>
            <span>Zoneamento Específico</span>
          </div>
          <div className="reserve-mini-card">
            <strong>SW Alentejano</strong>
            <span>Defesos Locais</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderKnotsTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-2 gap-12">
      {KNOTS_DATA.map((knot, idx) => (
        <motion.div 
          key={knot.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="knot-card-premium"
          style={{ borderTop: `4px solid ${knot.color}` }}
        >
          <div className="knot-icon" style={{ background: `${knot.color}20`, color: knot.color }}>
            <Zap size={20} />
          </div>
          <h4 className="m-0 mt-12 mb-4">{knot.name}</h4>
          <span className="text-2xs text-secondary uppercase font-bold tracking-wider">{knot.difficulty}</span>
          <div className="knot-steps-compact">
             {knot.steps.map((s, i) => (
               <div key={i} className="mini-step">
                 <div className="dot"></div>
                 <span>{s}</span>
               </div>
             ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderRulerTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-col items-center">
      <div className="premium-card bg-glass p-24 text-center w-full mb-32">
        <div className="icon-box-cyan mx-auto mb-16">
          <Ruler size={32} className="text-cyan" />
        </div>
        <h3 className="m-0 mb-8 text-xl">Régua de Alta Precisão</h3>
        <p className="text-sm text-secondary">Calibrada para ecrãs de 6.7". Ideal para medição rápida na costa.</p>
      </div>
      
      <div className="professional-ruler">
        <div className="ruler-body">
          {[...Array(31)].map((_, i) => (
            <div key={i} className={`tick ${i % 5 === 0 ? 'major' : i % 1 === 0 ? 'minor' : ''}`}>
              {i % 5 === 0 && <span className="tick-label">{i}</span>}
            </div>
          ))}
        </div>
        <div className="ruler-indicator"></div>
      </div>
      
      <div className="flex-center gap-10 mt-32 text-2xs text-secondary opacity-60">
        <CheckCircle2 size={12} />
        <span>CALIBRAÇÃO AUTOMÁTICA ATIVA</span>
      </div>
    </motion.div>
  );

  return (
    <div className="content-container pb-120" style={{ display: active ? 'block' : 'none' }}>
      <header className="page-header mb-24">
        <div className="flex-between items-center">
          <div>
            <h1 className="ios-large-title mb-4">Guia Pesca</h1>
            <p className="m-0 text-sm text-secondary">Manual de Campo Profissional</p>
          </div>
          <div className="header-icon-box">
            <BookOpen size={24} className="text-blue" />
          </div>
        </div>
      </header>
      
      {/* Sub-tabs Navigation - Premium Style */}
      <div className="premium-tab-bar mb-24">
        {subTabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`tab-item ${activeSubTab === tab.id ? 'active' : ''}`}
            style={{ '--active-color': tab.color }}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeSubTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === 'fish' && renderFishTab()}
          {activeSubTab === 'rules' && renderRulesTab()}
          {activeSubTab === 'knots' && renderKnotsTab()}
          {activeSubTab === 'ruler' && renderRulerTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GuideTab;
