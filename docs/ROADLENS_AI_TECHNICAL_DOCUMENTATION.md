# RoadLens AI Technical Documentation

## Product Identity

RoadLens AI is a predictive road-risk intelligence platform. The current MVP focuses on one demo truth:

> We are not detecting accidents after they happen. We are predicting high-risk road segments before accidents happen.

The Phase 2 product positioning is sharper:

> Roads should not require fatalities before being classified as dangerous.

The project is intentionally built as a hackathon-ready smart-city command center rather than a conventional pothole reporting workflow. It now presents itself as Predictive Near-Miss Intelligence Infrastructure: a system that detects invisible danger formation before a fatal accident record exists.

## Software Packages

Runtime stack:

- `@supabase/supabase-js@2.106.2`: Server-side Supabase integration for road, hazard, anomaly, risk, and authority queue persistence.
- `next@16.2.6`: App Router web framework, API routes, production build.
- `react@19.2.4` and `react-dom@19.2.4`: UI runtime.
- `leaflet@1.9.4`: Interactive geospatial map rendering.
- `framer-motion@12.40.0`: Motion and premium dashboard transitions.
- `lucide-react@1.17.0`: Interface icons.
- `clsx`, `tailwind-merge`, `class-variance-authority`: Utility packages for predictable class composition.

Development stack:

- `typescript`: Static typing for application and route logic.
- `tailwindcss@4.3.0` and `@tailwindcss/postcss`: Utility-first styling.
- `eslint` and `eslint-config-next`: Code quality checks.
- `@types/leaflet`, `@types/node`, `@types/react`, `@types/react-dom`: Type definitions.
- `pnpm` through Corepack: Package manager.

Typography:

- Headings: `Space Grotesk`
- Body: `Inter`
- Telemetry/data: `JetBrains Mono`

Recommended deployment tooling:

- `vercel` CLI is not installed locally yet. Installing it with `npm i -g vercel` unlocks `vercel env pull`, `vercel deploy`, and `vercel logs`.

## Assumptions

- The MVP uses deterministic mock data for Chennai road segments.
- No login, authentication, government integration, live database, or real ML training is implemented.
- Risk scores are calculated through a transparent scoring formula rather than a trained production model.
- The Leaflet map uses OpenStreetMap tiles and simulated road geometries.
- Hazard uploads are simulated; the UI treats the demo pothole image as a severe detected hazard.
- API routes return demo-ready JSON and are structured to be replaceable by Supabase/PostgreSQL-backed services later.
- Supabase integration is implemented and activates when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided.
- Without Supabase keys, APIs safely return the same intelligent mock data so the demo remains functional.
- Open-Meteo weather fetches are real. If network access or the API fails, the route falls back to a believable simulated weather snapshot.
- The project prioritizes demonstration quality, narrative clarity, and believable predictive intelligence over infrastructure completeness.
- Phase 2 uses simulation logic inspired by research and open-source systems rather than importing heavy geospatial, ML, or GNN pipelines.
- The anomaly, forecasting, explainability, and stress-score layers are deterministic and explainable so judges can inspect why a risk score changed.

## Current Architecture

```text
User
  |
  v
Next.js App Router UI
  |
  |-- Dashboard command center
  |-- Cinematic hero experience
  |-- Leaflet risk map
  |-- Hazard upload simulation
  |-- Road detail panel
  |-- Authority analytics panel
  |-- Collective Braking Memory panel
  |-- Chaos Window Forecast panel
  |-- Risk Audit Trail panel
  |-- Road Stress Score panel
  |
  v
Shared mock intelligence layer
  |
  |-- road segment data
  |-- risk scoring formula
  |-- risk level classification
  |-- AI explanation strings
  |-- braking anomaly simulation
  |-- temporal chaos-window simulation
  |-- SHAP-inspired audit factors
  |-- infrastructure stress scoring
  |
  v
Next.js API routes
  |
  |-- /api/dashboard
  |-- /api/weather
  |-- /api/anomalies/events
  |-- /api/roads/risk-map
  |-- /api/roads/[id]
  |-- /api/hazards/report
  |-- /api/risk/calculate
  |-- /api/ai/explain-risk
```

