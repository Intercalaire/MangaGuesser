// Renvoie la classe d'animation (correct / wrong)
export function getFeedbackClass(hasAnswered, isCorrect) {
  if (!hasAnswered) return '';
  return isCorrect ? 'feedback-animate-correct' : 'feedback-animate-wrong';
}
