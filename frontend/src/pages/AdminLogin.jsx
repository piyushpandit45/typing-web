import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await adminLogin(form);
      navigate("/admin");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page" style={{ maxWidth: 480 }}>
      <div className="card" style={{ padding: 28 }}>
        <h1 className="h2">Admin Login</h1>
        <p className="muted">Restricted access. Credentials are validated on the server.</p>
        {error && <div className="alert">{error}</div>}
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Admin Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          <button className="btn btn-gold" disabled={busy}>
            {busy ? "Verifying..." : "Enter Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}
