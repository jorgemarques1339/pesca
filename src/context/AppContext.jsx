import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTides } from '../hooks/useTides';
import { useWeather } from '../hooks/useWeather';
import { useSolunar } from '../hooks/useSolunar';
import { useGeolocation } from '../hooks/useGeolocation';
import { useOrientation } from '../hooks/useOrientation';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState('map');
  const [selectedZone, setSelectedZone] = useState(null);
  
  // Map Layers & UI State
  const [isWaypointMode, setIsWaypointMode] = useState(false);
  const [showMarineLayer, setShowMarineLayer] = useState(false);
  const [showBathymetry, setShowBathymetry] = useState(false);
  const [showWindVectors, setShowWindVectors] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [showCommunityLayer, setShowCommunityLayer] = useState(false);
  const [showShops, setShowShops] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shopsData, setShopsData] = useState([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [navTarget, setNavTarget] = useState(null);

  // Persistence: Waypoints
  const [waypoints, setWaypoints] = useState(() => {
    const saved = localStorage.getItem("fishing_waypoints");
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence: Logs
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

  const handleAddWaypoint = (wp) => {
    const updated = [...waypoints, wp];
    setWaypoints(updated);
    localStorage.setItem("fishing_waypoints", JSON.stringify(updated));
  };

  const handleRemoveWaypoint = (id) => {
    const updated = waypoints.filter(w => w.id !== id);
    setWaypoints(updated);
    localStorage.setItem("fishing_waypoints", JSON.stringify(updated));
    if (navTarget?.id === id) setNavTarget(null);
  };

  // Sensor Data & External APIs
  const { position: userPos } = useGeolocation();
  const { heading, requestPermission: requestOrientationPermission } = useOrientation();
  const tides = useTides();
  const solunarData = useSolunar(tides);

  // Weather depends on location
  const weatherLat = selectedZone ? selectedZone.coordinates[0][0] : (userPos ? userPos.lat : 39.5);
  const weatherLon = selectedZone ? selectedZone.coordinates[0][1] : (userPos ? userPos.lng : -8.0);
  const weatherData = useWeather(weatherLat, weatherLon);

  const [mapCenterRequest, setMapCenterRequest] = useState(null);

  const requestCenterMap = (zoomArg = 13) => {
    if (userPos) {
      // If zoomArg is an event object (from onClick), use default 13
      const zoom = typeof zoomArg === 'number' ? zoomArg : 13;
      setMapCenterRequest({ lat: userPos.lat, lng: userPos.lng, zoom, timestamp: Date.now() });
    } else {
      alert("Geolocalização não disponível.");
    }
  };

  const fetchShops = async (lat, lon) => {
    setIsLoadingShops(true);
    try {
      // Expanded query: nwr finds Nodes, Ways, and Relations. 
      // Includes more tags and out center for polygon centers.
      const query = `[out:json];(nwr["shop"~"fishing|tackle|fishing_tackle"](around:20000,${lat},${lon});nwr["shop"~"sports|outdoors|wholesale"]["name"~"pesca",i](around:20000,${lat},${lon}););out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PescaApp/1.0 (contact: info@pesca.pt)'
        }
      });
      const data = await response.json();
      
      if (!data.elements) {
        setShopsData([]);
        return;
      }

      const formattedShops = data.elements.map(el => {
        const lat = el.lat || (el.center && el.center.lat);
        const lon = el.lon || (el.center && el.center.lon);
        
        return {
          id: el.id,
          name: el.tags?.name || "Loja de Pesca",
          lat,
          lng: lon,
          type: 'shop',
          address: el.tags?.['addr:street'] ? `${el.tags['addr:street']}${el.tags['addr:housenumber'] ? ', ' + el.tags['addr:housenumber'] : ''}` : (el.tags?.operator || "Endereço não disponível"),
          phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
          website: el.tags?.website || el.tags?.['contact:website'] || null
        };
      }).filter(shop => shop.lat && shop.lng); // Ensure we have coordinates
      
      if (formattedShops.length === 0) {
        alert("Não foram encontradas lojas de pesca num raio de 20 km da sua localização.");
      }
      
      setShopsData(formattedShops);
      setShowShops(true);
      requestCenterMap(15);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setIsLoadingShops(false);
    }
  };

  const value = {
    activeTab, setActiveTab,
    selectedZone, setSelectedZone,
    isWaypointMode, setIsWaypointMode,
    showMarineLayer, setShowMarineLayer,
    showBathymetry, setShowBathymetry,
    showWindVectors, setShowWindVectors,
    showRadar, setShowRadar,
    showCommunityLayer, setShowCommunityLayer,
    showShops, setShowShops,
    isOfflineModalOpen, setIsOfflineModalOpen,
    isSearchOpen, setIsSearchOpen,
    navTarget, setNavTarget,
    waypoints, handleAddWaypoint, handleRemoveWaypoint,
    logs, handleAddLog, handleDeleteLog,
    userPos, heading, requestOrientationPermission,
    tides, solunarData, weatherData,
    mapCenterRequest, setMapCenterRequest, requestCenterMap,
    shopsData, isLoadingShops, fetchShops
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
