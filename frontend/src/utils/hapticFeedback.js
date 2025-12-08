/**
 * Haptic Feedback Utilities for Mobile
 * Fourni une rétroaction haptique sur les appareils supportés
 */

export const hapticFeedback = {
  // Léger (feedback léger pour interaction)
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  // Medium (feedback modéré pour sélection)
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  // Fort (feedback fort pour succès/erreur)
  strong: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
  },

  // Pattern succès (vibration distinctive)
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 30, 30]);
    }
  },

  // Pattern erreur (vibration distinctive)
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  },

  // Pattern combo (vibration montante)
  combo: (comboCount) => {
    if ('vibrate' in navigator) {
      const pattern = [];
      for (let i = 0; i < Math.min(comboCount, 5); i++) {
        pattern.push(20 + i * 10);
        pattern.push(15);
      }
      navigator.vibrate(pattern);
    }
  },
};

export default hapticFeedback;