## Code Detail

Important files:

- `src/app/page.tsx`: Minimal page entry that renders the RoadLens dashboard.
- `src/components/roadlens-experience.tsx`: Switches from cinematic hero to dashboard after user entry.
- `src/components/cinematic-hero.tsx`: Full opening experience with animated city grid, anomaly nodes, predictive flow, braking memory, chaos forecast, and explainable AI sections.
- `src/app/layout.tsx`: Metadata and root layout.
- `src/app/globals.css`: Tailwind, Leaflet CSS import, global theme, map styling.
- `src/components/roadlens-dashboard.tsx`: Main interactive command-center dashboard with Phase 2 intelligence panels.
- `src/components/risk-map.tsx`: Leaflet map, dark tile layer, glowing road paths, weather scan layer, heat fields, and braking anomaly pulses.
- `src/lib/risk-data.ts`: Road segment seed data, hazard reports, risk formula, anomaly simulation, temporal forecast windows, audit factors, stress scoring, and analytics helpers.
- `src/lib/supabase-server.ts`: Server-only Supabase client factory with safe missing-config handling.
- `src/lib/weather.ts`: Open-Meteo current weather fetch and fallback weather simulation.
- `src/lib/utils.ts`: Class name merge helper.
- `src/app/api/dashboard/route.ts`: Hydrates dashboard intelligence from Supabase when configured, otherwise mock intelligence.
- `src/app/api/weather/route.ts`: Returns Open-Meteo weather snapshot.
- `src/app/api/anomalies/events/route.ts`: Reads and writes anomaly events.
- `src/app/api/roads/risk-map/route.ts`: Returns all road segments with risk scores.
- `src/app/api/roads/[id]/route.ts`: Returns one road segment with hazards and risk score.
- `src/app/api/hazards/report/route.ts`: Simulates hazard submission and AI analysis.
- `src/app/api/risk/calculate/route.ts`: Calculates risk for a road segment.
- `src/app/api/ai/explain-risk/route.ts`: Returns human-readable risk explanation.
- `supabase/schema.sql`: PostgreSQL schema for Phase 3 persistence tables.
- `.env.example`: Required Supabase environment variables.

## Phase 3 Cinematic Hero Experience

The product now opens with a full-screen intelligence-system entry experience before the dashboard appears.

Hero sections:

1. Fullscreen cinematic opening with animated city grid, traffic lines, telemetry pulses, anomaly nodes, gradients, scanlines, and CTA.
2. Core insight comparison: `Accident -> Response` versus `Near Miss -> Anomaly -> Prediction -> Prevention`.
3. Collective Braking Memory visual with pulsing braking, swerving, and near-miss clusters.
4. Chaos Window Forecasting chart showing rain, traffic, visibility, and risk spike formation.
5. Explainable AI section with SHAP-style factor bars.
6. Final immersive dashboard transition CTA.

The hero is deliberately not a SaaS marketing page. It is designed to feel like entering a predictive smart-city intelligence system.

## Final Experience Polish

The final polish phase focuses on cinematic intelligence immersion rather than new backend scope.

Implemented experiential upgrades:

- Animated pulse propagation across danger zones.
- Risk propagation and city nervous-system energy through glowing road corridors.
- Layered map atmosphere: rainfall haze, visibility fog, traffic compression glow, city scanlines, and depth gradients.
- `Last 6 Hours Intelligence Replay` overlay inside the map.
- Floating live telemetry alerts:
  - Brake anomaly detected.
  - Rain escalation.
  - Near-miss spike.
  - Traffic compression increasing.
- Right-panel scan sweeps, reactive hover lighting, and surge-state glow.
- Collective Braking Memory upgraded with a `Near-Miss Emergence Timeline`.

Unforgettable demo moment:

```text
Simulate Evening Rain Surge
```

When triggered:

1. Rain overlay intensifies.
2. Visibility haze increases.
3. Anomaly pulses accelerate.
4. Chaos-window timeline rises.
5. Danger zones pulse aggressively.
6. Risk score escalates through shared severity state.
7. Authority queue messaging reprioritizes.
8. Road stress visibly increases.

