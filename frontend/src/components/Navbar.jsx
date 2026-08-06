export default function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="#top" aria-label="MindMetric home">
        <span className="brand-mark">✦</span>
        <span>MindMetric</span>
      </a>
      <a className="nav-link" href="#predict">Get your score <span>→</span></a>
    </header>
  );
}
