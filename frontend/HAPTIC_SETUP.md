/**
 * Intégration optionnelle de l'haptic feedback dans Card.jsx
 * 
 * Exemple d'utilisation:
 * 
 * import hapticFeedback from '../utils/hapticFeedback';
 * 
 * const handleGenreSelect = (chosenGenre) => {
 *   if (chosenGenre === correctGenre) {
 *     hapticFeedback.success();  // Vibration succès
 *   } else {
 *     hapticFeedback.error();    // Vibration erreur
 *   }
 *   onGenreSelect(chosenGenre);
 * };
 */

// Pour utiliser l'haptic feedback, ajouter dans App.jsx:

import hapticFeedback from './utils/hapticFeedback';

// Dans handleGenreSelect:
// if (chosenGenre === genre) {
//   hapticFeedback.success();
//   setScore(prev => prev + 1);
//   const newCombo = combo + 1;
//   setCombo(newCombo);
//   hapticFeedback.combo(newCombo);
// } else {
//   hapticFeedback.error();
//   setCombo(0);
// }
