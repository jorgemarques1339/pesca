import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTides } from '../hooks/useTides';
import { useWeather } from '../hooks/useWeather';
import { useSolunar } from '../hooks/useSolunar';
import { useGeolocation } from '../hooks/useGeolocation';
import { useOrientation } from '../hooks/useOrientation';

const AppContext = createContext();

const FEATURED_SHOPS = [
  {
    id: 'featured_favais',
    name: "Casa Favais, Lda. - Vila do Conde",
    lat: 41.3720683,
    lng: -8.7614646,
    type: 'shop',
    address: "Vila do Conde",
    phone: "+351 252 631 384",
    website: "https://www.casafavais.pt/",
    isFeatured: true
  },
  {
    id: 'featured_castanho',
    name: "Castanho e Castanho - Vila do Conde",
    lat: 41.3660863,
    lng: -8.7600506,
    type: 'shop',
    address: "Vila do Conde",
    phone: "+351 252 642 164",
    isFeatured: true
  },
  {
    id: 'featured_decathlon_matosinhos',
    name: "Decathlon Matosinhos",
    lat: 41.2158568,
    lng: -8.6857626,
    type: 'shop',
    address: "Matosinhos",
    phone: "+351 211 144 000",
    website: "https://www.decathlon.pt/",
    isFeatured: true
  }
];

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

  // Authentication & User Profile
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("pesca_user");
    return saved ? JSON.parse(saved) : {
      isLoggedIn: true, // Default to true as per user request to "add my login now"
      email: "jorgemarques1339@gmail.com",
      name: "Jorge Marques",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jorge",
      bio: "Pescador das Caxinas, amante do mar e da pesca desportiva.",
      stats: {
        catches: 42,
        medals: 15,
        tournaments: 3
      }
    };
  });

  const handleLogin = (email, password) => {
    // Simple mock logic
    if (email === "jorgemarques1339@gmail.com" && password === "Cax1nasCity") {
      const userData = {
        isLoggedIn: true,
        email: email,
        name: "Jorge Marques",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jorge",
        bio: "Pescador das Caxinas, amante do mar e da pesca desportiva.",
        stats: { catches: 42, medals: 15, tournaments: 3 }
      };
      setUser(userData);
      localStorage.setItem("pesca_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false });
    localStorage.removeItem("pesca_user");
  };

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
    setShowShops(true); // Show the layer (it will show loading on map if we implement it)
    try {
      console.log(`[ShopSearch] Inciando busca num raio de 30km em: ${lat}, ${lon}`);
      
      // Broader query: fishing shops, tackle shops, or any shop with "pesca" in the name
      const query = `[out:json][timeout:20];(nwr["shop"~"fishing|tackle"](around:30000,${lat},${lon});nwr["shop"]["name"~"pesca",i](around:30000,${lat},${lon});nwr["shop"~"sports|outdoors|hardware"]["fishing"~"yes"](around:30000,${lat},${lon}););out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); 

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log(`[ShopSearch] Recebidos ${data.elements?.length || 0} elementos da API.`);
      
      if (!data.elements || data.elements.length === 0) {
        setShopsData([]);
        alert("Não foram encontradas lojas de pesca num raio de 30 km da sua localização. Tente novamente numa zona diferente.");
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
      
      // Merge with featured shops that are within range (optional, or just always show them if nearby)
      // For now, let's always include them if they are in the results area or just add them to the list
      const finalShops = [...FEATURED_SHOPS, ...formattedShops.filter(fs => !FEATURED_SHOPS.some(s => s.name === fs.name))];
      
      setShopsData(finalShops);
      requestCenterMap(14);
    } catch (error) {
      console.error("Error fetching shops:", error);
      alert("Erro ao procurar lojas. Verifique a sua ligação à internet.");
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
    shopsData, isLoadingShops, fetchShops,
    user, handleLogin, handleLogout
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
