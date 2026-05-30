create extension if not exists "pgcrypto";

create table if not exists road_segments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  city text not null,
  area text not null,
  latitude double precision not null,
  longitude double precision not null,
  road_type text not null,
  lighting_condition text not null,
  traffic_density text not null,
  hazard_severity integer not null default 1,
  accident_history integer not null default 1,
  weather_risk integer not null default 1,
  traffic_risk integer not null default 1,
  lighting_risk integer not null default 1,
  braking_anomaly_risk integer not null default 1,
  road_stress_base integer not null default 1,
  rainfall_exposure integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists hazard_reports (
  id uuid primary key default gen_random_uuid(),
  road_segment_id uuid references road_segments(id) on delete cascade,
  road_segment_slug text,
  hazard_type text not null,
  description text,
  image_url text,
  latitude double precision,
  longitude double precision,
  severity integer not null default 5,
  status text not null default 'verified',
  created_at timestamptz not null default now()
);

create table if not exists anomaly_events (
  id uuid primary key default gen_random_uuid(),
  road_segment_id uuid references road_segments(id) on delete cascade,
  road_segment_slug text,
  anomaly_type text not null,
  latitude double precision,
  longitude double precision,
  intensity integer not null default 50,
  confidence integer not null default 75,
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists risk_scores (
  id uuid primary key default gen_random_uuid(),
  road_segment_id uuid references road_segments(id) on delete cascade,
  road_segment_slug text,
  risk_score integer not null,
  risk_level text not null,
  top_factors jsonb not null default '[]'::jsonb,
  audit_trail jsonb not null default '[]'::jsonb,
  ai_explanation text,
  recommended_action text,
  confidence integer not null default 80,
  calculated_at timestamptz not null default now()
);

create table if not exists authority_queue (
  id uuid primary key default gen_random_uuid(),
  road_segment_id uuid references road_segments(id) on delete cascade,
  road_segment_slug text,
  action_type text not null,
  priority text not null,
  status text not null default 'pending',
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists hazard_reports_segment_idx on hazard_reports(road_segment_slug);
create index if not exists anomaly_events_segment_idx on anomaly_events(road_segment_slug);
create index if not exists risk_scores_segment_idx on risk_scores(road_segment_slug);
create index if not exists authority_queue_segment_idx on authority_queue(road_segment_slug);