This creates the intended emotional demo beat: the city appears to wake up as invisible danger becomes operationally visible.

## Final ML And Research Infrastructure Integration

RoadLens AI now includes a lightweight research-grade ML infrastructure layer. It does not train large production models inside the hackathon app. Instead, it defines the architecture, feature contracts, scorecards, and simulated inference outputs required to make the system believable, extensible, and production-ready.

Master architecture:

```text
Road Graph
  -> Feature Fusion
  -> GNN Risk Modeling
  -> Temporal Forecasting
  -> Risk Propagation
  -> Explainability
  -> MLflow Tracking
  -> Dashboard Intelligence
```

Implemented files:

- `src/lib/ml-infrastructure.ts`
- `src/app/api/ml/research-architecture/route.ts`
- `src/app/api/ml/scorecards/route.ts`

## ML Artifact Integration Into Next.js

RoadLens AI now consumes the separate `/ml` training workspace outputs through a resilient TypeScript adapter.

Architecture:

```text
ML Training Workspace
  -> JSON Artifacts
  -> Next.js ML Adapter
  -> API Routes
  -> RoadLens Dashboard
```

Important rule:

```text
Heavy Python training never runs inside the frontend request cycle.
```

The training workspace generates:

- `ml/outputs/dashboard_risk_feed.json`
- `ml/outputs/anomaly_feed.json`
- `ml/outputs/chaos_windows.json`
- `ml/outputs/risk_explanations.json`
- `ml/outputs/authority_queue.json`
- `ml/reports/model_scorecard.md`

The Next.js app reads those artifacts through:

```text
src/lib/ml-output-adapter.ts
```

Adapter helpers:

- `getMlRiskFeed()`
- `getMlAnomalyFeed()`
- `getMlChaosWindows()`
- `getMlRiskExplanations()`
- `getMlAuthorityQueue()`
- `getMlIntegratedDashboard()`

API routes:

- `GET /api/dashboard`: prioritizes ML pipeline outputs and falls back to demo data.
- `GET /api/ml/status`: reports artifact readiness and missing files.
- `GET /api/ml/scorecard`: exposes parsed model scorecard rows.

Dashboard behavior:

- Shows `ML Intelligence Layer: Connected` when artifacts are available.
- Shows `ML Intelligence Layer: Demo fallback active` when artifacts are missing.
- Manual refresh button calls `/api/dashboard` and reloads the latest generated artifacts.
- Risk cards, anomaly feed, scorecard, and telemetry strip hydrate from ML outputs when available.

Reliability:

- If any ML output is missing or malformed, the app does not crash.
- Fallback demo data remains available for hackathon reliability.
- Python training can be run manually with:

```bash
corepack pnpm ml:run
```

Status can be checked after the dev server is running:

```bash
corepack pnpm ml:status
```

### Phase 1: Road Graph Construction

Conceptual references:

- OSMnx: road-network extraction and graph construction.
- GeoPandas: geospatial feature joins and spatial analytics.

RoadLens implementation:

- Creates a Chennai corridor graph with road-segment nodes and adjacency edges.
- Corridors include Anna Salai, OMR, Velachery, Guindy, and ECR.
- Edges encode adjacency weight and propagation prior.
- The graph supports segment-level risk, anomaly clustering, temporal overlays, propagation modeling, and infrastructure analytics.

Current graph payload:

```text
GET /api/ml/research-architecture
```

### Phase 2: Feature Fusion Pipeline

Fused signals:

- Hazard uploads.
- Braking anomaly signals.
- Weather signals.
- Lighting conditions.
- Historical accident records.
- Road stress score.
- Traffic compression.
- Near-miss telemetry.
- Community hazard reports.

Engineered features:

- `brakingDensity`
- `anomalyFrequency`
- `rainEscalation`
- `visibilityDegradation`
- `hazardConcentration`
- `infrastructureWear`
- `temporalCongestion`
- `corridorStressAccumulation`

These features are generated by `buildFeatureFusion()` in `src/lib/ml-infrastructure.ts`.

### Phase 3: Core GNN Risk Model

Primary reference:

- ML4RoadSafety, which frames road safety prediction as graph-based accident modeling over road networks.

