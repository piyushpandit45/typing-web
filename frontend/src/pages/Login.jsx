import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page" style={{ maxWidth: 480 }}>
      <div className="card" style={{ padding: 28 }}>
        <h1 className="h2">Rider Login</h1>
        <p className="muted">Optional — you can still race as a guest.</p>
        {error && <div className="alert">{error}</div>}
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>
        <p style={{ marginTop: 16 }}>
          New here? <Link to="/signup">Create an account</Link>
        </p>
        <p>
          Staff? <Link to="/admin/login">Admin Login</Link>
        </p>
        <p>
          <Link to="/play">Play as Guest</Link>
        </p>
      </div>
    </main>
  );
}
