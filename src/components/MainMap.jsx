import React, { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";
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
    mapCenterRequest
  } = useAppContext();

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

  const handleMapClick = (latlng) => {
    if (!isWaypointMode) return;
    
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
        {showBathymetry && (
          <TileLayer
            attribution='&copy; Esri Ocean'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
            opacity={0.7}
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
            zIndex={100}
          />
        )}

        {/* Specialized Layers */}
        {showMarineLayer && (
          <TileLayer
            attribution='&copy; OpenSeaMap'
            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
          />
        )}

        {/* Dynamic Wind Vectors */}
        {showWindVectors && <WindVectorLayer weatherData={weatherData} />}

        <MapEventsHandler isWaypointMode={isWaypointMode} onMapClick={handleMapClick} />
        
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
    </div>
  );
};

export default MainMap;
