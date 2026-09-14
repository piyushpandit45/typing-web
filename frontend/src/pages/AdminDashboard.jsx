import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (error) {
    return (
      <main className="page">
        <div className="alert">{error}</div>
      </main>
    );
  }
  if (!data) return <Loader label="Loading admin stats..." />;

  const s = data.stats;
  return (
    <main className="page">
      <div className="admin-nav">
        <Link className="btn btn-gold" to="/admin">
          Dashboard
        </Link>
        <Link className="btn btn-ghost" to="/admin/topics">
          Topics
        </Link>
      </div>
      <h1 className="h2">Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="card stat">
          <span>Users</span>
          <b>{s.totalUsers}</b>
        </div>
        <div className="card stat">
          <span>Games</span>
          <b>{s.totalGames}</b>
        </div>
        <div className="card stat">
          <span>Topics</span>
          <b>{s.totalTopics}</b>
        </div>
        <div className="card stat">
          <span>Easy</span>
          <b>{s.easyTopics}</b>
        </div>
        <div className="card stat">
          <span>Medium</span>
          <b>{s.mediumTopics}</b>
        </div>
        <div className="card stat">
          <span>Hard</span>
          <b>{s.hardTopics}</b>
        </div>
      </div>
      <h3 style={{ marginTop: 24 }}>Recent Games</h3>
      {!data.recentGames.length && <div className="empty">No races recorded yet.</div>}
      {!!data.recentGames.length && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Difficulty</th>
                <th>Topic</th>
                <th>WPM</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {data.recentGames.map((g) => (
                <tr key={g._id}>
                  <td>{g.playerName}</td>
                  <td>{g.difficulty}</td>
                  <td>{g.topicName}</td>
                  <td>{g.wpm}</td>
                  <td>{g.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
