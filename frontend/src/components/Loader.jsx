export default function Loader({ label = "Loading..." }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="spinner" />
      <div>{label}</div>
    </div>
  );
}
