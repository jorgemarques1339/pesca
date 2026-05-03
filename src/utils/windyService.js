/**
 * WindyService.js
 * Interface para a Windy Point Forecast API v2.
 * Fornece dados meteorológicos de alta precisão (ECMWF, GFS, ICON).
 */

const WINDY_API_KEY = 'Yx4C58LSg9EW5MMLjLmpjaoXKDWBWwJA'; 
const BASE_URL = 'https://api.windy.com/api/point-forecast/v2';

/**
 * Obtém a previsão pontual completa via Windy
 * @param {Number} lat 
 * @param {Number} lon 
 * @param {Array} parameters - Parâmetros desejados
 */
export const fetchWindyForecast = async (lat, lon, parameters = ['temp', 'wind', 'windGust', 'waves', 'windDir']) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat,
        lon,
        model: 'iconEu', // Modelo de alta precisão para a Europa (ECMWF não disponível em Point API)
        parameters,
        levels: ['surface'],
        key: WINDY_API_KEY
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro Windy API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return processWindyData(data);
  } catch (error) {
    console.error("Erro ao contactar Windy:", error);
    throw error;
  }
};

const processWindyData = (rawData) => {
  // Helper para buscar parâmetro com ou sem sufixo -surface
  const getParam = (name) => rawData[`${name}-surface`] || rawData[name];

  const rawTemp = getParam('temp')?.[0];
  const rawWind = getParam('wind')?.[0];
  const rawWindDir = getParam('windDir')?.[0];
  const rawWaves = getParam('waves')?.[0];

  return {
    temp: rawTemp ? Math.round(rawTemp - 273.15) : 0, 
    windSpeed: rawWind ? Math.round(rawWind * 1.94384) : 0, 
    windDir: rawWindDir || 0,
    seaTemp: "-", 
    waveHeight: rawWaves ? rawWaves.toFixed(1) : "-",
    source: 'Windy (ICON-EU)'
  };
};
