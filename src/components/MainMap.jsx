import React, { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";
import { MapPin, Loader2, Store, Info, Waves as WavesIcon, Wind as WindIcon, Thermometer } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import MapEventsHandler from './MapEventsHandler';
import ZonePolygons from './ZonePolygons';
import MapWaypoints from './MapWaypoints';
import TideMarkers from './TideMarkers';
import CommunityMarkers from './CommunityMarkers';
import WindVectorLayer from './WindVectorLayer';

// Component to track map center and display coordinates
const CoordinatesIndicator = () => {
  const [coords, setCoords] = useState({ lat: 39.5, lng: -8.0 });
  const map = useMapEvents({
    move: () => {
      const center = map.getCenter();
      setCoords({ lat: center.lat, lng: center.lng });
    }
  });

  return (
    <div className="coords-indicator-pill">
      <div className="coords-row">
        <span className="coords-label">LAT</span>
        <span className="coords-value">{coords.lat.toFixed(6)}</span>
      </div>
      <div className="coords-divider"></div>
      <div className="coords-row">
        <span className="coords-label">LNG</span>
        <span className="coords-value">{coords.lng.toFixed(6)}</span>
      </div>
    </div>
  );
};

const MainMap = () => {
  const mapRef = useRef(null);
  const { 
    userPos, 
    isWaypointMode, 
    setIsWaypointMode,
    showMarineLayer, 
    showBathymetry,
    showWindVectors,
    showRadar,
    showCommunityLayer,
    showShops,
    waypoints,
    handleRemoveWaypoint,
    setNavTarget,
    requestOrientationPermission,
    setSelectedZone,
    tides,
    weatherData,
    handleAddWaypoint,
    mapCenterRequest,
    isLoadingShops,
    setActiveTab
  } = useAppContext();

  const [clickedPos, setClickedPos] = useState(null);
  const [localWeather, setLocalWeather] = useState(null);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  // Radar timestamp (RainViewer uses current time in 10min intervals)
  const [radarTime, setRadarTime] = useState(null);

  useEffect(() => {
    // Get the latest available radar frame from RainViewer API
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(res => res.json())
      .then(data => {
        if (data.radar && data.radar.past) {
          const latest = data.radar.past[data.radar.past.length - 1];
          setRadarTime(latest.time);
        }
      });
  }, [showRadar]);

  useEffect(() => {
    if (mapCenterRequest && mapRef.current) {
      mapRef.current.setView([mapCenterRequest.lat, mapCenterRequest.lng], mapCenterRequest.zoom);
    }
  }, [mapCenterRequest]);

  const handleMapClick = async (latlng) => {
    if (isWaypointMode) {
      const name = prompt("Nome do Pesqueiro / Waypoint:");
      if (name) {
        handleAddWaypoint({
          id: Date.now(),
          name,
          lat: latlng.lat,
          lng: latlng.lng,
        });
      }
      setIsWaypointMode(false);
    } else {
      // Local Forecast Tooltip
      setClickedPos(latlng);
      setIsLoadingLocal(true);
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latlng.lat}&longitude=${latlng.lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m`);
        const data = await res.json();
        setLocalWeather({
          temp: data.current.temperature_2m,
          wind: Math.round(data.current.wind_speed_10m * 0.54) // knots
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingLocal(false);
      }
    }
  };

  const center = [39.5, -8.0];

  return (
    <div className="map-container" style={{ cursor: isWaypointMode ? 'crosshair' : 'grab' }}>
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        ref={mapRef}
      >
        {/* Base Layers */}
        <TileLayer
          attribution='&copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        {/* Bathymetry (Depth) Layer */}
        {/* Bathymetry (Depth) Layer - EMODnet High Res for Europe */}
        {showBathymetry && (
          <TileLayer
            attribution='&copy; EMODnet Bathymetry'
            url="https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{z}/{x}/{y}.png"
            opacity={0.8}
            zIndex={10}
          />
        )}

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Radar de Precipitação (RainViewer) */}
        {showRadar && radarTime && (
          <TileLayer
            attribution='&copy; RainViewer'
            url={`https://tilecache.rainviewer.com/v2/radar/${radarTime}/256/{z}/{x}/{y}/2/1_1.png`}
            opacity={0.6}
            zIndex={200}
          />
        )}

        {/* Specialized Layers */}
        {showMarineLayer && (
          <TileLayer
            attribution='&copy; OpenSeaMap'
            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
            zIndex={300}
          />
        )}

        {/* Dynamic Wind Vectors */}
        {showWindVectors && <WindVectorLayer weatherData={weatherData} />}

        <MapEventsHandler isWaypointMode={isWaypointMode} onMapClick={handleMapClick} />
        
        {/* Local Forecast Popup */}
        {clickedPos && (
          <Popup position={clickedPos} onClose={() => setClickedPos(null)}>
            <div className="local-forecast-popup" style={{ minWidth: '120px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                <Target size={14} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Previsão Local</span>
              </div>
              
              {isLoadingLocal ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                  <Loader2 size={14} className="animate-spin" />
                  <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>A calcular...</span>
                </div>
              ) : localWeather && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.5rem', opacity: 0.5, fontWeight: 800 }}>AR</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{localWeather.temp}°</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.5rem', opacity: 0.5, fontWeight: 800 }}>VENTO</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{localWeather.wind}<span style={{ fontSize: '0.6rem', marginLeft: '2px' }}>kn</span></div>
                  </div>
                </div>
              )}
            </div>
          </Popup>
        )}
        
        <CoordinatesIndicator />

        <TideMarkers tides={tides} />

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

        <ZonePolygons 
          isWaypointMode={isWaypointMode} 
          onZoneClick={setSelectedZone} 
        />

        <CommunityMarkers visible={showCommunityLayer} showShops={showShops} />

        <MapWaypoints 
          waypoints={waypoints} 
          onRemoveWaypoint={handleRemoveWaypoint}
          onNavigateTo={async (wp) => {
            await requestOrientationPermission();
            setNavTarget(wp);
          }}
        />
      </MapContainer>

      {/* Map Legend (Bottom Left) */}
      {(showBathymetry || showWindVectors) && (
        <div className="map-legend-container">
          <div className="glass-panel p-12">
            <div className="flex-center gap-8 mb-8">
              <Info size={14} className="text-cyan" />
              <span className="text-2xs font-bold uppercase">Legenda</span>
            </div>
            {showBathymetry && (
              <div className="legend-item">
                <div className="color-scale bathy-scale"></div>
                <div className="flex-between text-3xs mt-4">
                  <span>0m</span>
                  <span>-100m</span>
                  <span>-500m+</span>
                </div>
              </div>
            )}
            {showWindVectors && (
              <div className="legend-item mt-8">
                <div className="flex-center gap-4 text-3xs opacity-70">
                  <WindIcon size={10} />
                  <span>Intensidade do Vento</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tide Status Widget (Top Right below Weather) */}
      {tides.data && (
        <div className="map-tide-status">
          <div className="glass-capsule tide-capsule">
            <WavesIcon size={14} className="text-blue" />
            <span className="text-2xs font-bold">{tides.data.height.toFixed(1)}m</span>
            <div className="tide-direction">
              {tides.data.isRising ? <ChevronRight size={14} className="rotate-270 text-green" /> : <ChevronRight size={14} className="rotate-90 text-orange" />}
            </div>
          </div>
        </div>
      )}

      {/* Tide Status Widget (Top Right below Weather) */}
      {tides.data && (
        <div className="map-tide-status">
          <div className="glass-capsule tide-capsule">
            <WavesIcon size={14} className="text-blue" />
            <span className="text-2xs font-bold">{tides.data.height.toFixed(1)}m</span>
            <div className="tide-direction">
              {tides.data.isRising ? <ChevronRight size={14} style={{ transform: 'rotate(-90deg)', color: 'var(--status-good)' }} /> : <ChevronRight size={14} style={{ transform: 'rotate(90deg)', color: 'var(--status-warning)' }} />}
            </div>
          </div>
        </div>
      )}

      {/* Shop Loading Indicator */}
      {isLoadingShops && (
        <div className="map-loading-overlay">
          <div className="glass-capsule loading-capsule">
            <Loader2 className="animate-spin" size={16} />
            <span>Procurando lojas próximas...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMap;
