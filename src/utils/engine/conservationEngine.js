/**
 * ConservationEngine.js - Tokenomics para a Conservação
 * Lógica "Clean-to-Earn" (Limpar para Ganhar).
 */

/**
 * Reporta lixo marinho ou redes fantasma
 * @param {Object} report - {image, location, type}
 */
export const reportDebris = async (report) => {
  console.log("Processando reporte de conservação...");

  // 1. Verificação de Imagem via IA
  const isVerified = await verifyDebrisWithAI(report.image);
  
  if (!isVerified) {
    throw new Error("A imagem não contém evidências claras de lixo marinho ou redes fantasma.");
  }

  // 2. Cálculo de Recompensa
  const rewards = calculateConservationRewards(report.type);

  return {
    status: 'verified',
    tokensEarned: rewards.tokens,
    couponCode: rewards.coupon,
    message: "Obrigado por ajudar a proteger o nosso oceano!"
  };
};

/**
 * Verificação por IA (Mock)
 */
const verifyDebrisWithAI = async (image) => {
  // Simula detecção de redes, plástico ou metal no fundo/costa
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1200);
  });
};

/**
 * Cálculo de Recompensas
 */
const calculateConservationRewards = (type) => {
  switch (type) {
    case 'ghost_net': // Redes fantasma são mais perigosas
      return { tokens: 50, coupon: 'CONSERVA-PRO-20' };
    case 'marine_litter':
      return { tokens: 10, coupon: 'ECO-PESCA-5' };
    default:
      return { tokens: 5, coupon: null };
  }
};

/**
 * Sistema de Governação (Tokens $PESCA)
 */
export const getGovernanceStats = (userId) => {
  // Retorna o poder de voto do utilizador com base no lixo removido
  return {
    votingPower: 120, // Baseado em tokens acumulados
    impactRank: 'Guardião do Mar',
    totalLitterRemovedKg: 15.5
  };
};
