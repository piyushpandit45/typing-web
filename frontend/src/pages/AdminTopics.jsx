import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";

const emptyForm = { title: "", difficulty: "easy", content: "", isActive: true };

export default function AdminTopics() {
  const [topics, setTopics] = useState([]);
  const [tab, setTab] = useState("easy");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/topics");
      setTopics(data.topics);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = topics.filter((t) => t.difficulty === tab);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOk("");
    try {
      if (editing) {
        await api.put(`/topics/${editing}`, form);
        setOk("Topic updated. Active topics are used in random race selection.");
      } else {
        await api.post("/topics", { ...form, difficulty: tab });
        setOk("Topic added. It now joins random selection for this difficulty.");
      }
      setForm({ ...emptyForm, difficulty: tab });
      setEditing(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function toggle(id, isActive) {
    await api.patch(`/topics/${id}/status`, { isActive });
    await load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this topic?")) return;
    await api.delete(`/topics/${id}`);
    await load();
  }

  return (
    <main className="page">
      <div className="admin-nav">
        <Link className="btn btn-ghost" to="/admin">
          Dashboard
        </Link>
        <Link className="btn btn-gold" to="/admin/topics">
          Topics
        </Link>
      </div>
      <h1 className="h2">Topic Management</h1>
      <div className="filters">
        {["easy", "medium", "hard"].map((d) => (
          <button
            key={d}
            className={`chip ${tab === d ? "active" : ""}`}
            onClick={() => {
              setTab(d);
              setForm((f) => ({ ...f, difficulty: d }));
              setEditing(null);
            }}
          >
            {d} topics
          </button>
        ))}
      </div>
      {error && <div className="alert">{error}</div>}
      {ok && <div className="alert alert-ok">{ok}</div>}

      <form className="card form-grid" style={{ padding: 20, marginBottom: 18 }} onSubmit={save}>
        <h3>{editing ? "Edit Topic" : `Add ${tab} topic`}</h3>
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label>
          Typing Content
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            minLength={80}
          />
        </label>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Saving..." : editing ? "Update Topic" : "Add Topic"}
        </button>
      </form>

      {loading && <Loader label="Loading topics..." />}
      {!loading && !filtered.length && <div className="empty">No topics available for this difficulty.</div>}
      {filtered.map((t) => (
        <article className="card" key={t._id} style={{ padding: 16, marginBottom: 10 }}>
          <strong>{t.title}</strong>
          <p className="muted">{t.isActive ? "Active" : "Inactive"} · {t.content.slice(0, 140)}...</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setEditing(t._id);
                setForm({
                  title: t.title,
                  difficulty: t.difficulty,
                  content: t.content,
                  isActive: t.isActive,
                });
              }}
            >
              Edit
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => toggle(t._id, !t.isActive)}>
              {t.isActive ? "Deactivate" : "Activate"}
            </button>
            <button className="btn btn-primary" type="button" onClick={() => remove(t._id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </main>
  );
}
