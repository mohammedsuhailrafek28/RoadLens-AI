# RoadLens AI

Predictive Near-Miss Intelligence Infrastructure for road-risk forecasting, anomaly visualization, ML artifact integration, and RoadWatch-style governance transparency.

Live demo: https://roadlens-ai.vercel.app

## Frontend

```bash
corepack pnpm install
corepack pnpm dev
corepack pnpm lint
corepack pnpm build
```

The Next.js app runs the cinematic dashboard, Leaflet risk map, ML output adapter, hazard upload flow, authority queue, and public RoadWatch transparency panel.

## ML Workspace

```bash
python -m ml.run_pipeline
```

The `/ml` workspace exports dashboard-ready artifacts into `ml/outputs`. The Next.js app reads those artifacts through `src/lib/ml-output-adapter.ts` and falls back to demo data if artifacts are unavailable.

## Backend Service

The optional `/backend` service is a FastAPI app intended for Render deployment. It provides:

- image relevance checking
- hazard image analysis
- authority escalation
- public transparency timelines

Local run:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Set this in the frontend when the backend is deployed:

```env
NEXT_PUBLIC_ROADLENS_BACKEND_URL=https://your-roadlens-backend.onrender.com
```

If the backend URL is missing or unavailable, the frontend uses a local relevance fallback so unrelated notes/selfies/indoor images are rejected instead of receiving fake high-confidence hazard scores.

## RoadWatch Governance

RoadLens AI supports RoadWatch by showing:

- how hazards are detected
- how risks are predicted
- how authorities are notified
- how public transparency is maintained
- how infrastructure issues are prioritized

The `Run Demo Scenario` button visibly activates the Evening Rain Surge state. `Reset Scenario` restores the baseline for repeatable demos.
