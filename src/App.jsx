import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  SVGOverlay,
  Marker,
  Tooltip
} from "react-leaflet";
import {
  Anchor,
  Fish,
  Map as MapIcon,
  LayoutList,
  BookOpen,
  Scale,
  MapPin,
  Layers,
  Users,
  Database,
  Trophy,
  Ruler
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Constants & Components
import { ZONES } from "./constants/zones";
import WeatherWidget from "./components/WeatherWidget";
import GuideTab from "./components/GuideTab";
import LogbookTab from "./components/LogbookTab";
import CommunityTab from "./components/CommunityTab";
import MapEventsHandler from "./components/MapEventsHandler";
import OfflineModal from "./components/OfflineModal";
import ZonePolygons from "./components/ZonePolygons";
import MapWaypoints from "./components/MapWaypoints";
import TideMarkers from "./components/TideMarkers";
import CommunityMarkers from "./components/CommunityMarkers";
import EliteTab from "./components/EliteTab";

// Hooks
import { useTides } from "./hooks/useTides";
import { useWeather } from "./hooks/useWeather";
import { useSolunar } from "./hooks/useSolunar";
import { useGeolocation } from "./hooks/useGeolocation";
import { useOrientation } from "./hooks/useOrientation";
import { isPointInPolygon } from "./utils/geoUtils";
import NavigationPanel from "./components/NavigationPanel";

function App() {
  const mapRef = useRef(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTab, setActiveTab] = useState("map"); 
  
  // Waypoint & Layers State
  const [isWaypointMode, setIsWaypointMode] = useState(false);
  const [showMarineLayer, setShowMarineLayer] = useState(false);
  const [showCommunityLayer, setShowCommunityLayer] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [waypoints, setWaypoints] = useState(() => {
    const saved = localStorage.getItem("fishing_waypoints");
    return saved ? JSON.parse(saved) : [];
  });
  const [navTarget, setNavTarget] = useState(null);
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("fishing_logs");
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddLog = (log) => {
    const updated = [log, ...logs];
    setLogs(updated);
    localStorage.setItem("fishing_logs", JSON.stringify(updated));
  };

  const handleDeleteLog = (id) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem("fishing_logs", JSON.stringify(updated));
  };

  const tides = useTides();
  const solunarData = useSolunar(tides);
  const { position: userPos } = useGeolocation();
  const { heading, requestPermission } = useOrientation();
  
  const lat = selectedZone ? selectedZone.coordinates[0][0] : (userPos ? userPos.lat : 39.5);
  const lon = selectedZone ? selectedZone.coordinates[0][1] : (userPos ? userPos.lng : -8.0);
  const weatherData = useWeather(lat, lon);

  // Geofencing Logic
  useEffect(() => {
    if (userPos) {
      const forbiddenZones = ZONES.filter(z => z.type === "forbidden");
      const currentZone = forbiddenZones.find(z => isPointInPolygon([userPos.lat, userPos.lng], z.coordinates));
      
      if (currentZone) {
        // Trigger alert
        if ('speechSynthesis' in window) {
          const msg = new SpeechSynthesisUtterance(`Atenção: Entrou em zona de pesca proibida: ${currentZone.name}`);
          msg.lang = 'pt-PT';
          window.speechSynthesis.speak(msg);
        }
        alert(`ALERTA: Está dentro de uma ZONA PROIBIDA (${currentZone.name})!`);
      }
    }
  }, [userPos]);


  const handleMapClick = (latlng) => {
    if (!isWaypointMode) return;
    
    const name = prompt("Nome do Pesqueiro / Waypoint:");
    if (name) {
      const newWaypoint = {
        id: Date.now(),
        name,
        lat: latlng.lat,
        lng: latlng.lng,
      };
      const updatedWaypoints = [...waypoints, newWaypoint];
      setWaypoints(updatedWaypoints);
      localStorage.setItem("fishing_waypoints", JSON.stringify(updatedWaypoints));
    }
    setIsWaypointMode(false);
  };

  const center = [39.5, -8.0];

  return (
    <div className={`app-container tab-${activeTab}`}>
      {/* Floating Action Buttons for Map */}
      {activeTab === "map" && (
        <div className="map-fab-container">
          <button 
            className={`fab ${showMarineLayer ? 'active' : ''}`}
            onClick={() => setShowMarineLayer(!showMarineLayer)}
            title="Alternar Cartas Náuticas"
          >
            <Layers size={20} />
          </button>
          <button 
            className={`fab ${showCommunityLayer ? 'active' : ''}`}
            onClick={() => setShowCommunityLayer(!showCommunityLayer)}
            title="Comunidade & Lojas"
          >
            <Users size={20} />
          </button>
          <button 
            className={`fab ${isWaypointMode ? 'active pulse' : ''}`}
            onClick={() => setIsWaypointMode(!isWaypointMode)}
            title="Adicionar Waypoint"
          >
            <MapPin size={20} />
          </button>
          <button 
            className="fab"
            onClick={() => {
              if (userPos && mapRef.current) {
                mapRef.current.setView([userPos.lat, userPos.lng], 13);
              } else if (!userPos) {
                alert("Geolocalização não disponível.");
              }
            }}
            title="Minha Localização"
          >
            <Anchor size={20} />
          </button>
          <button 
            className="fab"
            onClick={() => setIsOfflineModalOpen(true)}
            title="Mapas Offline"
          >
            <Database size={20} />
          </button>
        </div>
      )}

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

      {/* Background Map */}
      <div className="map-container" style={{ cursor: isWaypointMode ? 'crosshair' : 'grab' }}>
        <MapContainer
          center={center}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          ref={mapRef}
        >
          {/* Tile Layer Base - Satellite */}
          <TileLayer
            attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          
          {/* Labels Layer (Boundaries and Places) */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          />

          {/* Marine Layer (OpenSeaMap) */}
          {showMarineLayer && (
            <TileLayer
              attribution='&copy; OpenSeaMap contributors'
              url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
            />
          )}

          <MapEventsHandler isWaypointMode={isWaypointMode} onMapClick={handleMapClick} />

          <SVGOverlay bounds={[[42.5, -12], [36.5, -9]]}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <g style={{ transformOrigin: 'center' }}>
                <path className="animated-wave" d="M -10 0 Q -5 25 -10 50 T -10 100" />
                <path className="animated-wave wave-delay-1" d="M -30 0 Q -25 25 -30 50 T -30 100" />
                <path className="animated-wave wave-delay-3" d="M -70 0 Q -65 25 -70 50 T -70 100" />
              </g>
            </svg>
          </SVGOverlay>

          {/* Tides Anchored to Map */}
          <TideMarkers tides={tides} />

          {/* User Location Marker */}
          {userPos && (
            <Marker 
              position={[userPos.lat, userPos.lng]} 
              icon={new L.Icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/7133/7133312.png',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              })}
            >
              <Popup>Sua localização atual</Popup>
            </Marker>
          )}

          {/* Zones Polygons */}
          <ZonePolygons 
            isWaypointMode={isWaypointMode} 
            onZoneClick={setSelectedZone} 
          />

          {/* Community Points (Shops, Ramps) */}
          <CommunityMarkers visible={showCommunityLayer} />

          {/* User Waypoints */}
          <MapWaypoints 
            waypoints={waypoints} 
            onRemoveWaypoint={(id) => {
              const updated = waypoints.filter(w => w.id !== id);
              setWaypoints(updated);
              localStorage.setItem("fishing_waypoints", JSON.stringify(updated));
              if (navTarget?.id === id) setNavTarget(null);
            }}
            onNavigateTo={async (wp) => {
              await requestPermission();
              setNavTarget(wp);
            }}
          />
        </MapContainer>
      </div>

      {/* UI Overlay */}
      <div className="overlay-container" style={{ pointerEvents: 'none' }}>
        <div className="sidebar-right" style={{ pointerEvents: 'auto' }}>
          <WeatherWidget weatherData={weatherData} solunarData={solunarData} />
        </div>
      </div>

      <div className="mobile-nav">
        <button className={`nav-button ${activeTab === "map" ? "active" : ""}`} onClick={() => setActiveTab("map")}>
          <MapIcon size={24} /><span>Mapa</span>
        </button>
        <button className={`nav-button ${activeTab === "scale" ? "active" : ""}`} onClick={() => setActiveTab("scale")}>
          <Ruler size={24} /><span>Guia</span>
        </button>
        <button className={`nav-button ${activeTab === "elite" ? "active" : ""}`} onClick={() => setActiveTab("elite")}>
          <Trophy size={24} /><span>Elite</span>
        </button>
        <button className={`nav-button ${activeTab === "community" ? "active" : ""}`} onClick={() => setActiveTab("community")}>
          <Users size={24} /><span>Social</span>
        </button>
        <button className={`nav-button ${activeTab === "book" ? "active" : ""}`} onClick={() => setActiveTab("book")}>
          <BookOpen size={24} /><span>Diário</span>
        </button>
      </div>

      <GuideTab active={activeTab === 'scale'} />
      <LogbookTab 
        active={activeTab === "book"} 
        selectedZone={selectedZone}
        weatherData={weatherData}
        tides={tides}
        solunarData={solunarData}
        logs={logs}
        onAddLog={handleAddLog}
        onDeleteLog={handleDeleteLog}
      />
      <EliteTab active={activeTab === 'elite'} logs={logs} />
      <CommunityTab active={activeTab === 'community'} />

    </div>
  );
}

export default App;
