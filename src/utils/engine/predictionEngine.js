/**
 * PredictionEngine.js - "O Cérebro"
 * Motor Preditivo Hiper-Local para Pesca Lúdica.
 * Cruza dados de múltiplas fontes (Copernicus, IPMA, NOAA) e utiliza ML para gerar o IPC.
 */

const API_CONFIG = {
  IPMA_BASE: 'https://api.ipma.pt/open-data',
  COPERNICUS_STUB: 'https://marine.copernicus.eu/api/v1', // Placeholder para integração backend
};

/**
 * Calcula o Índice de Probabilidade de Captura (IPC)
 * @param {Object} params - Coordenadas, Espécie, Condições Atuais
 * @returns {Number} IPC de 0 a 100
 */
export const calculateIPC = (species, environmentalData) => {
  const { temperature, swell, wind, moonPhase, turbidity } = environmentalData;
  
  // Lógica de ML (Simulada com pesos ponderados)
  // No futuro, isto seria uma chamada a um modelo TensorFlow.js ou API de inferência
  let score = 50; // Base neutra

  // Fator Temperatura (Cada espécie tem seu range ideal)
  const idealTemp = species === 'Robalo' ? 16 : 22;
  const tempDiff = Math.abs(temperature - idealTemp);
  score += tempDiff < 2 ? 20 : (tempDiff < 5 ? 5 : -10);

  // Fator Ondulação (Swell)
  if (swell > 0.5 && swell < 2.0) score += 15;
  else if (swell >= 2.0) score -= 10;

  // Fator Fase Lunar (Lua Cheia/Nova costumam ser melhores para certas espécies)
  if (moonPhase === 'New Moon' || moonPhase === 'Full Moon') score += 10;

  // Fator Turbidez (Água "tapada" é boa para certas amostras)
  if (turbidity > 0.7) score += 5;

  return Math.min(Math.max(score, 0), 100);
};

/**
 * Obtém dados do IPMA para Ondulação e Vento
 * @param {Number} lat 
 * @param {Number} lon 
 */
export const fetchIPMAData = async (lat, lon) => {
  try {
    // Exemplo de integração com API IPMA (Marítima)
    // Nota: O IPMA fornece dados por estações ou grelha
    const response = await fetch(`${API_CONFIG.IPMA_BASE}/forecast/meteorology/marine/1010500.json`); // Exemplo ID
    const data = await response.json();
    
    return {
      swell: data.data[0].waveHeight || 1.2,
      wind: data.data[0].windSpeed || 15,
      period: data.data[0].wavePeriod || 8
    };
  } catch (error) {
    console.error("Erro ao obter dados do IPMA:", error);
    return { swell: 1.0, wind: 10, period: 7 }; // Fallback
  }
};

/**
 * Obtém Temperatura do Mar via Copernicus (Simulado)
 */
export const fetchCopernicusSeaTemp = async (lat, lon) => {
  // Simulação de acesso via WMS/S3 ou proxy backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(17.5); // Temperatura média na costa PT
    }, 500);
  });
};

/**
 * Agregador Hiper-Local
 */
export const getHyperLocalForecast = async (lat, lon, species = 'Robalo') => {
  const ipma = await fetchIPMAData(lat, lon);
  const temp = await fetchCopernicusSeaTemp(lat, lon);
  
  const envData = {
    temperature: temp,
    swell: ipma.swell,
    wind: ipma.wind,
    moonPhase: 'Full Moon', // Seria calculado via lib solunar
    turbidity: 0.4
  };

  const ipc = calculateIPC(species, envData);

  return {
    ipc,
    envData,
    location: { lat, lon },
    timestamp: new Date().toISOString()
  };
};
