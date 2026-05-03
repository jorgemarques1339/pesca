import { useState, useEffect } from "react";

export function useSolunar(tides) {
  const [solunarData, setSolunarData] = useState({
    moonPhase: "Unknown",
    probability: 0,
    isPeakTime: false,
  });

  useEffect(() => {
    const calculateSolunar = () => {
      const now = new Date();
      
      // 1. Calculate Moon Phase (Simplified)
      // Reference: Jan 6, 2000 was a New Moon
      const knownNewMoon = new Date("2000-01-06T18:14:00");
      const lunarCycle = 29.530588853;
      const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
      const phase = (daysSince % lunarCycle) / lunarCycle;
      
      let phaseName = "";
      let phaseFactor = 0; // 0 to 1, how "good" the phase is for fishing

      if (phase < 0.06 || phase > 0.94) {
        phaseName = "Lua Nova";
        phaseFactor = 1.0; // Excellent
      } else if (phase < 0.19) {
        phaseName = "Lua Crescente";
        phaseFactor = 0.6;
      } else if (phase < 0.31) {
        phaseName = "Quarto Crescente";
        phaseFactor = 0.8;
      } else if (phase < 0.44) {
        phaseName = "Crescente Gibosa";
        phaseFactor = 0.5;
      } else if (phase < 0.56) {
        phaseName = "Lua Cheia";
        phaseFactor = 1.0; // Excellent
      } else if (phase < 0.69) {
        phaseName = "Minguante Gibosa";
        phaseFactor = 0.5;
      } else if (phase < 0.81) {
        phaseName = "Quarto Minguante";
        phaseFactor = 0.8;
      } else {
        phaseName = "Lua Minguante";
        phaseFactor = 0.6;
      }

      // 2. Calculate Daily Solunar Peaks (Approximate)
      // Usually peaks are at Moon Rise, Moon Set, and Upper/Lower Transits.
      // We'll use a simplified hour-based probability:
      // Dawn (6-8) and Dusk (18-20) are high.
      const hour = now.getHours();
      let timeFactor = 0.4; // Base
      if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 21)) {
        timeFactor = 1.0;
      } else if ((hour >= 11 && hour <= 14) || (hour >= 23 || hour <= 2)) {
        timeFactor = 0.8;
      }

      // 3. Tide Factor (If tides are available)
      // Ideally, 2 hours before and after high tide is best.
      let tideFactor = 0.7; // Default
      // In a real app, we'd parse data.preia1 and compare with now.

      // 4. Combine into a score (0-100)
      const rawScore = (phaseFactor * 0.4 + timeFactor * 0.4 + tideFactor * 0.2) * 100;
      const finalScore = Math.min(Math.round(rawScore), 100);

      setSolunarData({
        moonPhase: phaseName,
        probability: finalScore,
        isPeakTime: timeFactor === 1.0,
      });
    };

    calculateSolunar();
    const interval = setInterval(calculateSolunar, 1000 * 60 * 15); // Update every 15 mins
    return () => clearInterval(interval);
  }, [tides]);

  return solunarData;
}
