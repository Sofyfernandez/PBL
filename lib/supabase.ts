import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Tipos de tablas ───────────────────────────────────────────────────────

export interface DemandaHistorial {
  id?: number;
  referencia: string;
  mes: number;    // 1–12
  año: number;
  cantidad_kg: number;
}

export interface Escenario {
  id?: number;
  nombre: string;
  D: number;
  S: number;
  Q_star: number;
  TC: number;
  N: number;
  T: number;
  ROP: number;
  created_at?: string;
}

// ── Historial de demanda ──────────────────────────────────────────────────

export async function getDemandaHistorial(): Promise<DemandaHistorial[]> {
  const { data, error } = await supabase
    .from('demanda_historial')
    .select('*')
    .order('año')
    .order('mes');
  if (error) throw error;
  return data ?? [];
}

export async function getDemandaAnual(): Promise<number> {
  const { data, error } = await supabase
    .from('demanda_historial')
    .select('cantidad_kg');
  if (error) throw error;
  const total = (data ?? []).reduce((acc, row) => acc + (row.cantidad_kg ?? 0), 0);
  return total;
}

// ── Escenarios ────────────────────────────────────────────────────────────

export async function getEscenarios(): Promise<Escenario[]> {
  const { data, error } = await supabase
    .from('escenarios')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function saveEscenario(escenario: Omit<Escenario, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('escenarios').insert([escenario]);
  if (error) throw error;
}

export async function deleteEscenario(id: number): Promise<void> {
  const { error } = await supabase.from('escenarios').delete().eq('id', id);
  if (error) throw error;
}
