'use client';

const fmt = (v: number) => Math.round(v).toLocaleString('es-CO');

interface Props {
  dReal: number | null;
  dActual: number;
}

export default function DemandaBanner({ dReal, dActual }: Props) {
  if (!dReal) return null;

  const diff = dActual - dReal;
  const pct = ((diff / dReal) * 100).toFixed(1);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center gap-4 text-sm">
      <span className="text-blue-800 font-semibold">
        📦 Demanda real histórica (Supabase):
      </span>
      <span className="text-blue-700 font-bold tabular-nums">{fmt(dReal)} kg/año</span>
      {diff !== 0 && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          diff > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
        }`}>
          {diff > 0 ? '+' : ''}{pct}% vs. slider actual
        </span>
      )}
    </div>
  );
}
