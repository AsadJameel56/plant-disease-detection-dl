import { useState } from "react";
import Predictor from "./components/Predictor.jsx";

const LINKS = [
  ["home", "Home"],
  ["about", "About Project"],
  ["how", "How It Works"],
  ["performance", "Model Performance"],
];

const Leaf = () => (
  <svg viewBox="0 0 200 200" className="leaf-art" aria-hidden="true">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#86efac" />
        <stop offset="1" stopColor="#15803d" />
      </linearGradient>
    </defs>
    <path d="M30 170C20 80 80 20 175 25c5 95-45 150-125 150" fill="url(#g)" />
    <path d="M35 168C80 120 120 80 165 35M85 120l35 5M70 138l-5-30M110 85l40 0M100 98l-10-35" stroke="#dcfce7" strokeWidth="4" strokeLinecap="round" fill="none" />
  </svg>
);

const STATS = [
  ["MobileNetV2", "Model architecture"],
  ["PlantVillage", "Training dataset"],
  ["38", "Classes"],
  ["96.28%", "Test accuracy"],
];

const STEPS = [
  ["1", "Upload", "Choose or drop a leaf photo. It is validated for type and size in your browser."],
  ["2", "Send", "The image is posted to the Flask API at /predict as multipart form data."],
  ["3", "Predict", "The MobileNetV2 model resizes and normalizes the image, then outputs probabilities for 38 classes."],
  ["4", "Result", "The top class and its confidence are shown with general guidance about the condition."],
];

export default function App() {
  const [open, setOpen] = useState(false);
  const go = () => setOpen(false);

  return (
    <>
      <header className="nav">
        <div className="container nav-in">
          <a href="#home" className="brand">🌿 LeafGuard</a>
          <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>☰</button>
          <nav className={open ? "open" : ""}>
            {LINKS.map(([id, label]) => <a key={id} href={`#${id}`} onClick={go}>{label}</a>)}
            <a href="#detect" className="btn primary sm" onClick={go}>Try it</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container hero-in">
            <div>
              <span className="pill">Deep Learning Semester Project</span>
              <h1>Spot plant diseases from a single leaf photo</h1>
              <p className="lead light">
                A MobileNetV2 model trained on the PlantVillage dataset recognizes 38 crop and disease classes.
                Upload an image and get a prediction with a confidence score.
              </p>
              <div className="btn-row">
                <a href="#detect" className="btn primary lg">Upload a leaf</a>
                <a href="#how" className="btn outline lg">How it works</a>
              </div>
            </div>
            <Leaf />
          </div>
        </section>

        <Predictor />

        <section id="about" className="section alt">
          <div className="container">
            <h2>About the project</h2>
            <p className="lead">
              This project applies transfer learning to classify leaf images as healthy or affected by a specific disease.
              The React frontend talks to a Python Flask API that loads the trained model and returns predictions.
            </p>
            <div className="grid3">
              <div className="card"><h4>Dataset</h4><p>PlantVillage: labeled images of healthy and diseased leaves across multiple crops, grouped into 38 classes.</p></div>
              <div className="card"><h4>Model</h4><p>MobileNetV2, a lightweight convolutional network pretrained on ImageNet and fine-tuned for this task.</p></div>
              <div className="card"><h4>Stack</h4><p>React + Vite frontend, Flask backend, deployed frontend on Vercel.</p></div>
            </div>
          </div>
        </section>

        <section id="how" className="section">
          <div className="container">
            <h2>How it works</h2>
            <div className="grid4">
              {STEPS.map(([n, t, d]) => (
                <div className="card step" key={n}><span className="num">{n}</span><h4>{t}</h4><p>{d}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section id="performance" className="section alt">
          <div className="container">
            <h2>Model performance</h2>
            <div className="grid4">
              {STATS.map(([v, l]) => (
                <div className="card stat" key={l}><strong>{v}</strong><span>{l}</span></div>
              ))}
            </div>
            <p className="muted small">
              Accuracy was measured on the held-out PlantVillage test split. PlantVillage photos use controlled backgrounds,
              so accuracy on real field photos can be lower.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">LeafGuard · Deep Learning semester project · MobileNetV2 + PlantVillage</div>
      </footer>
    </>
  );
}
