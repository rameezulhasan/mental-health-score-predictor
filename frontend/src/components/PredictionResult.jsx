import { forwardRef } from 'react';

const scoreMeta = (score) => {
  if (score < 4) return { label: 'Low score', className: 'low', detail: 'Consider making a little more room for rest and support.' };
  if (score < 7) return { label: 'Moderate score', className: 'medium', detail: 'Your current balance shows several encouraging signals.' };
  return { label: 'High score', className: 'high', detail: 'Your current habits indicate a positive wellbeing outlook.' };
};

const PredictionResult = forwardRef(function PredictionResult({ score, onPredictAgain }, ref) {
  if (score === null) return null;
  const meta = scoreMeta(score);
  return (
    <section ref={ref} className="result-card" aria-live="polite">
      <div className="result-orb">✦</div>
      <p className="eyebrow">Your prediction is ready</p>
      <h2>Mental Health Score</h2>
      <div className={`score ${meta.className}`}>{Number(score).toFixed(2)}</div>
      <span className={`score-label ${meta.className}`}>{meta.label}</span>
      <p className="result-detail">{meta.detail}</p>
      <div className="result-note"><span>i</span> This ML-generated estimate is for informational purposes only and is not a medical diagnosis.</div>
      <button className="text-button" onClick={onPredictAgain}>Make another prediction <span>→</span></button>
    </section>
  );
});

export default PredictionResult;
