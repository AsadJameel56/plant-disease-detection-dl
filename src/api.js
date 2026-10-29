// Talks to the Flask API. Contract:
//   POST {VITE_API_URL}/predict   (multipart/form-data, field name: "file")
//   200 -> { "class_name": "Tomato___Late_blight", "confidence": 0.9731,
//            "top_predictions": [ { "class_name": "...", "confidence": 0.02 }, ... ] }   (top_predictions optional)
//   4xx/5xx -> { "error": "message" }
// confidence may be 0-1 or 0-100; it is normalised to a percentage here.

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
export const apiConfigured = Boolean(API_URL);
export const apiUrl = API_URL;

const toPercent = (c) => {
  const n = Number(c);
  if (Number.isNaN(n)) return NaN;
  return n <= 1 ? n * 100 : n;
};

export async function predictDisease(file) {
  if (!API_URL) {
    throw new Error("The API URL is not configured. Set VITE_API_URL in your .env file (or Vercel environment variables) and restart.");
  }

  const body = new FormData();
  body.append("file", file);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);

  let res;
  try {
    res = await fetch(`${API_URL}/predict`, { method: "POST", body, signal: controller.signal });
  } catch (err) {
    throw new Error(
      err.name === "AbortError"
        ? "The prediction server took too long to respond. Please try again."
        : `Could not reach the prediction server at ${API_URL}. Make sure the Flask API is running, the URL is correct, and CORS is enabled.`
    );
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try { data = await res.json(); } catch { /* non-JSON response */ }

  if (!res.ok) throw new Error(data?.error || `The server returned an error (HTTP ${res.status}).`);

  const label = data?.class_name ?? data?.prediction ?? data?.label;
  const confidence = toPercent(data?.confidence);
  if (!label || Number.isNaN(confidence)) {
    throw new Error("Unexpected response from the server. Expected JSON with class_name and confidence.");
  }

  const top = Array.isArray(data.top_predictions)
    ? data.top_predictions
        .map((p) => ({ label: p.class_name ?? p.label, confidence: toPercent(p.confidence) }))
        .filter((p) => p.label && !Number.isNaN(p.confidence))
    : [];

  return { label, confidence, top };
}
