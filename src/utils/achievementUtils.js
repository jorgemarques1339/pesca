export const ACHIEVEMENTS = [
  { id: 'first_blood', name: "Primeiro Sangue", description: "Fez a sua primeira captura registada", icon: "🩸", criteria: (logs) => logs.length >= 1 },
  { id: 'robalo_master', name: "Mestre do Robalo", description: "Capturou 3 Robalos", icon: "🐟", criteria: (logs) => logs.filter(l => l.species.toLowerCase().includes('robalo')).length >= 3 },
  { id: 'night_owl', name: "Coruja do Mar", description: "Capturou um peixe durante a noite", icon: "🦉", criteria: (logs) => logs.some(l => {
    const hour = parseInt(l.id.toString().slice(-6)); // Mocking time check from ID for demo
    return hour < 6 || hour > 21;
  })},
  { id: 'explorer', name: "Explorador da Costa", description: "Pescou em 3 zonas diferentes", icon: "🗺️", criteria: (logs) => new Set(logs.map(l => l.zone)).size >= 3 },
  { id: 'heavyweight', name: "Peso Pesado", description: "Registou uma captura com mais de 2kg", icon: "⚖️", criteria: (logs) => logs.some(l => l.note && l.note.includes('kg') && parseFloat(l.note) > 2) },
];

export function getUnlockedAchievements(logs) {
  return ACHIEVEMENTS.filter(ach => ach.criteria(logs));
}
