import { useState, useEffect } from "react";

export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("prompt");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada pelo navegador.");
      return;
    }

    const handleSuccess = (pos) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
      setError(null);
    };

    const handleError = (err) => {
      setError(err.message);
      if (err.code === 1) setPermissionStatus("denied");
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position, error, permissionStatus };
}
