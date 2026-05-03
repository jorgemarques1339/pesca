import { useState, useEffect } from "react";

export function useWeather(lat, lon) {
  const [weatherData, setWeatherData] = useState({
    loading: true,
    data: null,
    error: null,
  });

  const getWindCardinal = (degrees) => {
    const val = Math.floor((degrees / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherData((prev) => ({ ...prev, loading: true, error: null }));
      
      try {
        const [weatherRes, marineRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m`),
          fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,sea_surface_temperature`)
        ]);

        if (!weatherRes.ok || !marineRes.ok) {
          throw new Error("Erro na resposta das APIs meteorológicas");
        }

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
        console.error("Weather fetch error:", err);
        setWeatherData({ 
          loading: false, 
          data: null, 
          error: "Erro ao carregar meteorologia" 
        });
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return weatherData;
}
