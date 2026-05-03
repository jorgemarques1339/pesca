import { useState, useEffect } from "react";

export function useOrientation() {
  const [heading, setHeading] = useState(0);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const handleOrientation = (e) => {
      let compass = e.webkitCompassHeading || (360 - e.alpha);
      if (compass) {
        setHeading(Math.round(compass));
      }
    };

    if (window.DeviceOrientationEvent) {
      setIsSupported(true);
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        return permission === 'granted';
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    return true; // Already granted or not required (Android)
  };

  return { heading, isSupported, requestPermission };
}
