export default function Motorcycle({ variant = "player" }) {
  const isPlayer = variant === "player";
  const body = isPlayer ? "#d61f1f" : "#161616";
  const accent = isPlayer ? "#ff6a3d" : "#3a3a3a";
  const suit = isPlayer ? "#8b1010" : "#0d0d0d";
  const helmet = isPlayer ? "#ff2a2a" : "#111";
  const visor = isPlayer ? "#79e7ff" : "#5a5a5a";

  return (
    <svg viewBox="0 0 220 120" role="img" aria-label={isPlayer ? "Player red motorcycle" : "AI black motorcycle"}>
      <ellipse cx="110" cy="108" rx="70" ry="8" fill="rgba(0,0,0,0.35)" />
      <circle cx="48" cy="88" r="22" fill="#111" stroke="#666" strokeWidth="6" />
      <circle cx="168" cy="88" r="22" fill="#111" stroke="#666" strokeWidth="6" />
      <circle cx="48" cy="88" r="8" fill="#999" />
      <circle cx="168" cy="88" r="8" fill="#999" />
      <path d="M70 82 L150 82 L138 62 L92 58 Z" fill={body} />
      <path d="M92 58 L138 62 L132 48 L100 46 Z" fill={accent} />
      <rect x="118" y="40" width="28" height="16" rx="6" fill={body} />
      <path d="M146 48 L176 42 L178 54 L150 62 Z" fill={accent} />
      <rect x="38" y="70" width="18" height="10" rx="3" fill="#222" />
      <g transform="translate(108,28)">
        <ellipse cx="0" cy="22" rx="16" ry="20" fill={suit} />
        <circle cx="2" cy="4" r="12" fill={helmet} />
        <path d="M-4 2 H14 Q12 12 2 14 Q-8 10 -4 2" fill={visor} />
        <path d="M-10 18 L-28 38 L-18 40 L2 24" fill={suit} />
        <path d="M8 28 L28 42 L22 46 L6 32" fill={suit} />
      </g>
      <rect x="70" y="78" width="18" height="6" fill="#ffcc66" opacity={isPlayer ? 1 : 0.4} />
    </svg>
  );
}
