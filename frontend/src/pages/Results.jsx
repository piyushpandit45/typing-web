import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { getRequiredWpm } from "../utils/wpmRequirements";

export default function Results() {
  const navigate = useNavigate();
  const result = useMemo(() => JSON.parse(sessionStorage.getItem("typerider_result") || "null"), []);

  if (!result) {
    return (
      <main className="page">
        <div className="empty">No race result found.</div>
        <Link className="btn btn-primary" to="/play">
          Start a race
        </Link>
      </main>
    );
  }

  const requiredWpm = result.requiredWpm || getRequiredWpm(result.difficulty);
  const headline =
    result.result === "win" ? "🏆 YOU WIN" : result.result === "loss" ? "Close. You lost this one." : "It's a draw";

  return (
    <main className="page">
      <motion.div className="card" style={{ padding: 28 }} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="tagline">{headline}</div>
        <h1 className="h2">{result.playerName}</h1>
        <p className="muted">
          {result.country} · {result.difficulty.toUpperCase()} · {result.topicName}
        </p>
        <div className="stats-grid" style={{ marginTop: 18 }}>
          <div className="card stat">
            <span>Difficulty</span>
            <b>{result.difficulty.toUpperCase()}</b>
          </div>
          <div className="card stat">
            <span>Your WPM</span>
            <b>{result.wpm}</b>
          </div>
          <div className="card stat">
            <span>Required WPM</span>
            <b>{requiredWpm}</b>
          </div>
          <div className="card stat">
            <span>Accuracy</span>
            <b>{result.accuracy}%</b>
          </div>
          <div className="card stat">
            <span>Correct</span>
            <b>{result.correctChars}</b>
          </div>
          <div className="card stat">
            <span>Incorrect</span>
            <b>{result.incorrectChars}</b>
          </div>
          <div className="card stat">
            <span>Max Streak</span>
            <b>{result.maxStreak}</b>
          </div>
          <div className="card stat">
            <span>Result</span>
            <b>{result.result === "win" ? "🏆 WIN" : result.result === "loss" ? "❌ LOSE" : "DRAW"}</b>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate("/race")}>
            Play Again
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/play")}>
            New Topic / Another Race
          </button>
          <Link className="btn btn-gold" to="/leaderboard">
            Leaderboard
          </Link>
          <Link className="btn btn-ghost" to="/">
            Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
