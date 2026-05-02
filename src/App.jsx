import React, { useState, useEffect } from "react";
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
  Database
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Constants & Components
import { ZONES } from "./constants/zones";
import WeatherWidget from "./components/WeatherWidget";
import TideWidget from "./components/TideWidget";
import GuideTab from "./components/GuideTab";
import LogbookTab from "./components/LogbookTab";
import CommunityTab from "./components/CommunityTab";
import MapEventsHandler from "./components/MapEventsHandler";
import OfflineModal from "./components/OfflineModal";

function App() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTab, setActiveTab] = useState("map"); 
  
  // Waypoint & Layers State
  const [isWaypointMode, setIsWaypointMode] = useState(false);
  const [showMarineLayer, setShowMarineLayer] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [waypoints, setWaypoints] = useState(() => {
    const saved = localStorage.getItem("fishing_waypoints");
    return saved ? JSON.parse(saved) : [];
  });

  const [tides, setTides] = useState({
    loading: true,
    norte: null,
    centro: null,
    sul: null,
    error: null,
  });
  
  const [weatherData, setWeatherData] = useState({
    loading: true,
    data: null,
    error: null,
  });

  const getWindCardinal = (degrees) => {
    const val = Math.floor((degrees / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setTides((prev) => ({ ...prev, loading: true }));
      setWeatherData((prev) => ({ ...prev, loading: true }));

      const lat = selectedZone ? selectedZone.coordinates[0][0] : 41.15;
      const lon = selectedZone ? selectedZone.coordinates[0][1] : -8.61;

      try {
        const urls = [
          { key: 'norte', url: '/Portugal/Porto/Vila-do-Conde/' },
          { key: 'centro', url: '/Portugal/Lisboa/Cascais/' },
          { key: 'sul', url: '/Portugal/Faro/Faro/' }
        ];

        const tideResults = await Promise.all(urls.map(async ({key, url}) => {
          const res = await fetch(`/api/tabua${url}`);
          if (!res.ok) throw new Error("Tide Network Error");
          const html = await res.text();
          
          // Improved regex for TidesChart table structure
          const matches = [...html.matchAll(/<td>(High tide|Low tide)<\/td>\s*<td>(\d{1,2}:\d{2}\s+(?:am|pm))<\/td>/ig)];
          
          const highTides = matches.filter(m => m[1].toLowerCase().includes('high')).map(m => m[2]);
          const lowTides = matches.filter(m => m[1].toLowerCase().includes('low')).map(m => m[2]);
          
          return { 
            key, 
            data: { 
              preia1: highTides[0] || "--:--", 
              preia2: highTides[1] || "--:--", 
              baixa1: lowTides[0] || "--:--", 
              baixa2: lowTides[1] || "--:--" 
            } 
          };
        }));

        const newTides = { norte: null, centro: null, sul: null };
        tideResults.forEach(r => newTides[r.key] = r.data);
        
        setTides({ loading: false, ...newTides, error: null });
      } catch (err) {
        setTides({ loading: false, norte: null, centro: null, sul: null, error: "Erro ao carregar marés" });
      }

      try {
        const [weatherRes, marineRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m`),
          fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,sea_surface_temperature`)
        ]);

        const weatherJson = await weatherRes.json();
        const marineJson = await marineRes.json();

        const windKnots = Math.round(weatherJson.current.wind_speed_10m * 0.539957);
        const windDir = getWindCardinal(weatherJson.current.wind_direction_10m);

        setWeatherData({
          loading: false,
          data: {
            temp: Math.round(weatherJson.current.temperature_2m),
            windKnots,
            windDir,
            waveHeight: marineJson.current.wave_height ? marineJson.current.wave_height.toFixed(1) : "-",
            waterTemp: marineJson.current.sea_surface_temperature ? marineJson.current.sea_surface_temperature.toFixed(1) : "-"
          },
          error: null
        });
      } catch (err) {
        setWeatherData({ loading: false, data: null, error: "Erro ao carregar meteorologia" });
      }
    };

    fetchAllData();
  }, [selectedZone]);

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
            className={`fab ${isWaypointMode ? 'active pulse' : ''}`}
            onClick={() => setIsWaypointMode(!isWaypointMode)}
            title="Adicionar Waypoint"
          >
            <MapPin size={20} />
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

      {/* Background Map */}
      <div className="map-container" style={{ cursor: isWaypointMode ? 'crosshair' : 'grab' }}>
        <MapContainer
          center={center}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
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
          {!tides.loading && !tides.error && (
            <>
              {/* Norte (Offshore Viana/Porto) */}
              <Marker position={[41.2, -9.6]} opacity={0}>
                <Tooltip permanent direction="center" className="tide-tooltip-container">
                  <TideWidget title="Norte" data={tides.norte} />
                </Tooltip>
              </Marker>
              
              {/* Centro (Offshore Peniche/Lisboa) */}
              <Marker position={[39.1, -10.3]} opacity={0}>
                <Tooltip permanent direction="center" className="tide-tooltip-container">
                  <TideWidget title="Centro" data={tides.centro} />
                </Tooltip>
              </Marker>
              
              {/* Sul (Offshore Sagres/Faro) */}
              <Marker position={[36.7, -8.8]} opacity={0}>
                <Tooltip permanent direction="center" className="tide-tooltip-container">
                  <TideWidget title="Sul" data={tides.sul} />
                </Tooltip>
              </Marker>
            </>
          )}

          {/* Zones Polygons */}
          {ZONES.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coordinates}
              pathOptions={{
                color: zone.type === "allowed" ? "#10B981" : "#EF4444",
                fillOpacity: 0.4,
                weight: 2,
              }}
              eventHandlers={{
                click: () => {
                  if (!isWaypointMode) {
                    setSelectedZone(zone);
                  }
                },
              }}
            >
              <Popup>
                <div style={{ padding: "4px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{zone.name}</h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>{zone.description}</p>
                </div>
              </Popup>
            </Polygon>
          ))}

          {/* User Waypoints */}
          {waypoints.map((wp) => (
            <Marker key={wp.id} position={[wp.lat, wp.lng]}>
              <Popup>
                <div style={{ padding: "4px", textAlign: "center" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "var(--accent-yellow)" }}>
                    <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: 4 }}/>
                    {wp.name}
                  </h3>
                  <button 
                    onClick={() => {
                      const updated = waypoints.filter(w => w.id !== wp.id);
                      setWaypoints(updated);
                      localStorage.setItem("fishing_waypoints", JSON.stringify(updated));
                    }}
                    style={{ background: 'none', border: '1px solid var(--status-bad)', color: 'var(--status-bad)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
                  >
                    Remover
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* UI Overlay */}
      <div className="overlay-container" style={{ pointerEvents: 'none' }}>
        <div className="sidebar-right" style={{ pointerEvents: 'auto' }}>
          <WeatherWidget weatherData={weatherData} />
        </div>
      </div>

      <div className="mobile-nav">
        <button className={`nav-button ${activeTab === "map" ? "active" : ""}`} onClick={() => setActiveTab("map")}>
          <MapIcon size={24} /><span>Mapa</span>
        </button>
        <button className={`nav-button ${activeTab === "scale" ? "active" : ""}`} onClick={() => setActiveTab("scale")}>
          <Scale size={24} /><span>Guia</span>
        </button>
        <button className={`nav-button ${activeTab === "community" ? "active" : ""}`} onClick={() => setActiveTab("community")}>
          <Users size={24} /><span>Social</span>
        </button>
        <button className={`nav-button ${activeTab === "book" ? "active" : ""}`} onClick={() => setActiveTab("book")}>
          <BookOpen size={24} /><span>Diário</span>
        </button>
      </div>

      <GuideTab active={activeTab === 'scale'} />
      <LogbookTab active={activeTab === 'book'} selectedZone={selectedZone} />
      <CommunityTab active={activeTab === 'community'} />

    </div>
  );
}

export default App;
