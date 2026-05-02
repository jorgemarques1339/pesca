import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  Marker,
  useMap,
  SVGOverlay,
} from "react-leaflet";
import {
  Waves,
  Wind,
  Thermometer,
  Anchor,
  Fish,
  Map as MapIcon,
  Info,
  LayoutList,
  BookOpen,
  Scale,
  Plus,
  Trash2
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Dados das Zonas de Pesca (Portugal Continental)
const ZONES = [
  // ZONAS PROIBIDAS (Vermelho)
  {
    id: "zf1",
    name: "Parque Natural do Litoral Norte",
    type: "forbidden",
    tabuaUrl: "/Portugal/Braga/Esposende/",
    coordinates: [
      [41.56, -8.83],
      [41.56, -8.80],
      [41.51, -8.80],
      [41.51, -8.83],
    ],
    description: "Zona de Proteção. Pesca restrita ou proibida em áreas específicas para preservação.",
  },
  {
    id: "zf_povoa_porto",
    name: "Porto de Pesca da Póvoa de Varzim",
    type: "forbidden",
    tabuaUrl: "/Portugal/Porto/Povoa-de-Varzim/",
    coordinates: [
      [41.380, -8.775],
      [41.380, -8.760],
      [41.370, -8.760],
      [41.370, -8.775],
    ],
    description: "Pesca totalmente proibida nos molhes, canal de navegação e interior da doca.",
  },
  {
    id: "zf_mindelo",
    name: "Reserva Ornitológica de Mindelo",
    type: "forbidden",
    tabuaUrl: "/Portugal/Porto/Vila-do-Conde/",
    coordinates: [
      [41.325, -8.745],
      [41.325, -8.730],
      [41.305, -8.730],
      [41.305, -8.745],
    ],
    description: "Paisagem Protegida Regional. Pesca lúdica estritamente interdita nas linhas de água abrangidas.",
  },
  {
    id: "zf_viladoconde",
    name: "Porto de Vila do Conde / Foz do Ave",
    type: "forbidden",
    tabuaUrl: "/Portugal/Porto/Vila-do-Conde/",
    coordinates: [
      [41.340, -8.755],
      [41.340, -8.740],
      [41.330, -8.740],
      [41.330, -8.755],
    ],
    description: "Interdita na barra, canal de navegação, estaleiros e cais portuários por razões de segurança.",
  },
  {
    id: "zf_leixoes",
    name: "Porto de Leixões (Matosinhos)",
    type: "forbidden",
    tabuaUrl: "/Portugal/Porto/Matosinhos/",
    coordinates: [
      [41.190, -8.715],
      [41.190, -8.695],
      [41.175, -8.695],
      [41.175, -8.715],
    ],
    description: "Pesca totalmente proibida no canal exterior, anteporto, docas e marina por razões de segurança marítima.",
  },
  {
    id: "zf2",
    name: "Reserva Natural das Berlengas",
    type: "forbidden",
    tabuaUrl: "/Portugal/Leiria/Peniche/",
    coordinates: [
      [39.42, -9.52],
      [39.42, -9.48],
      [39.4, -9.48],
      [39.4, -9.52],
    ],
    description: "Área marinha protegida. Pesca fortemente limitada e sujeita a licenças especiais.",
  },
  {
    id: "zf3",
    name: "Parque Marinho da Arrábida",
    type: "forbidden",
    tabuaUrl: "/Portugal/Setubal/Sesimbra/",
    coordinates: [
      [38.45, -9.05],
      [38.45, -8.95],
      [38.42, -8.95],
      [38.42, -9.05],
    ],
    description: "Zona de Proteção Total. Pesca estritamente proibida (Pedra do Leão, etc).",
  },
  {
    id: "zf4",
    name: "Ilhotes do Martinhal (Sagres)",
    type: "forbidden",
    tabuaUrl: "/Portugal/Faro/Sagres/",
    coordinates: [
      [37.025, -8.935],
      [37.025, -8.920],
      [37.010, -8.920],
      [37.010, -8.935],
    ],
    description: "Interdição total de pesca por razões de conservação da biodiversidade.",
  },
  {
    id: "zf5",
    name: "Ria Formosa (Proteção Total)",
    type: "forbidden",
    tabuaUrl: "/Portugal/Faro/Faro/",
    coordinates: [
      [37.00, -7.95],
      [37.00, -7.90],
      [36.97, -7.90],
      [36.97, -7.95],
    ],
    description: "Áreas de viveiros e interdição ambiental. Proibida a pesca lúdica.",
  },

  // ZONAS PERMITIDAS (Verde)
  {
    id: "zp1",
    name: "Molhes de Viana do Castelo",
    type: "allowed",
    tabuaUrl: "/Portugal/Viana-do-Castelo/Viana-do-Castelo/",
    coordinates: [
      [41.69, -8.845],
      [41.69, -8.830],
      [41.67, -8.830],
      [41.67, -8.845],
    ],
    description: "Excelente local para pesca apeada ao robalo e sargo.",
  },
  {
    id: "zp_agucadoura",
    name: "Praia da Aguçadoura / Estela",
    type: "allowed",
    tabuaUrl: "/Portugal/Porto/Povoa-de-Varzim/",
    coordinates: [
      [41.440, -8.790],
      [41.440, -8.775],
      [41.420, -8.775],
      [41.420, -8.790],
    ],
    description: "Extenso areal excelente para a prática de surfcasting (robalo, sargo).",
  },
  {
    id: "zp2",
    name: "Molhes da Ria de Aveiro",
    type: "allowed",
    tabuaUrl: "/Portugal/Aveiro/Aveiro/",
    coordinates: [
      [40.645, -8.760],
      [40.645, -8.740],
      [40.635, -8.740],
      [40.635, -8.760],
    ],
    description: "Zona popular de pesca costeira. Bom para douradas e robalos.",
  },
  {
    id: "zp3",
    name: "Costa de Peniche",
    type: "allowed",
    tabuaUrl: "/Portugal/Leiria/Peniche/",
    coordinates: [
      [39.38, -9.42],
      [39.38, -9.35],
      [39.3, -9.35],
      [39.3, -9.42],
    ],
    description: "Zona fora da área de proteção, ideal para pesca desportiva embarcada e apeada.",
  },
  {
    id: "zp4",
    name: "Cabo Espichel",
    type: "allowed",
    tabuaUrl: "/Portugal/Setubal/Sesimbra/",
    coordinates: [
      [38.42, -9.23],
      [38.42, -9.20],
      [38.40, -9.20],
      [38.40, -9.23],
    ],
    description: "Pesqueiro icónico em falésia, exigente mas com grande potencial para peixe graúdo.",
  },
  {
    id: "zp5",
    name: "Costa Vicentina (Amoreira)",
    type: "allowed",
    tabuaUrl: "/Portugal/Faro/Sagres/",
    coordinates: [
      [37.36, -8.86],
      [37.36, -8.84],
      [37.32, -8.84],
      [37.32, -8.86],
    ],
    description: "Zona permitida de grande beleza natural, muito procurada para surfcasting.",
  },
  {
    id: "zp6",
    name: "Ponta da Piedade (Lagos)",
    type: "allowed",
    tabuaUrl: "/Portugal/Faro/Lagos/",
    coordinates: [
      [37.09, -8.68],
      [37.09, -8.66],
      [37.07, -8.66],
      [37.07, -8.68],
    ],
    description: "Zona mista de pedra e areia. Excelente para pesca embarcada costeira e spinning.",
  },
];

function App() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTab, setActiveTab] = useState("map"); // 'map' or 'info'
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

  // Logbook State
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("fishing_logs");
    return saved ? JSON.parse(saved) : [];
  });
  const [newLog, setNewLog] = useState({ species: "", bait: "", note: "" });

  const handleAddLog = () => {
    if (!newLog.species) return;
    const log = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      zone: selectedZone ? selectedZone.name : "Local Desconhecido",
      ...newLog
    };
    const updated = [log, ...logs];
    setLogs(updated);
    localStorage.setItem("fishing_logs", JSON.stringify(updated));
    setNewLog({ species: "", bait: "", note: "" });
  };

  const deleteLog = (id) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem("fishing_logs", JSON.stringify(updated));
  };

  // Calcula a fase da lua para a Teoria Solunar
  const calculateFishingProbability = () => {
    const LUNAR_MONTH = 29.53058867 * 24 * 60 * 60 * 1000;
    const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
    const diff = Date.now() - knownNewMoon;
    const phase = (diff % LUNAR_MONTH) / LUNAR_MONTH; // 0 to 1
    // Picos de atividade (Full Moon = 0.5, New Moon = 0 ou 1)
    const wave = Math.cos(phase * Math.PI * 4); // varia entre -1 e 1
    const normalized = (wave + 1) / 2; // varia entre 0 e 1
    // Base 45%, Lua dá até +50% (Max 95%)
    return Math.round(45 + (normalized * 50));
  };

  const getWindCardinal = (degrees) => {
    const val = Math.floor((degrees / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  };

  // Atualiza probabilidade inicial
  React.useEffect(() => {
    setProbability(calculateFishingProbability());
  }, []);

  // Fetch tides & weather when selected zone changes
  React.useEffect(() => {
    const fetchAllData = async () => {
      setTideData((prev) => ({ ...prev, loading: true }));
      setWeatherData((prev) => ({ ...prev, loading: true }));

      // Se não houver zona selecionada, usa o Porto (centro geográfico da costa norte)
      const lat = selectedZone ? selectedZone.coordinates[0][0] : 41.15;
      const lon = selectedZone ? selectedZone.coordinates[0][1] : -8.61;

      try {
        // Fetch Marés
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
            data: { 
              preia1: highTides[0], preia2: highTides[1], 
              baixa1: lowTides[0], baixa2: lowTides[1] 
            },
            error: null,
          });
        } else {
          throw new Error("Dados não encontrados");
        }
      } catch (err) {
        setTideData({ loading: false, data: null, error: "Erro ao carregar" });
      }

      try {
        // Fetch Meteorologia e Mar (Open-Meteo)
        const [weatherRes, marineRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m`),
          fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,sea_surface_temperature`)
        ]);

        const weatherJson = await weatherRes.json();
        const marineJson = await marineRes.json();

        // km/h para nós
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

  // Portugal center coordinates
  const center = [39.5, -8.0];

  return (
    <div className={`app-container tab-${activeTab}`}>
      {/* Mobile Header (Only visible on mobile info tab) */}
      <div className="mobile-header">
        <Fish className="brand-icon" size={24} />
        <span className="brand-title">Pesca Lúdica PT</span>
      </div>

      {/* Background Map */}
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          {/* Using a dark ocean themed tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Animated Waves Overlay (West of Portugal Coast) */}
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
                  setSelectedZone(zone);
                  setActiveTab("info"); // Auto-switch to info tab on mobile when zone selected
                },
              }}
            >
              <Popup>
                <div style={{ padding: "4px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                    {zone.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    {zone.description}
                  </p>
                </div>
              </Popup>
            </Polygon>
          ))}
        </MapContainer>
      </div>

      {/* Tides Bottom Widget */}
      <div className="glass-panel tide-widget-bottom">
        <div className="tide-title-vertical">
          <h3 className="widget-title">
            <Waves size={18} /> Tábua de Marés
          </h3>
          <span className="zone-name">
            {selectedZone ? selectedZone.name : "Vila do Conde"}
          </span>
        </div>

        <div className="tide-horizontal-info">
          {tideData.loading ? (
            <div style={{ color: "var(--text-secondary)" }}>
              A carregar dados do tabuademares.com...
            </div>
          ) : tideData.error ? (
            <div style={{ color: "var(--status-bad)" }}>{tideData.error}</div>
          ) : (
            <>
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
            </>
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
              bottom: "16px",
            }}
          >
            Fonte
          </a>
        )}
      </div>

      {/* UI Overlay */}
      <div className="overlay-container">
        {/* Left Sidebar */}
        <div className="sidebar-left">
          {/* Branding (Hidden on mobile, replaced by mobile-header) */}
          <div className="glass-panel brand-header desktop-only">
            <Fish className="brand-icon" size={32} />
            <span className="brand-title">Pesca Lúdica PT</span>
          </div>

          {/* Probability Score */}
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

          {/* Legend */}
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

        {/* Right Sidebar */}
        <div className="sidebar-right">
          {/* Weather Widget */}
          <div className="glass-panel widget">
            <div className="widget-title">
              <Wind size={18} />
              Condições Atmosféricas
            </div>
            {weatherData.loading ? (
              <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "10px" }}>A carregar dados...</div>
            ) : weatherData.error ? (
              <div style={{ color: "var(--status-bad)", textAlign: "center", padding: "10px" }}>{weatherData.error}</div>
            ) : weatherData.data ? (
              <>
                <div className="weather-stat">
                  <div className="stat-left">
                    <Wind className="stat-icon" size={20} />
                    <span className="stat-label">Vento</span>
                  </div>
                  <span className="stat-value">{weatherData.data.windKnots} nós ({weatherData.data.windDir})</span>
                </div>

                <div className="weather-stat">
                  <div className="stat-left">
                    <Waves className="stat-icon" size={20} />
                    <span className="stat-label">Ondulação</span>
                  </div>
                  <span className="stat-value">{weatherData.data.waveHeight}m</span>
                </div>

                <div className="weather-stat">
                  <div className="stat-left">
                    <Thermometer className="stat-icon" size={20} />
                    <span className="stat-label">Temp. Ar</span>
                  </div>
                  <span className="stat-value">{weatherData.data.temp}°C</span>
                </div>

                <div className="weather-stat">
                  <div className="stat-left">
                    <svg className="stat-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
                    <span className="stat-label">Temp. Água</span>
                  </div>
                  <span className="stat-value">{weatherData.data.waterTemp}°C</span>
                </div>
              </>
            ) : null}
          </div>

          {selectedZone && (
            <div
              className="glass-panel widget"
              style={{
                borderColor:
                  selectedZone.type === "allowed"
                    ? "var(--status-good)"
                    : "var(--status-bad)",
              }}
            >
              <div className="widget-title">
                <Info size={18} />
                Zona Selecionada
              </div>
              <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                {selectedZone.name}
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {selectedZone.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <button
          className={`nav-button ${activeTab === "map" ? "active" : ""}`}
          onClick={() => setActiveTab("map")}
        >
          <MapIcon size={24} />
          <span>Mapa</span>
        </button>
        <button
          className={`nav-button ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <LayoutList size={24} />
          <span>Info</span>
        </button>
        <button
          className={`nav-button ${activeTab === "scale" ? "active" : ""}`}
          onClick={() => setActiveTab("scale")}
        >
          <Scale size={24} />
          <span>Guia</span>
        </button>
        <button
          className={`nav-button ${activeTab === "book" ? "active" : ""}`}
          onClick={() => setActiveTab("book")}
        >
          <BookOpen size={24} />
          <span>Diário</span>
        </button>
      </div>

      {/* Guide Tab Content */}
      <div className="content-container" style={{ display: activeTab === 'scale' ? 'block' : 'none', position: 'absolute', top: '70px', zIndex: 5 }}>
        <h1 className="ios-large-title">Tamanhos Mínimos</h1>
        <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20}}>Consulte sempre a legislação em vigor. Medida da ponta do focinho à extremidade da barbatana caudal.</p>
        
        <div className="scale-item">
          <span className="scale-name">Robalo (Dicentrarchus labrax)</span>
          <span className="scale-size">36 cm</span>
        </div>
        <div className="scale-item">
          <span className="scale-name">Sargo (Diplodus sargus)</span>
          <span className="scale-size">15 cm</span>
        </div>
        <div className="scale-item">
          <span className="scale-name">Dourada (Sparus aurata)</span>
          <span className="scale-size">19 cm</span>
        </div>
        <div className="scale-item">
          <span className="scale-name">Polvo (Octopus vulgaris)</span>
          <span className="scale-size">750 g</span>
        </div>
        <div className="scale-item">
          <span className="scale-name">Choco (Sepia officinalis)</span>
          <span className="scale-size">10 cm</span>
        </div>
        <div className="scale-item">
          <span className="scale-name">Linguado (Solea solea)</span>
          <span className="scale-size">24 cm</span>
        </div>
      </div>

      {/* Logbook Tab Content */}
      <div className="content-container" style={{ display: activeTab === 'book' ? 'block' : 'none', position: 'absolute', top: '70px', zIndex: 5 }}>
        <h1 className="ios-large-title">Diário de Pesca</h1>
        <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20}}>Registe as suas capturas localmente no dispositivo.</p>
        
        <div style={{background: 'var(--bg-secondary)', padding: 16, borderRadius: 16, marginBottom: 20}}>
          <input 
            className="form-input" 
            placeholder="Espécie (ex: Robalo)" 
            value={newLog.species}
            onChange={(e) => setNewLog({...newLog, species: e.target.value})}
          />
          <input 
            className="form-input" 
            placeholder="Isco utilizado (ex: Casulo)" 
            value={newLog.bait}
            onChange={(e) => setNewLog({...newLog, bait: e.target.value})}
          />
          <textarea 
            className="form-input" 
            placeholder="Notas adicionais (estado do mar, maré, etc)" 
            rows="2"
            value={newLog.note}
            onChange={(e) => setNewLog({...newLog, note: e.target.value})}
          />
          <button className="btn-primary" onClick={handleAddLog}>
            <Plus size={18} /> Adicionar Registo
          </button>
        </div>

        <div>
          {logs.length === 0 ? (
            <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Ainda sem registos.</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="log-item">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <span className="log-date">{log.date} - {log.zone}</span>
                    <span className="log-species">{log.species}</span>
                    {log.bait && <span className="log-details" style={{display: 'block'}}>Isco: {log.bait}</span>}
                    {log.note && <span className="log-details" style={{display: 'block', fontStyle: 'italic'}}>"{log.note}"</span>}
                  </div>
                  <button 
                    onClick={() => deleteLog(log.id)}
                    style={{background: 'none', border: 'none', color: 'var(--status-bad)', cursor: 'pointer', padding: 8}}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
