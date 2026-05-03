import React, { useState } from 'react';
import { Layers, Users, MapPin, Anchor, Database, Wind, Waves, ChevronLeft, ChevronRight, X, CloudRain, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const MapActionButtons = () => {
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  
  const {
    showMarineLayer, setShowMarineLayer,
    showBathymetry, setShowBathymetry,
    showWindVectors, setShowWindVectors,
    showRadar, setShowRadar,
    showCommunityLayer, setShowCommunityLayer,
    isWaypointMode, setIsWaypointMode,
    setIsOfflineModalOpen,
    requestCenterMap,
    isSearchOpen, setIsSearchOpen
  } = useAppContext();

  const layerButtons = [
    { id: 'radar', icon: CloudRain, active: showRadar, action: () => setShowRadar(!showRadar), title: "Radar de Chuva" },
    { id: 'bathymetry', icon: Waves, active: showBathymetry, action: () => setShowBathymetry(!showBathymetry), title: "Batimetria" },
    { id: 'wind', icon: Wind, active: showWindVectors, action: () => setShowWindVectors(!showWindVectors), title: "Vento" },
    { id: 'marine', icon: Layers, active: showMarineLayer, action: () => setShowMarineLayer(!showMarineLayer), title: "Cartas Náuticas" },
    { id: 'offline', icon: Database, active: false, action: () => setIsOfflineModalOpen(true), title: "Download Mapas" },
  ];

  return (
    <div className="map-fab-container">
      {/* Primary Actions (Always Visible) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fab location-fab`}
        onClick={requestCenterMap}
        title="Minha Localização"
      >
        <Anchor size={22} />
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fab waypoint-fab ${isWaypointMode ? 'active pulse' : ''}`}
        onClick={() => setIsWaypointMode(!isWaypointMode)}
        title="Novo Waypoint"
      >
        <MapPin size={22} />
      </motion.button>

      {/* Search Toggle (Above Layers) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fab search-fab ${isSearchOpen ? 'active' : ''}`}
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        title="Pesquisar Locais"
      >
        <Search size={22} />
      </motion.button>

      {/* Layers Menu Toggle */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <AnimatePresence>
          {isLayersOpen && (
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="layers-submenu"
              style={{ 
                display: 'flex', 
                gap: '10px', 
                marginRight: '10px',
                background: 'rgba(0,0,0,0.5)',
                padding: '5px 15px',
                borderRadius: '30px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {layerButtons.map((btn) => (
                <motion.button
                  key={btn.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`sub-fab ${btn.active ? 'active' : ''}`}
                  onClick={btn.action}
                  title={btn.title}
                  style={{
                    background: btn.active ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <btn.icon size={18} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`fab layers-toggle-fab ${isLayersOpen ? 'active' : ''}`}
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          title="Camadas do Mapa"
        >
          {isLayersOpen ? <X size={22} /> : <Layers size={22} />}
        </motion.button>
      </div>
    </div>
  );
};

export default MapActionButtons;
