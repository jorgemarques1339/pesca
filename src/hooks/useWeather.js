import { useState, useEffect } from "react";
import { fetchWindyForecast } from "../utils/windyService";

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
        // Obter dados marinhos do Open-Meteo (para Sea Temperature que a Windy Point API não fornece sempre)
        const marineRes = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=sea_surface_temperature`);
        const marineJson = await marineRes.json();
        const waterTemp = marineJson.current.sea_surface_temperature ? marineJson.current.sea_surface_temperature.toFixed(1) : "-";

        // Tentativa 1: Windy API (Alta Precisão para Vento e Ar)
        try {
          const windyData = await fetchWindyForecast(lat, lon);
          setWeatherData({
            loading: false,
            data: {
              temp: windyData.temp,
              windKnots: windyData.windSpeed,
              windDir: getWindCardinal(windyData.windDir),
              windDirDeg: windyData.windDir,
              waveHeight: windyData.waveHeight,
              waterTemp: waterTemp, // Usamos o do Open-Meteo ou Windy se disponível
              source: 'Windy'
            },
            error: null
          });
          return; 
        } catch (windyErr) {
          console.warn("Windy API falhou, a usar Open-Meteo total...");
        }

        // Tentativa 2: Open-Meteo Total (Fallback)
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m`);

        if (!weatherRes.ok || !marineRes.ok) {
          throw new Error("Erro na resposta das APIs meteorológicas");
        }

        const weatherJson = await weatherRes.json();
        // marineJson já foi declarado e preenchido acima

        const windKnots = Math.round(weatherJson.current.wind_speed_10m * 0.539957);
        const windDir = getWindCardinal(weatherJson.current.wind_direction_10m);

        setWeatherData({
          loading: false,
          data: {
            temp: Math.round(weatherJson.current.temperature_2m),
            windKnots,
            windDir,
            windDirDeg: weatherJson.current.wind_direction_10m,
            waveHeight: marineJson.current.wave_height ? marineJson.current.wave_height.toFixed(1) : "-",
            waterTemp: marineJson.current.sea_surface_temperature ? marineJson.current.sea_surface_temperature.toFixed(1) : "-",
            source: 'Open-Meteo'
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
