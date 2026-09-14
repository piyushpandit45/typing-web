import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import CountrySelect from "../components/CountrySelect";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    countryCode: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.country) {
      setError("Select a country.");
      return;
    }
    setBusy(true);
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page" style={{ maxWidth: 520 }}>
      <div className="card" style={{ padding: 28 }}>
        <h1 className="h2">Join the Grid</h1>
        {error && <div className="alert">{error}</div>}
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              minLength={2}
            />
          </label>
          <label>
            Email
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
              minLength={6}
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </label>
          <label>
            Country
            <CountrySelect
              onChange={(c) =>
                setForm({ ...form, country: c.name, countryCode: c.code })
              }
            />
          </label>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p style={{ marginTop: 16 }}>
          Already racing? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
