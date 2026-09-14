import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";

export default function Leaderboard() {
  const [period, setPeriod] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/leaderboard", { params: { period, difficulty } });
        if (!cancelled) setRows(data.leaderboard);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [period, difficulty]);

  return (
    <main className="page">
      <h1 className="h2">Global Leaderboard</h1>
      <p className="muted">Official ranks come from registered riders. Guests can view the board.</p>
      <div className="filters">
        {["all", "weekly", "today"].map((p) => (
          <button key={p} className={`chip ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>
            {p === "all" ? "All Time" : p === "weekly" ? "Weekly" : "Today"}
          </button>
        ))}
        {["all", "easy", "medium", "hard"].map((d) => (
          <button key={d} className={`chip ${difficulty === d ? "active" : ""}`} onClick={() => setDifficulty(d)}>
            {d === "all" ? "All Difficulties" : d}
          </button>
        ))}
      </div>
      {loading && <Loader label="Loading ranks..." />}
      {error && <div className="alert">{error}</div>}
      {!loading && !rows.length && <div className="empty">No official scores yet. Log in and race to claim a spot.</div>}
      {!!rows.length && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Country</th>
                <th>Best WPM</th>
                <th>Accuracy</th>
                <th>Difficulty</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.userId || r.rank} className={r.rank <= 3 ? `rank-${r.rank}` : ""}>
                  <td>
                    {r.rank === 1 ? "🥇 1" : r.rank === 2 ? "🥈 2" : r.rank === 3 ? "🥉 3" : r.rank}
                  </td>
                  <td>{r.playerName}</td>
                  <td>{r.country}</td>
                  <td>{r.bestWpm}</td>
                  <td>{r.accuracy}%</td>
                  <td>{r.difficulty}</td>
                  <td>{r.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
