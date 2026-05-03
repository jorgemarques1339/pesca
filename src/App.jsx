import React from "react";
import {
  Map as MapIcon,
  BookOpen,
  Users,
  Ruler,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Components
import WeatherWidget from "./components/WeatherWidget";
import GuideTab from "./components/GuideTab";
import ProfileTab from "./components/ProfileTab";
import CommunityTab from "./components/CommunityTab";
import OfflineModal from "./components/OfflineModal";
import NavigationPanel from "./components/NavigationPanel";
import MainMap from "./components/MainMap";
import MapActionButtons from "./components/MapActionButtons";
import SearchOverlay from "./components/SearchOverlay";

// Hooks & Context
import { useAppContext } from "./context/AppContext";
import { useGeofencing } from "./hooks/useGeofencing";

const tabVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  })
};

function App() {
  const {
    activeTab,
    setActiveTab,
    selectedZone,
    isOfflineModalOpen,
    setIsOfflineModalOpen,
    navTarget,
    setNavTarget,
    userPos,
    heading,
    weatherData,
    solunarData,
    tides,
    logs,
    handleAddLog,
    handleDeleteLog
  } = useAppContext();

  // Initialize Geofencing
  useGeofencing();

  // Map tab names to indices for direction-based animation
  const tabs = ["map", "scale", "community", "book"];
  const activeIndex = tabs.indexOf(activeTab);
  const [prevIndex, setPrevIndex] = React.useState(activeIndex);
  const direction = activeIndex > prevIndex ? 1 : -1;

  const handleTabChange = (newTab) => {
    setPrevIndex(activeIndex);
    setActiveTab(newTab);
  };

  return (
    <div className={`app-container tab-${activeTab}`}>
      {/* Map Action Buttons */}
      <AnimatePresence>
        {activeTab === "map" && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <MapActionButtons />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay />

      <OfflineModal 
        isOpen={isOfflineModalOpen} 
        onClose={() => setIsOfflineModalOpen(false)} 
      />

      <NavigationPanel 
        userPos={userPos} 
        target={navTarget} 
        heading={heading} 
        onClose={() => setNavTarget(null)} 
      />

      {/* Background Map Module - Always present */}
      <MainMap />

      {/* UI Overlay */}
      <div className="overlay-container" style={{ pointerEvents: 'none' }}>
        <div className="sidebar-right" style={{ pointerEvents: 'auto' }}>
          <WeatherWidget weatherData={weatherData} solunarData={solunarData} />
        </div>
      </div>

      {/* Global Data Source Indicator */}
      {weatherData.data && (
        <div className="data-source-indicator">
          <div className="glass-capsule">
            <span className="source-label">
              Fonte: <strong style={{ color: weatherData.data.source === 'Windy' ? '#00f2ff' : '#aaa' }}>{weatherData.data.source}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Tab Panels with Transitions */}
      <AnimatePresence mode="wait" custom={direction}>
        {activeTab !== 'map' && (
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="tab-panel-container"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000 }}
          >
            {activeTab === 'scale' && <GuideTab active={true} />}
            {activeTab === 'book' && (
              <ProfileTab 
                active={true} 
              />
            )}
            {activeTab === 'community' && <CommunityTab active={true} logs={logs} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        {tabs.map((tab, idx) => {
          const Icon = [MapIcon, Ruler, Users, User][idx];
          const labels = ["Mapa", "Guia", "Social", "Perfil"];
          return (
            <motion.button 
              key={tab}
              className={`nav-button ${activeTab === tab ? "active" : ""}`} 
              onClick={() => handleTabChange(tab)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              <Icon size={24} />
              <span>{labels[idx]}</span>
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="active-indicator"
                  style={{ 
                    position: 'absolute', 
                    bottom: -5, 
                    width: 4, 
                    height: 4, 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent-blue)' 
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
