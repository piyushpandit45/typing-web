import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CountrySelect from "../components/CountrySelect";
import { findCountry } from "../utils/countries";

const DIFFS = [
  { id: "easy", title: "EASY", copy: "Beginner-friendly typing. Short words and a calmer AI." },
  { id: "medium", title: "MEDIUM", copy: "Moderate vocabulary, longer lines, a balanced rival." },
  { id: "hard", title: "HARD", copy: "Advanced passages, punctuation, and a fast opponent." },
];

export default function GameSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || "");
  const [country, setCountry] = useState(
    user ? findCountry(user.country) || { name: user.country, code: user.countryCode || "", flag: "" } : null
  );
  const [difficulty, setDifficulty] = useState("medium");

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.country) {
      setCountry(findCountry(user.country) || { name: user.country, code: user.countryCode || "", flag: "" });
    }
  }, [user]);

  function start() {
    if (name.trim().length < 2 || !country) return;
    sessionStorage.setItem(
      "typerider_setup",
      JSON.stringify({
        name: name.trim(),
        country: country.name,
        countryCode: country.code || "",
        flag: country.flag || "",
        difficulty,
      })
    );
    navigate("/race");
  }

  return (
    <main className="page">
      <h1 className="h2">Race Setup</h1>
      <p className="muted">Guests welcome. Official leaderboard scores save when you are logged in.</p>

      {step === 1 && (
        <div className="card" style={{ padding: 24, marginTop: 16 }}>
          <h3>Step 1 — Player Name</h3>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <button className="btn btn-primary" style={{ marginTop: 16 }} disabled={name.trim().length < 2} onClick={() => setStep(2)}>
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card" style={{ padding: 24, marginTop: 16 }}>
          <h3>Step 2 — Country</h3>
          <CountrySelect value={country} onChange={setCountry} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn btn-primary" disabled={!country} onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ marginTop: 16 }}>
          <h3>Step 3 — Difficulty</h3>
          <div className="diff-grid">
            {DIFFS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`card diff-card ${difficulty === d.id ? "selected" : ""}`}
                onClick={() => setDifficulty(d.id)}
              >
                <strong>{d.title}</strong>
                <p className="muted">{d.copy}</p>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button className="btn btn-ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="btn btn-primary" onClick={start}>
              Start Race
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
