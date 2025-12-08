/**
 * Touch Optimization Hook
 * Améliore l'expérience tactile sur mobile
 */

import { useEffect } from 'react';

export function useTouchOptimization() {
  useEffect(() => {
    // Désactiver le zoom double-tap (améliore la performance)
    const handleTouchStart = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const handleGestureStart = (e) => {
      e.preventDefault();
    };

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('gesturestart', handleGestureStart, false);

    // Ajouter preventDefault sur zoom pinch
    let lastTouchEnd = 0;
    const handleTouchEnd = (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', handleTouchEnd, false);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart, false);
      document.removeEventListener('gesturestart', handleGestureStart, false);
      document.removeEventListener('touchend', handleTouchEnd, false);
    };
  }, []);
}

/**
 * Utilisation dans App.jsx:
 * 
 * import { useTouchOptimization } from './hooks/useTouchOptimization';
 * 
 * function App() {
 *   useTouchOptimization();
 *   
 *   // ... rest du code
 * }
 */
