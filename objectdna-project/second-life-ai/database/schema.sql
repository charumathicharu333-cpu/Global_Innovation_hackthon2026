-- PostgreSQL-ready persistence model for ObjectDNA.
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  object_name TEXT NOT NULL,
  category TEXT NOT NULL,
  confidence NUMERIC(5,2) NOT NULL,
  condition_label TEXT NOT NULL,
  condition_score INTEGER NOT NULL,
  source_label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_result JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  material TEXT NOT NULL,
  reuse_potential TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  pathway_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_cost TEXT,
  effort TEXT,
  skill TEXT,
  time TEXT,
  life_path_score INTEGER NOT NULL,
  scores JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  pathway_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  steps JSONB NOT NULL
);
