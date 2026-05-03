import React, { useState } from 'react';
import { Search, MapPin, X, Anchor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const POPULAR_SPOTS = [
  { name: "Peniche", lat: 39.3558, lng: -9.3813, type: "Porto / Surf" },
  { name: "Nazaré", lat: 39.6012, lng: -9.0701, type: "Farol / Canhão" },
  { name: "Praia do Magoito", lat: 38.8654, lng: -9.4485, type: "Praia" },
  { name: "Setúbal", lat: 38.5244, lng: -8.8931, type: "Rio Sado" },
  { name: "Sagres", lat: 37.0097, lng: -8.9408, type: "Cabo" },
  { name: "Viana do Castelo", lat: 41.6918, lng: -8.8344, type: "Norte" },
  { name: "Ericeira", lat: 38.9631, lng: -9.4124, type: "Reserva Mundial" },
];

const SearchOverlay = () => {
  const { isSearchOpen, setIsSearchOpen, setMapCenterRequest } = useAppContext();
  const [query, setQuery] = useState("");

  const filteredSpots = POPULAR_SPOTS.filter(spot => 
    spot.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (spot) => {
    setMapCenterRequest({ lat: spot.lat, lng: spot.lng, zoom: 14, timestamp: Date.now() });
    setIsSearchOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="search-overlay-container"
        >
          <div className="search-bar-glass">
            <Search size={20} className="search-icon" />
            <input 
              autoFocus
              type="text" 
              placeholder="Pesquisar praias, portos ou pesqueiros..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="close-search" onClick={() => setIsSearchOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="search-results-glass">
            <h4 className="results-title">{query ? "Resultados" : "Locais Populares"}</h4>
            <div className="results-list">
              {filteredSpots.map((spot, i) => (
                <motion.div 
                  key={spot.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="search-result-item"
                  onClick={() => handleSelect(spot)}
                >
                  <div className="item-icon">
                    {spot.type.includes("Porto") ? <Anchor size={16} /> : <MapPin size={16} />}
                  </div>
                  <div className="item-info">
                    <span className="item-name">{spot.name}</span>
                    <span className="item-type">{spot.type}</span>
                  </div>
                </motion.div>
              ))}
              {filteredSpots.length === 0 && (
                <div className="no-results">Nenhum local encontrado.</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
