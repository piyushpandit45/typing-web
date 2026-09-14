// Centralized WPM requirement configuration
// Used for determining win/loss based on difficulty

export const WPM_REQUIREMENTS = {
  easy: 25,
  medium: 40,
  hard: 60,
};

export const getRequiredWpm = (difficulty) => {
  return WPM_REQUIREMENTS[difficulty] || 0;
};

export const determineWinLoss = (wpm, difficulty) => {
  const required = getRequiredWpm(difficulty);
  return wpm >= required ? "win" : "loss";
};
