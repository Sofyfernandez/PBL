// Fuente única de verdad matemática — modelo EOQ RICOL SAS
// Fórmulas exclusivamente del cuaderno PBL_Optimizacion_RICOL.ipynb

// ── Parámetros fijos del modelo ───────────────────────────────────────────
export const PARAMS = {
  H: 2_000,    // Costo de mantener por kg/año (COP/kg/año)
  B: 500,      // Capacidad total de bodega (m²)
  f: 0.005,    // Factor de espacio (m²/kg)
  L: 30,       // Lead time de importación (días)
} as const;

// Q_cap = B / f
export const Q_CAP = PARAMS.B / PARAMS.f; // 100 000 kg

// ── Valores base del modelo ───────────────────────────────────────────────
export const BASE = {
  D: 859_300,    // Demanda anual histórica PEAD Alta Soplado (kg/año)
  S: 6_000_000,  // Costo de pedir por orden (COP/pedido)
} as const;

// ── Tipos ─────────────────────────────────────────────────────────────────
export interface EOQResult {
  Qstar: number;
  Qfinal: number;
  N: number;
  T: number;
  TC: number;
  costoPedir: number;
  costoMantener: number;
  ROP: number;
  restriccionActiva: boolean;
}

// ── Función principal del modelo ──────────────────────────────────────────
// Implementa exactamente las fórmulas del notebook sección 4
export function calcEOQ(D: number, S: number): EOQResult {
  const { H, L } = PARAMS;

  // Lote económico óptimo — Fórmula de Wilson
  const Qstar = Math.sqrt((2 * D * S) / H);

  // Restricción R1 — capacidad de bodega
  const restriccionActiva = Qstar > Q_CAP;
  const Qfinal = restriccionActiva ? Q_CAP : Qstar;

  // Indicadores derivados
  const N = D / Qfinal;
  const T = 365 / N;
  const costoPedir = (D / Qfinal) * S;
  const costoMantener = (Qfinal / 2) * H;
  const TC = costoPedir + costoMantener;

  // Punto de reorden: d = D/365, ROP = d * L
  const d = D / 365;
  const ROP = d * L;

  return { Qstar, Qfinal, N, T, TC, costoPedir, costoMantener, ROP, restriccionActiva };
}

// ── Función de costo total para graficar TC(Q) ────────────────────────────
export function tcCurve(Q: number, D: number, S: number): number {
  const { H } = PARAMS;
  return (D / Q) * S + (Q / 2) * H;
}

export function costoPedirPoint(Q: number, D: number, S: number): number {
  return (D / Q) * S;
}

export function costoMantenerPoint(Q: number): number {
  return (Q / 2) * PARAMS.H;
}

// ── Curva Q*(D) con S fijo ────────────────────────────────────────────────
export function qStarOfD(D: number, S: number): number {
  return Math.sqrt((2 * D * S) / PARAMS.H);
}

// ── Curva Q*(S) con D fijo ────────────────────────────────────────────────
export function qStarOfS(D: number, S: number): number {
  return Math.sqrt((2 * D * S) / PARAMS.H);
}
