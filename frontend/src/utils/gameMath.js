export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function formatTimer(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function calcWpm(correctChars, elapsedMs) {
  const minutes = elapsedMs / 60000;
  if (minutes <= 0) return 0;
  return Math.max(0, (correctChars / 5) / minutes);
}

export function calcAccuracy(correctChars, incorrectChars) {
  const total = correctChars + incorrectChars;
  if (!total) return 100;
  return (correctChars / total) * 100;
}

export function playerSpeedPercentPerSecond({ wpm, accuracy, nitroActive, mistakeSlow }) {
  const wpmFactor = clamp(wpm / 72, 0.12, 1.85);
  const accFactor = 0.55 + (accuracy / 100) * 0.55;
  const nitro = nitroActive ? 1.32 : 1;
  const penalty = mistakeSlow ? 0.68 : 1;
  return wpmFactor * accFactor * nitro * penalty;
}

export function aiBaseSpeed(difficulty) {
  if (difficulty === "easy") return 0.92;
  if (difficulty === "hard") return 1.38;
  return 1.15;
}

export function rememberTopic(difficulty, topicId) {
  const key = `typerider_recent_${difficulty}`;
  const recent = JSON.parse(sessionStorage.getItem(key) || "[]");
  const next = [topicId, ...recent.filter((id) => id !== topicId)].slice(0, 4);
  sessionStorage.setItem(key, JSON.stringify(next));
}

export function recentTopicIds(difficulty) {
  const key = `typerider_recent_${difficulty}`;
  return JSON.parse(sessionStorage.getItem(key) || "[]");
}
