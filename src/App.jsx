import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  SVGOverlay,
  Marker,
} from "react-leaflet";
import {
  Anchor,
  Fish,
  Map as MapIcon,
  Info,
  LayoutList,
  BookOpen,
  Scale,
  MapPin,
  Layers
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Constants & Components
import { ZONES } from "./constants/zones";
import WeatherWidget from "./components/WeatherWidget";
import TideWidget from "./components/TideWidget";
import GuideTab from "./components/GuideTab";
import LogbookTab from "./components/LogbookTab";
import MapEventsHandler from "./components/MapEventsHandler";

function App() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTab, setActiveTab] = useState("map"); // 'map', 'info', 'scale', 'book'
  
  // Waypoint & Layers State
  const [isWaypointMode, setIsWaypointMode] = useState(false);
  const [showMarineLayer, setShowMarineLayer] = useState(false);
  const [waypoints, setWaypoints] = useState(() => {
    const saved = localStorage.getItem("fishing_waypoints");
    return saved ? JSON.parse(saved) : [];
  });

  const [tideData, setTideData] = useState({
    loading: true,
    data: null,
    error: null,
  });
  
  const [weatherData, setWeatherData] = useState({
    loading: true,
    data: null,
    error: null,
  });
  
  const [probability, setProbability] = useState(0);

  // Calcula a fase da lua para a Teoria Solunar
  const calculateFishingProbability = () => {
    const LUNAR_MONTH = 29.53058867 * 24 * 60 * 60 * 1000;
    const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
    const diff = Date.now() - knownNewMoon;
    const phase = (diff % LUNAR_MONTH) / LUNAR_MONTH; // 0 to 1
    const wave = Math.cos(phase * Math.PI * 4); // varia entre -1 e 1
    const normalized = (wave + 1) / 2; // varia entre 0 e 1
    return Math.round(45 + (normalized * 50));
  };

  const getWindCardinal = (degrees) => {
    const val = Math.floor((degrees / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  };

  useEffect(() => {
    setProbability(calculateFishingProbability());
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setTideData((prev) => ({ ...prev, loading: true }));
      setWeatherData((prev) => ({ ...prev, loading: true }));

      const lat = selectedZone ? selectedZone.coordinates[0][0] : 41.15;
      const lon = selectedZone ? selectedZone.coordinates[0][1] : -8.61;

      try {
        const urlPath = selectedZone
          ? selectedZone.tabuaUrl
          : "/Portugal/Porto/Vila-do-Conde/";
        const tideResponse = await fetch(`/api/tabua${urlPath}`);
        if (!tideResponse.ok) throw new Error("Tide Network Error");
        const html = await tideResponse.text();

        const highTides = [...html.matchAll(/High tide<\/th>\s*<td>(.*?)<\/td>/ig)].map(m => m[1]);
        const lowTides = [...html.matchAll(/Low tide<\/th>\s*<td>(.*?)<\/td>/ig)].map(m => m[1]);

        if (highTides.length > 0 || lowTides.length > 0) {
          setTideData({
            loading: false,
            data: { preia1: highTides[0], preia2: highTides[1], baixa1: lowTides[0], baixa2: lowTides[1] },
            error: null,
          });
        } else {
          throw new Error("Dados não encontrados");
        }
      } catch (err) {
        setTideData({ loading: false, data: null, error: "Erro ao carregar" });
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
        setWeatherData({ loading: false, data: null, error: "Erro ao carregar" });
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
    setIsWaypointMode(false); // desativa o modo após adicionar
  };

  const center = [39.5, -8.0];

  return (
    <div className={`app-container tab-${activeTab}`}>
      {/* Mobile Header */}
      <div className="mobile-header">
        <Fish className="brand-icon" size={24} />
        <span className="brand-title">Pesca Lúdica PT</span>
      </div>

      {/* Floating Action Buttons for Map */}
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
      </div>

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
                <path className="animated-wave wave-delay-2" d="M -50 0 Q -45 25 -50 50 T -50 100" />
                <path className="animated-wave wave-delay-3" d="M -70 0 Q -65 25 -70 50 T -70 100" />
              </g>
            </svg>
          </SVGOverlay>

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
                    setActiveTab("info");
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

      <TideWidget tideData={tideData} selectedZone={selectedZone} />

      {/* UI Overlay */}
      <div className="overlay-container">
        <div className="sidebar-left">
          <div className="glass-panel brand-header desktop-only">
            <Fish className="brand-icon" size={32} />
            <span className="brand-title">Pesca Lúdica PT</span>
          </div>

          <div className="glass-panel widget">
            <div className="widget-title">
              <Anchor size={18} />
              Probabilidade de Pesca (Solunar)
            </div>
            <div className="probability-score">
              <div 
                className="score-circle"
                style={{
                  color: probability >= 75 ? "var(--status-good)" : probability >= 50 ? "var(--accent-yellow)" : "var(--status-bad)",
                  borderColor: probability >= 75 ? "var(--status-good)" : probability >= 50 ? "var(--accent-yellow)" : "var(--status-bad)"
                }}
              >{probability}%</div>
              <span 
                className="score-label"
                style={{
                  color: probability >= 75 ? "var(--status-good)" : probability >= 50 ? "var(--accent-yellow)" : "var(--status-bad)",
                }}
              >
                {probability >= 75 ? "Condições Ideais" : probability >= 50 ? "Condições Moderadas" : "Atividade Baixa"}
              </span>
            </div>
          </div>

          <div className="glass-panel widget desktop-only">
            <div className="widget-title">
              <MapIcon size={18} />
              Legenda do Mapa
            </div>
            <div className="legend-item">
              <div className="legend-color color-allowed"></div>
              <span>Zona de Pesca Permitida</span>
            </div>
            <div className="legend-item">
              <div className="legend-color color-forbidden"></div>
              <span>Zona Proibida / Protegida</span>
            </div>
          </div>
        </div>

        <div className="sidebar-right">
          <WeatherWidget weatherData={weatherData} />

          {selectedZone && (
            <div
              className="glass-panel widget"
              style={{
                borderColor: selectedZone.type === "allowed" ? "var(--status-good)" : "var(--status-bad)",
              }}
            >
              <div className="widget-title">
                <Info size={18} />
                Zona Selecionada
              </div>
              <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>{selectedZone.name}</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{selectedZone.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mobile-nav">
        <button className={`nav-button ${activeTab === "map" ? "active" : ""}`} onClick={() => setActiveTab("map")}>
          <MapIcon size={24} /><span>Mapa</span>
        </button>
        <button className={`nav-button ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
          <LayoutList size={24} /><span>Info</span>
        </button>
        <button className={`nav-button ${activeTab === "scale" ? "active" : ""}`} onClick={() => setActiveTab("scale")}>
          <Scale size={24} /><span>Guia</span>
        </button>
        <button className={`nav-button ${activeTab === "book" ? "active" : ""}`} onClick={() => setActiveTab("book")}>
          <BookOpen size={24} /><span>Diário</span>
        </button>
      </div>

      <GuideTab active={activeTab === 'scale'} />
      <LogbookTab active={activeTab === 'book'} selectedZone={selectedZone} />

    </div>
  );
}

export default App;