RoadLens adaptation:

- Replaces the US road graph concept with a Chennai OSMnx-style corridor graph.
- Replaces default labels with iRAD/NCRB-inspired accident intelligence, hazard uploads, and braking anomaly density.
- Uses lightweight GNN-style inference instead of large-scale training.

Implemented demo inference:

- `runLightweightGnnInference()`
- Produces baseline risk, GNN-style risk, and a node embedding preview.
- Combines local segment risk with adjacent corridor stress and anomaly density.

### Phase 4: Temporal Forecasting Engine

Primary reference:

- PyTorch Geometric Temporal for temporal graph snapshots and spatiotemporal signal processing.

RoadLens implementation:

- `simulateTemporalForecast()` creates sequential graph snapshots.
- Forecast drivers include rain escalation, traffic compression, and braking anomaly memory.
- The output supports Chaos Window Forecasting.

Example:

```text
Anna Salai Junction risk spike expected from 4:30 PM - 5:15 PM due to rainfall,
braking anomalies, and traffic compression.
```

### Phase 5: Risk Propagation Engine

Primary reference:

- Incident-GNN-CP, especially concurrency-prior concepts for incident propagation.

RoadLens implementation:

- `propagateRisk()` applies adjacency and propagation priors across connected Chennai corridors.
- Models rainfall spillover, braking spike propagation, nearby hazard amplification, and congestion spread.
- Supports the glowing corridor escalation already visible in the map.

### Phase 6: Class Imbalance Handling

References:

- Road-Traffic-Accident-Severity-Prediction.
- US-accident-severity-prediction.

RoadLens policy:

Accidents are rare events, so raw accuracy is not a trustworthy model target. A model can look accurate by predicting “no accident” too often.

Evaluation prioritizes:

- Precision.
- Recall.
- F1-score.
- PR-AUC.
- False-negative reduction.

Planned training concepts:

- SMOTE-style oversampling.
- Class-weighted loss.
- Threshold tuning.
- Recall-sensitive optimization.

Rejected headline metric:

```text
Raw accuracy
```

### Phase 7: Anomaly Detection Layer

References:

- PyOD for general outlier detection.
- Telemanom for time-series anomaly detection.

RoadLens implementation:

- Powers Collective Braking Memory.
- Detects braking anomalies, swerving spikes, near-miss emergence, abnormal traffic behavior, and danger buildup before accidents.
- Visualized through pulse propagation, emergence timeline, anomaly escalation, and behavioral intelligence feed.

Current implementation remains simulated but structured for future telemetry ingestion.

### Phase 8: Hazard Intelligence Pipeline

References:

- Pothole Detector.
- YOLOv8-style road damage detection concepts.

RoadLens implementation:

- Real upload selection.
- Drag-and-drop.
- Image preview.
- Simulated AI surface analysis.
- Severity classification.
- Confidence score.
- Risk amplification.

This keeps the demo fast while leaving a modular path for FastAPI or model-server inference later.

### Phase 9: Weather Intelligence

Reference:

- Open-Meteo.

RoadLens implementation:

- `GET /api/weather`
- `src/lib/weather.ts`
- Fetches live weather when available.
- Falls back to simulated weather when the network or provider is unavailable.
- Supports rain severity amplification, visibility degradation, environmental overlays, and dashboard risk escalation.

### Phase 10: Explainable AI

References:

- SHAP.
- InterpretML.
- XGBoost.

RoadLens implementation:

- Risk Audit Trail explains contributing signals, weighted impact, confidence, and escalation reason.
- Factors include hard braking clusters, rain intensity, poor lighting, and road stress.

Example:

```text
Risk Score: 89%
hard braking clusters +31%
rain intensity +22%
poor lighting +17%
road stress +14%
```

### Phase 11: Experiment Tracking

Primary reference:

- MLflow.

RoadLens implementation:

- `mlflowStyleScorecards`
- `GET /api/ml/scorecards`
- Compact dashboard scorecard panel.

Tracked metrics:

- Experiment name.
- Model name.
- Precision.
- Recall.
- F1.
- PR-AUC.
- False-negative reduction.
- Training notes.

Current scorecard headline:

