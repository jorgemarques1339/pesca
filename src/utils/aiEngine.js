/**
 * AIEngine.js
 * Motor de Inteligência Artificial para identificação de peixes e validação legal.
 */

export const FISH_DATABASE = [
  { id: 'robalo', name: "Robalo-europeu", scientific: "Dicentrarchus labrax", minSize: 36, unit: "cm", confidence: 0.98, rarity: "comum" },
  { id: 'sargo', name: "Sargo", scientific: "Diplodus sargus", minSize: 15, unit: "cm", confidence: 0.95, rarity: "comum" },
  { id: 'dourada', name: "Dourada", scientific: "Sparus aurata", minSize: 19, unit: "cm", confidence: 0.97, rarity: "comum" },
  { id: 'corvina', name: "Corvina-legítima", scientific: "Argyrosomus regius", minSize: 42, unit: "cm", confidence: 0.92, rarity: "médio" },
  { id: 'choco', name: "Choco", scientific: "Sepia officinalis", minSize: 10, unit: "cm", confidence: 0.99, rarity: "comum" },
  { id: 'polvo', name: "Polvo", scientific: "Octopus vulgaris", minSize: 750, unit: "g", confidence: 0.96, rarity: "comum" },
  { id: 'besugo', name: "Besugo", scientific: "Pagellus acarne", minSize: 12, unit: "cm", confidence: 0.91, rarity: "comum" },
  { id: 'salmonete', name: "Salmonete", scientific: "Mullus surmuletus", minSize: 15, unit: "cm", confidence: 0.89, rarity: "médio" }
];

/**
 * Simula a análise de imagem e retorna um diagnóstico
 */
export const analyzeFishImage = async (imageData) => {
  // Simula latência de processamento neuronal
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Escolhe um peixe aleatório da base de dados para simular a deteção
  const detectedFish = FISH_DATABASE[Math.floor(Math.random() * FISH_DATABASE.length)];
  
  // Gera uma medida simulada próxima do tamanho mínimo (para testar lógica legal)
  const isLegal = Math.random() > 0.3;
  const estimatedSize = isLegal 
    ? detectedFish.minSize + Math.floor(Math.random() * 15)
    : detectedFish.minSize - Math.floor(Math.random() * 5 + 1);

  return {
    ...detectedFish,
    estimatedSize,
    isLegal,
    analysisMetadata: {
      probability: (detectedFish.confidence * 100).toFixed(1),
      biometrics: {
        length: estimatedSize,
        scaleHealth: "Excelente",
        finCondition: "Intacta"
      },
      recommendation: isLegal 
        ? "Espécime pode ser retido dentro dos limites diários."
        : "ATENÇÃO: Libertação obrigatória! Abaixo do tamanho mínimo legal."
    }
  };
};

/**
 * Retorna as regras de pesca baseadas na espécie
 */
export const getSpeciesRules = (fishId) => {
  const fish = FISH_DATABASE.find(f => f.id === fishId);
  if (!fish) return null;

  return {
    name: fish.name,
    minSize: `${fish.minSize}${fish.unit}`,
    dailyLimit: "Varia por zona (verificar regulamento local)"
  };
};
