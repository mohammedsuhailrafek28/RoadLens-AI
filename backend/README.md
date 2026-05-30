# RoadLens AI Backend

FastAPI service for heavier RoadWatch demo paths:

- image relevance checking before hazard analysis
- road-surface hazard scoring
- authority escalation records
- public transparency timelines

## Local Run

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

Analyze image:

```bash
curl -F "image=@road.jpg" -F "roadSegmentId=anna-salai-junction" http://localhost:8000/analyze-hazard-image
```

## Render Deployment

Create a Render Web Service from this repository and set:

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Then set the frontend environment variable:

```env
NEXT_PUBLIC_ROADLENS_BACKEND_URL=https://your-roadlens-backend.onrender.com
```

The Next.js app will call the Render backend when this variable exists. If it is missing or unavailable, the frontend falls back to a local relevance classifier so demo credibility is preserved.