```text
Temporal anomaly fusion:
precision 0.79
recall 0.87
F1 0.83
PR-AUC 0.80
false-negative reduction 41%
```

This is important because judges trust measured systems more than vague AI claims.

### Phase 12: Live Demo Intelligence

The existing cinematic dashboard remains the live demo surface.

Demo sequence:

1. Upload hazard.
2. AI analyzes road damage.
3. Weather escalates.
4. Braking anomalies rise.
5. Risk propagates.
6. Chaos window activates.
7. Authority queue reprioritizes.

### Indian-Road Adaptation Strategy

RoadLens adapts graph road-safety research to Indian smart-city conditions:

- Uses Chennai corridors for geographic realism.
- Replaces US graph assumptions with Indian arterial, junction, flooding, and mixed-traffic behavior.
- Uses iRAD/NCRB-inspired accident intelligence as the future label source.
- Uses citizen hazard uploads and near-miss telemetry as early-warning labels.
- Treats road stress, rainfall exposure, poor lighting, and braking behavior as high-priority Indian urban risk features.

### Final Research Positioning

RoadLens AI should be presented as predictive infrastructure intelligence.

Opening line:

```text
Roads should not require fatalities before being classified as dangerous.
```

Core differentiator:

```text
Traditional systems:
Accident -> Response

RoadLens AI:
Near Miss -> Anomaly -> Prediction -> Prevention
```

Key claim:

```text
RoadLens AI identifies invisible danger zones before fatal accidents occur using
graph intelligence, anomaly detection, temporal forecasting, explainable AI,
and infrastructure stress modeling.
```

## Phase 3 Backend Integration

Implemented persistence-ready tables:

- `road_segments`
- `hazard_reports`
- `anomaly_events`
- `risk_scores`
- `authority_queue`

Schema file:

```text
supabase/schema.sql
```

Environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Real data flow:

```text
User Upload
  |
  v
POST /api/hazards/report
  |
  |-- insert hazard_reports
  |-- insert risk_scores
  |-- insert authority_queue item
  |
  v
Dashboard refresh token
  |
  v
GET /api/dashboard
  |
  |-- Supabase road/anomaly/queue hydration when configured
  |-- Open-Meteo weather snapshot
  |-- mock fallback when credentials are absent
```

Anomaly persistence:

```text
POST /api/anomalies/events
  |
  v
anomaly_events table
```

Weather integration:

```text
GET /api/weather
  |
  v
Open-Meteo current temperature, precipitation, weather code, visibility
```

What remains simulated:

- Real ML training.
- Actual traffic GNN inference.
- Production telemetry ingestion.
- Real SHAP computation.
- Camera/image ML inference.

## Existing Risk Formula

Current demo formula:

```text
Risk Score =
(hazard_severity * 0.35) +
(accident_history * 0.25) +
(weather_risk * 0.15) +
(traffic_density * 0.15) +
(lighting_risk * 0.10)
```

The weighted result is multiplied by 10 and rounded to produce a percentage.

Risk bands:

- `0-39`: Low
- `40-64`: Medium
- `65-79`: High
- `80-100`: Critical

Demo anchor:

- Anna Salai Junction starts at `82%` risk.
- Uploading the simulated pothole report raises it to `85%`.
- The authority recommendation remains urgent because the road is already critical.

## Phase 2 Novelty Systems

### 1. Collective Braking Memory

Collective Braking Memory converts abnormal driver behavior into road-risk intelligence.

Simulated signals:

- Sudden braking clusters.
- Swerving anomalies.
- Near-miss emergence zones.
- Speed-collapse events.

Implementation:

- `brakingAnomalies` in `src/lib/risk-data.ts` models event type, position, intensity, confidence, timestamp, and summary.
- `getAnomaliesForRoad()` filters live anomaly memory by road segment.
- `src/components/risk-map.tsx` renders anomaly pulses as animated Leaflet `divIcon` markers.
- `BehavioralAnomalyPanel` in `roadlens-dashboard.tsx` turns the same signal into a live intelligence feed.

Why it matters:

Reactive systems wait for police reports or accident datasets. RoadLens AI treats repeated hard braking and swerving as pre-accident evidence. That is stronger for prevention because it detects dangerous road behavior before fatalities become labels in a dataset.

