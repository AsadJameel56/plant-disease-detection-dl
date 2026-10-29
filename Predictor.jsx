import { useEffect, useRef, useState } from "react";
import { predictDisease, apiConfigured } from "../api";
import { parseLabel, getInfo } from "../diseaseInfo";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 5;

export default function Predictor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function choose(f) {
    setResult(null);
    setError("");
    if (!f) return;
    if (!ALLOWED.includes(f.type)) return setError("Please upload a JPG, PNG or WebP image.");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`That image is too large. Maximum size is ${MAX_MB} MB.`);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function onDrop(e) {
    e.preventDefault();
    setDrag(false);
    choose(e.dataTransfer.files?.[0]);
  }

  function reset() {
    setFile(null); setPreview(null); setResult(null); setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function onPredict() {
    if (!file || loading) return;
    setLoading(true); setError(""); setResult(null);
    try {
      setResult(await predictDisease(file));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const parsed = result ? parseLabel(result.label) : null;
  const info = parsed ? getInfo(parsed) : null;

  return (
    <section id="detect" className="section">
      <div className="container">
        <h2>Detect a plant disease</h2>
        <p className="lead">Upload a clear photo of a single leaf on a plain background for the best result.</p>

        {!apiConfigured && (
          <div className="alert warn" role="alert">
            <strong>API not configured.</strong> Set <code>VITE_API_URL</code> to your Flask server to enable predictions.
          </div>
        )}

        <div className="detect-grid">
          <div className="card">
            <div
              className={`dropzone ${drag ? "drag" : ""}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
              aria-label="Upload a leaf image"
            >
              {preview ? (
                <img src={preview} alt="Selected leaf preview" className="preview" />
              ) : (
                <div className="dz-empty">
                  <div className="dz-icon">🍃</div>
                  <p><strong>Drag &amp; drop</strong> a leaf image here</p>
                  <p className="muted">or click to browse · JPG, PNG, WebP · max {MAX_MB} MB</p>
                </div>
              )}
              <input ref={inputRef} type="file" accept={ALLOWED.join(",")} hidden onChange={(e) => choose(e.target.files?.[0])} />
            </div>

            {file && <p className="muted small">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>}

            <div className="btn-row">
              <button className="btn primary" onClick={onPredict} disabled={!file || loading}>
                {loading ? (<><span className="spinner" /> Analyzing…</>) : "Predict Disease"}
              </button>
              <button className="btn ghost" onClick={reset} disabled={!file || loading}>Clear</button>
            </div>

            {error && <div className="alert error" role="alert">{error}</div>}
          </div>

          <div className="card result" aria-live="polite">
            {!result && !loading && <div className="placeholder"><p>Your prediction will appear here.</p></div>}
            {loading && <div className="placeholder"><span className="spinner dark" /><p>Running the model…</p></div>}

            {result && parsed && (
              <>
                <span className={`badge ${parsed.healthy ? "ok" : "bad"}`}>{parsed.healthy ? "Healthy" : "Disease detected"}</span>
                <h3>{parsed.condition}</h3>
                <p className="muted">Plant: <strong>{parsed.plant}</strong></p>

                <div className="conf-label"><span>Confidence</span><strong>{result.confidence.toFixed(2)}%</strong></div>
                <div className="bar"><div style={{ width: `${Math.min(100, result.confidence)}%` }} /></div>
                {result.confidence < 60 && (
                  <p className="alert warn">Low confidence. Try a clearer, well-lit photo of a single leaf.</p>
                )}

                <h4>About</h4>
                <p>{info.about}</p>
                <h4>General guidance</h4>
                <ul>{info.tips.map((t) => <li key={t}>{t}</li>)}</ul>

                {result.top.length > 1 && (
                  <>
                    <h4>Other possibilities</h4>
                    <ul className="top">
                      {result.top.slice(1, 4).map((p) => {
                        const q = parseLabel(p.label);
                        return <li key={p.label}>{q.plant}: {q.condition} <span>{p.confidence.toFixed(1)}%</span></li>;
                      })}
                    </ul>
                  </>
                )}
                <p className="muted small">General information only. Confirm with a local agronomist before treating crops.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
