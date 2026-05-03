/**
 * LureOracle.js - O Oráculo da "Caixa de Amostras"
 * Sugere a amostra ideal com base na turbidez e condições de luz.
 */

/**
 * Analisa turbidez da água via satélite (Sentinel-2 / Copernicus)
 * @param {Number} lat 
 * @param {Number} lon 
 * @returns {Number} Turbidity Index (0: Cristalina, 1: Muito Turva)
 */
export const getWaterTurbidity = async (lat, lon) => {
  // Simulação de análise de reflectância de clorofila/sedimentos
  return 0.65; // Água ligeiramente tapada (Ideal para cores vibrantes)
};

/**
 * Motor de Recomendação de Amostras
 * @param {Array} userInventory - Lista de amostras do utilizador
 * @param {Object} conditions - {turbidity, light, depth}
 */
export const recommendLure = (userInventory, conditions) => {
  const { turbidity, light, depth } = conditions;

  return userInventory.map(lure => {
    let score = 50;

    // Lógica de Cor vs Turbidez
    if (turbidity > 0.6) {
      // Águas turvas: cores UV, Chartreuse, Brancas ou Laranjas
      if (['chartreuse', 'orange', 'white', 'uv'].includes(lure.color.toLowerCase())) score += 30;
      if (lure.vibration === 'high') score += 15; // Mais vibração em água turva
    } else {
      // Águas limpas: cores naturais (Nayu, Ghost, Prateados)
      if (['natural', 'silver', 'blue', 'transparent'].includes(lure.color.toLowerCase())) score += 30;
      if (lure.vibration === 'low') score += 10;
    }

    // Lógica de Luz
    if (light === 'low' && lure.isGlow) score += 20;

    return { ...lure, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * "Magic Suggestion" - A recomendação final do Oráculo
 */
export const getOracleSuggestion = async (lat, lon, inventory) => {
  const turbidity = await getWaterTurbidity(lat, lon);
  const hour = new Date().getHours();
  const light = (hour < 7 || hour > 19) ? 'low' : 'bright';

  const recommendations = recommendLure(inventory, {
    turbidity,
    light,
    depth: 5 // Default coastal depth
  });

  return {
    topPick: recommendations[0],
    reason: turbidity > 0.6 
      ? "Água com visibilidade reduzida detetada. Recomenda-se cores de forte contraste e alta vibração."
      : "Águas cristalinas. Opte por padrões naturais e apresentações subtis.",
    turbidity
  };
};
