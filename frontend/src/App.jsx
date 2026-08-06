import { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import { getPrediction } from './services/api';

function readableError(error) {
  if (!error.response) return 'We could not reach the prediction service. Make sure the FastAPI server is running on port 8000.';
  if (error.response.status === 422) {
    const detail = error.response.data?.detail;
    if (Array.isArray(detail)) return detail[0]?.msg || 'Please check the form values and try again.';
    return 'Please check the form values and try again.';
  }
  return error.response.data?.detail || 'Something went wrong while generating your prediction. Please try again.';
}

export default function App() {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const resultRef = useRef(null);
  const predict = async (payload) => {
    setLoading(true); setRequestError(''); setScore(null);
    try {
      const response = await getPrediction(payload);
      if (typeof response?.predicted_mental_health_score !== 'number') throw new Error('Unexpected response');
      setScore(response.predicted_mental_health_score);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    } catch (error) { setRequestError(readableError(error)); }
    finally { setLoading(false); }
  };
  const clearResult = () => { setScore(null); setRequestError(''); };
  return <div id="top" className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <Navbar />
    <main>
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><span className="pulse-dot" />AI-powered wellbeing insight</p><h1>Understand the patterns behind <em>your wellbeing.</em></h1><p className="hero-text">Predict your mental health score based on your social media usage, lifestyle and academic habits using Machine Learning.</p><a className="hero-cta" href="#predict">Explore your score <span>↓</span></a></div>
        <div className="hero-visual" aria-hidden="true"><div className="visual-rings" /><div className="visual-core"><span>✦</span><strong>AI</strong></div><div className="float-card card-top"><span>◌</span><div><b>Balanced habits</b><small>Insight detected</small></div></div><div className="float-card card-bottom"><span>↗</span><div><b>Personalized</b><small>ML prediction</small></div></div></div>
      </section>
      <section id="predict" className="predict-section"><div className="section-intro"><p className="eyebrow">Get started</p><h2>Your next insight is one form away.</h2><p>Take a moment to share your typical routine. Your information is used only to generate this prediction.</p></div><div className="workspace"><PredictionForm onSubmit={predict} loading={loading} requestError={requestError} onReset={clearResult} /><PredictionResult ref={resultRef} score={score} onPredictAgain={() => document.getElementById('predict')?.scrollIntoView({ behavior: 'smooth' })} /></div></section>
    </main><Footer />
  </div>;
}
