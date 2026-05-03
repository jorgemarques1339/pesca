import { useState, useEffect } from 'react';

/**
 * Hook useARNavigation
 * Gere a orientação do dispositivo e a sincronização com dados batimétricos.
 */
export const useARNavigation = () => {
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [location, setLocation] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Escuta o Giroscópio / Device Orientation
    const handleOrientation = (event) => {
      setOrientation({
        alpha: event.alpha, // Bússola (0-360)
        beta: event.beta,   // Inclinação frontal
        gamma: event.gamma  // Inclinação lateral
      });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      setIsSupported(false);
    }

    // Monitoriza Localização
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setLocation(pos.coords),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  /**
   * Projeta coordenadas mundiais para o viewport do ecrã
   */
  const projectToAR = (lat, lon, depth) => {
    // Lógica de projeção 3D simplificada
    // No futuro, usar Three.js para projeção matricial real
    return {
      x: (lon - (location?.longitude || 0)) * 10000,
      y: (lat - (location?.latitude || 0)) * 10000,
      z: -depth
    };
  };

  return { orientation, location, isSupported, projectToAR };
};
