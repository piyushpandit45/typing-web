import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../context/AuthContext";
import api, { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/games/user")
      .then(({ data }) => setGames(data.games))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const chart = [...games]
    .reverse()
    .map((g, i) => ({ race: i + 1, wpm: g.wpm, accuracy: g.accuracy }));

  return (
    <main className="page">
      <h1 className="h2">Rider Dashboard</h1>
      <div className="grid-2">
        <section className="card" style={{ padding: 22 }}>
          <h3>Profile</h3>
          <p>
            <strong>{user.name}</strong>
          </p>
          <p className="muted">{user.email}</p>
          <p>{user.country}</p>
        </section>
        <section className="stats-grid">
          <div className="card stat">
            <span>Games</span>
            <b>{user.totalGames}</b>
          </div>
          <div className="card stat">
            <span>Wins</span>
            <b>{user.totalWins}</b>
          </div>
          <div className="card stat">
            <span>Losses</span>
            <b>{user.totalLosses}</b>
          </div>
          <div className="card stat">
            <span>Win Rate</span>
            <b>{user.winRate}%</b>
          </div>
          <div className="card stat">
            <span>Best WPM</span>
            <b>{user.bestWpm}</b>
          </div>
          <div className="card stat">
            <span>Avg WPM</span>
            <b>{user.averageWpm}</b>
          </div>
          <div className="card stat">
            <span>Best Accuracy</span>
            <b>{user.bestAccuracy}%</b>
          </div>
        </section>
      </div>

      <section className="card" style={{ padding: 22, marginTop: 18 }}>
        <h3>Performance</h3>
        {chart.length < 2 ? (
          <div className="empty">Race more to see your trend line.</div>
        ) : (
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <XAxis dataKey="race" stroke="#9aa6bf" />
                <YAxis stroke="#9aa6bf" />
                <Tooltip />
                <Line type="monotone" dataKey="wpm" stroke="#ff3b3b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="accuracy" stroke="#4de2ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section style={{ marginTop: 18 }}>
        <h3>Recent Games</h3>
        {loading && <Loader label="Loading history..." />}
        {error && <div className="alert">{error}</div>}
        {!loading && !games.length && (
          <div className="empty">
            No races played yet. Start your first race!
            <div>
              <Link className="btn btn-primary" to="/play">
                Play Now
              </Link>
            </div>
          </div>
        )}
        {!!games.length && (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Difficulty</th>
                  <th>Topic</th>
                  <th>WPM</th>
                  <th>Accuracy</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {games.map((g) => (
                  <tr key={g._id}>
                    <td>{new Date(g.createdAt).toLocaleString()}</td>
                    <td>{g.difficulty}</td>
                    <td>{g.topicName}</td>
                    <td>{g.wpm}</td>
                    <td>{g.accuracy}%</td>
                    <td>{g.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
