# LeafGuard – Plant Disease Detection (frontend)

React + Vite frontend for a MobileNetV2 / PlantVillage (38 classes, 96.28% test accuracy) project.
It does NOT contain a model or backend. Predictions only work when a Flask API is running.

## Run locally
```bash
npm install
cp .env.example .env     # set VITE_API_URL (e.g. http://localhost:5000)
npm run dev              # http://localhost:5173
```

## Flask API contract
`POST {VITE_API_URL}/predict`, multipart field `file`.
Success: `{"class_name": "Tomato___Late_blight", "confidence": 0.97, "top_predictions": [{"class_name": "...", "confidence": 0.02}]}`
Error: HTTP 4xx/5xx with `{"error": "message"}`.
Enable CORS (`flask-cors`) for your frontend origin(s). `class_name` must use PlantVillage names (`Plant___Condition`).

## Deploy to Vercel
1. Push this folder to GitHub.
2. Vercel > Add New Project > import the repo (Framework: Vite, build `npm run build`, output `dist`).
3. Add environment variable `VITE_API_URL` = your public HTTPS Flask URL (Render, Railway, etc.).
4. Deploy. Redeploy after changing env vars (Vite bakes them in at build time).
Note: an HTTPS site cannot call an HTTP API (mixed content), so the deployed backend needs HTTPS.
