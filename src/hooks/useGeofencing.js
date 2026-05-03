import { useEffect } from 'react';
import { ZONES } from '../constants/zones';
import { isPointInPolygon } from '../utils/geoUtils';
import { useAppContext } from '../context/AppContext';

export const useGeofencing = () => {
  const { userPos } = useAppContext();

  useEffect(() => {
    if (!userPos) return;

    const forbiddenZones = ZONES.filter(z => z.type === "forbidden");
    const currentZone = forbiddenZones.find(z => 
      isPointInPolygon([userPos.lat, userPos.lng], z.coordinates)
    );
    
    if (currentZone) {
      // Speech Alert
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(
          `Atenção: Entrou em zona de pesca proibida: ${currentZone.name}`
        );
        msg.lang = 'pt-PT';
        window.speechSynthesis.speak(msg);
      }
      
      // Visual Alert (Using alert for now, could be a custom modal)
      alert(`ALERTA: Está dentro de uma ZONA PROIBIDA (${currentZone.name})!`);
    }
  }, [userPos]);
};