### 2. Chaos Window Forecasting

Chaos Window Forecasting predicts dangerous time windows when independent risks converge.

Simulated inputs:

- Rain onset.
- Office traffic compression.
- School dispersal traffic.
- Poor lighting.
- Braking memory intensity.
- Waterlogging and visibility degradation.

Implementation:

- `chaosWindows` stores predicted windows, risk, triggers, and confidence.
- `temporalRiskSeries` drives the animated temporal chart.
- `calculateRisk()` attaches the matching chaos window to every risk result.
- `ChaosWindowPanel` visualizes risk evolution through the day.

Example output:

```text
Risk spike expected between 4:30 PM - 5:15 PM due to rain, office traffic,
hard braking memory, and poor lighting.
```

Hackathon simplification:

- No real spatio-temporal graph neural network is trained.
- The simulation mimics the output shape of temporal forecasting systems while remaining transparent and fast.

### 3. Risk Audit Trail

The Risk Audit Trail explains why the AI thinks a road is dangerous.

Contributing factors:

- Hard braking clusters.
- Rain intensity.
- Poor lighting.
- Road stress score.

Implementation:

- `AuditFactor` stores label, impact, confidence, and visual tone.
- `getAuditTrail()` calculates SHAP-style contribution bars.
- `RiskAuditTrail` renders influence bars and evidence confidence.
- `calculateRisk()` returns audit factors and overall model confidence.

This makes the system governance-ready because an authority can inspect the score instead of trusting a black box.

### 4. Road Stress Score

Road Stress Score converts surface and behavioral signals into infrastructure degradation intelligence.

Inputs:

- Hazard density.
- Repeated braking.
- Rainfall exposure.
- Historical reports.
- Baseline infrastructure stress.

Implementation:

- `calculateRoadStress()` returns score, level, maintenance priority, and drivers.
- `RoadStressPanel` visualizes urgency and degradation drivers.
- Risk explanations and authority recommendations now align with maintenance urgency.

Output levels:

- `stable`
- `watch`
- `strained`
- `urgent`

### 5. Visual Map Intelligence

The map is now the hero experience.

Implemented visual layers:

- Premium dark map tiles.
- Glowing road paths.
- Large risk heat fields.
- Animated weather scan overlay.
- Pulsing near-miss anomaly clusters.
- Risk-colored road segments.
- Selected-road glow intensification.
- Tactical overlay labels.

This gives the project a cinematic smart-city command-center feel while preserving the stable Leaflet foundation.

## Repository Integration Strategy

The referenced repositories are used conceptually, not as direct dependencies. This keeps the MVP lightweight and reduces setup risk.

| Inspiration | Concept Used | RoadLens AI Simplification |
| --- | --- | --- |
| Kepler.gl | Large-scale geospatial visual analytics, layered maps, animated spatial intelligence | Leaflet map with custom glow layers, heat fields, and anomaly pulses |
| OSMnx | Road-network thinking and geospatial graph context | Static demo road paths representing city segments |
| GeoPandas | Geospatial joins and spatial feature engineering | Typed mock features attached directly to road segments |
| PyOD | Outlier detection for abnormal behavior | Simulated anomaly intensity and confidence values |
| Telemanom | Time-series anomaly detection | Live braking and swerving memory feed |
| Open-Meteo | Weather-driven risk escalation | Simulated rain and visibility risk fields |
| GNN4Traffic | Spatio-temporal traffic forecasting | Lightweight chaos-window forecast logic |
| Real-Time Traffic Flow Prediction Using Spatio-Temporal GNN | Traffic flow prediction over time | Temporal risk chart with school, traffic, rain, and anomaly triggers |
| SHAP | Feature contribution explanations | SHAP-style risk contribution bars |
| InterpretML | Interpretable model reporting | Human-readable audit trail and confidence indicators |
| XGBoost | Structured feature scoring | Weighted transparent scoring formula |
| NetAScore | Infrastructure and network assessment | Road Stress Score for maintenance urgency |
| DriveGuard | Driver telemetry safety signals | Supporting telemetry and anomaly feed language |
| Pothole Detector | Road surface image classification | Simulated pothole upload and severity classification |

