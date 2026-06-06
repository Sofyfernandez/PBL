import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && url !== 'your_supabase_url' && key !== 'your_supabase_anon_key');
}

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no configurado. Agrega las variables de entorno en .env.local');
  }
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _client;
}

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
  const { data, error } = await getClient()
    .from('demanda_historial')
    .select('*')
    .order('año')
    .order('mes');
  if (error) throw error;
  return data ?? [];
}

export async function getDemandaAnual(): Promise<number> {
  const { data, error } = await getClient()
    .from('demanda_historial')
    .select('cantidad_kg');
  if (error) throw error;
  const total = (data ?? []).reduce((acc, row) => acc + (row.cantidad_kg ?? 0), 0);
  return total;
}

// ── Escenarios ────────────────────────────────────────────────────────────

export async function getEscenarios(): Promise<Escenario[]> {
  const { data, error } = await getClient()
    .from('escenarios')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function saveEscenario(escenario: Omit<Escenario, 'id' | 'created_at'>): Promise<void> {
  const { error } = await getClient().from('escenarios').insert([escenario]);
  if (error) throw error;
}

export async function deleteEscenario(id: number): Promise<void> {
  const { error } = await getClient().from('escenarios').delete().eq('id', id);
  if (error) throw error;
}
