export default function HowToPlay() {
  return (
    <main className="page">
      <h1 className="h2">How to Play</h1>
      <div className="steps">
        <div className="card step-card">
          <div className="badge">1</div>
          <div>
            <h3>Setup</h3>
            <p className="muted">Enter your name, pick a country, and choose Easy, Medium, or Hard. Login is optional.</p>
          </div>
        </div>
        <div className="card step-card">
          <div className="badge">2</div>
          <div>
            <h3>Random topic</h3>
            <p className="muted">The race pulls a random active topic for that difficulty. New admin topics join the pool automatically.</p>
          </div>
        </div>
        <div className="card step-card">
          <div className="badge">3</div>
          <div>
            <h3>Type to ride</h3>
            <p className="muted">Correct keys push the red bike. Errors slow you down. High streak plus accuracy unlocks Nitro.</p>
          </div>
        </div>
        <div className="card step-card">
          <div className="badge">4</div>
          <div>
            <h3>Beat the black bike</h3>
            <p className="muted">The AI opponent scales with difficulty. When 01:00 hits zero, the lead rider wins.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
