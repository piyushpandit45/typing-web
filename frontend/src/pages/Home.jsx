import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const particles = Array.from({ length: 18 }, (_, i) => i);
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-particles" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p}
              style={{
                left: `${(p * 17) % 100}%`,
                bottom: `${20 + (p % 8) * 8}%`,
                animationDelay: `${p * 0.3}s`,
              }}
            />
          ))}
        </div>
        <div className="hero-road" aria-hidden="true">
          <div className="hero-dash" />
        </div>
        <div className="hero-copy">
          <div className="tagline">Type Fast. Ride Faster.</div>
          <motion.h1
            className="h1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Race Your Typing Skills
          </motion.h1>
          <p className="muted" style={{ fontSize: "1.2rem", maxWidth: 640 }}>
            Type faster, ride faster, and beat your opponent. Your typing speed
            controls your motorcycle.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/play">
              Play Now
            </Link>
            <Link className="btn btn-ghost" to="/login">
              Login
            </Link>
            <Link className="btn btn-ghost" to="/signup">
              Sign Up
            </Link>
            <Link className="btn btn-gold" to="/leaderboard">
              Leaderboard
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <article className="card feature-card">
          <h3>Red vs Black</h3>
          <p className="muted">Ride the red bike. Beat the AI on the black machine. One minute. No mercy.</p>
        </article>
        <article className="card feature-card">
          <h3>Nitro From Accuracy</h3>
          <p className="muted">Clean streaks unlock boost. Mistakes cost traction. Type like you race.</p>
        </article>
        <article className="card feature-card">
          <h3>Play as Guest</h3>
          <p className="muted">Jump in with a name and country. Create an account when you want official ranks.</p>
        </article>
      </section>
    </main>
  );
}
