-- ============================================================
-- Tablas Supabase — Simulador EOQ RICOL SAS
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Tabla 1: Historial de demanda mensual
CREATE TABLE IF NOT EXISTS demanda_historial (
  id            BIGSERIAL PRIMARY KEY,
  referencia    TEXT        NOT NULL,
  mes           SMALLINT    NOT NULL CHECK (mes BETWEEN 1 AND 12),
  año           SMALLINT    NOT NULL,
  cantidad_kg   NUMERIC     NOT NULL
);

-- Tabla 2: Escenarios guardados
CREATE TABLE IF NOT EXISTS escenarios (
  id          BIGSERIAL PRIMARY KEY,
  nombre      TEXT      NOT NULL,
  "D"         NUMERIC   NOT NULL,
  "S"         NUMERIC   NOT NULL,
  "Q_star"    NUMERIC   NOT NULL,
  "TC"        NUMERIC   NOT NULL,
  "N"         NUMERIC   NOT NULL,
  "T"         NUMERIC   NOT NULL,
  "ROP"       NUMERIC   NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: habilitar acceso público de lectura/escritura (ajustar en producción)
ALTER TABLE demanda_historial ENABLE ROW LEVEL SECURITY;
ALTER TABLE escenarios        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_demanda"    ON demanda_historial FOR SELECT USING (true);
CREATE POLICY "anon_read_escenarios" ON escenarios        FOR SELECT USING (true);
CREATE POLICY "anon_insert_escenarios" ON escenarios      FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_delete_escenarios" ON escenarios      FOR DELETE USING (true);