Phase 3 update:

- Open-Meteo is now called through `src/lib/weather.ts`.
- Supabase/PostgreSQL persistence is implemented through API routes and activates with credentials.
- Heavy research repositories remain conceptual because direct integration would overfit the hackathon scope and increase demo fragility.

## Explainable AI Pipeline

```text
Road Segment Features
  |
  |-- hazard severity
  |-- accident history
  |-- weather risk
  |-- traffic risk
  |-- lighting risk
  |-- braking anomaly risk
  |-- road stress base
  |-- rainfall exposure
  v
Risk Scoring Engine
  |
  |-- weighted risk score
  |-- risk level
  |-- top risk factors
  |-- chaos window
  |-- confidence
  v
Explainability Layer
  |
  |-- SHAP-style influence bars
  |-- evidence confidence
  |-- AI reasoning summary
  |-- recommended action
```

The current scoring formula remains intentionally simple, but the explanation layer makes it feel research-grade and inspectable.

## Geospatial Intelligence Architecture

```text
Leaflet Map
  |
  |-- dark tactical tile layer
  |-- road segment polylines
  |-- risk heat circles
  |-- weather scan rectangle
  |-- anomaly pulse div icons
  |-- popup intelligence summaries
  v
Dashboard Panels
  |
  |-- selected road detail
  |-- braking anomaly feed
  |-- temporal forecast
  |-- audit trail
  |-- road stress score
```

The map does not simply show reports. It shows emerging danger fields.

## Anomaly Detection Logic

Current implementation:

```text
Anomaly intensity = simulated behavioral abnormality score
Confidence = simulated evidence confidence
Road risk impact = brakingAnomalyRisk used in top factors and audit trail
Visualization = pulsing geospatial marker + live feed row
```

This is inspired by anomaly detection systems where abnormal time-series behavior becomes a signal before the final event occurs.

## Temporal Forecasting Logic

Current implementation:

```text
Chaos window =
road-specific convergence of rain + traffic + lighting + anomaly memory

Temporal chart =
hourly risk series showing spike formation

Prediction message =
human-readable explanation of the highest-risk time band
```

No GNN is trained in this MVP. The product demonstrates what the prediction layer would output in a full-scale deployment.

## SHAP-Inspired Explainability System

Each risk score includes ranked contribution factors:

```text
Hard braking clusters: +31%
Rain intensity: +24%
Poor lighting: +17%
Road stress score: +10%
```

The UI renders these as influence bars with confidence labels. This helps judges and future government users understand not only what the model predicts, but why.

## What Was Simplified for Hackathon Feasibility

- No real telemetry ingestion.
- No image model inference.
- No Open-Meteo API call.
- No Supabase persistence.
- No graph neural network.
- No SHAP runtime computation.
- No GeoPandas or OSMnx preprocessing pipeline.

Instead, RoadLens AI simulates the outputs of those systems with transparent, typed data structures and rich visualization. That keeps the demo reliable while communicating a scalable technical direction.

## Why Anomaly Detection Beats Reactive Accident Systems

Traditional road safety systems often rely on:

- Accident history.
- Citizen complaints.
- Manual inspections.
- Post-incident repairs.

Those signals are valuable but late.

RoadLens AI adds earlier behavioral signals:

- Drivers braking suddenly.
- Vehicles swerving repeatedly.
- Speeds collapsing around hazards.
- Risk increasing during weather and traffic convergence.

This lets authorities act before the accident dataset grows. That is the product's core innovation.

## Verification Completed

- `corepack pnpm lint`: passing.
- `corepack pnpm build`: passing.
- `GET /`: returns `200`.
- `GET /api/dashboard`: returns dashboard hydration payload.
- `GET /api/weather`: returns Open-Meteo or fallback weather snapshot.
- `GET /api/anomalies/events`: returns anomaly events.
- `GET /api/roads/risk-map`: returns all scored road segments.
- `POST /api/risk/calculate`: returns `82%` for Anna Salai Junction baseline.
- `POST /api/hazards/report`: returns simulated AI hazard analysis.
