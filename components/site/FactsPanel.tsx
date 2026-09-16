export default function FactsPanel() {
  return (
    <div className="facts-panel">
      <h3>Quick Facts</h3>
      <div className="fact-row">
        <span>Board</span>
        <span className="mono">CBSE</span>
      </div>
      <div className="fact-row">
        <span>Grades offered</span>
        <span className="mono">Nursery &ndash; X</span>
      </div>
      <div className="fact-row">
        <span>Academic year</span>
        <span className="mono">Apr &ndash; Mar</span>
      </div>
      <div className="fact-row">
        <span>Location</span>
        <span className="mono">Dehri-on-Sone</span>
      </div>
      <a className="btn btn-gold" href="tel:+919771020700">
        Call for Admissions
      </a>
    </div>
  );
}
