export default function Loader({ label = 'Analyzing your responses…' }) {
  return (
    <span className="loader-wrap" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      {label}
    </span>
  );
}
