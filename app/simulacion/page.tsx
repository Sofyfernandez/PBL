'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { calcEOQ, BASE, PARAMS } from '@/lib/eoq';
import TopBar from '@/components/TopBar';
import { IconInfo } from '@/components/Icons';

const ChartTC = dynamic(() => import('@/components/ChartTC'), { ssr: false });

const fmt  = (v: number) => Math.round(v).toLocaleString('es-CO');
const fmt1 = (v: number) => v.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function SimulacionPage() {
  const [D, setD] = useState<number>(BASE.D);
  const [S, setS] = useState<number>(BASE.S);
  const [H, setH] = useState<number>(PARAMS.H);
  const [L, setL] = useState<number>(PARAMS.L);

  const base = calcEOQ(BASE.D, BASE.S);
  const sim  = calcEOQ(D, S);

  const delta = (a: number, b: number) => {
    const pct = ((b - a) / a) * 100;
    return { pct: pct.toFixed(1), up: pct >= 0 };
  };

  const kpis = [
    { label: 'Lote Económico (Q*)', base: `${fmt(base.Qfinal)} kg`, sim: `${fmt(sim.Qfinal)} kg`, ...delta(base.Qfinal, sim.Qfinal) },
    { label: 'Costo Total Anual (TC)', base: `$${fmt(base.TC)}`, sim: `$${fmt(sim.TC)}`, ...delta(base.TC, sim.TC) },
    { label: 'Punto de Re-orden (ROP)', base: `${fmt(base.ROP)} kg`, sim: `${fmt(sim.ROP)} kg`, ...delta(base.ROP, sim.ROP) },
    { label: 'Pedidos al Año (N)', base: fmt1(base.N), sim: fmt1(sim.N), ...delta(base.N, sim.N) },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Simulador de Escenarios" />

      <main className="flex-1 p-6 grid grid-cols-[280px_1fr] gap-5">

        {/* Variables Críticas */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5 h-fit">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Variables Críticas</p>
            <button onClick={() => { setD(BASE.D); setS(BASE.S); setH(PARAMS.H); setL(PARAMS.L); }}
              className="text-xs text-blue-600 font-semibold hover:underline">Reset</button>
          </div>

          {[
            { label: 'Demanda Anual (D)', value: D, set: setD, min: 400000, max: 1500000, step: 1000, fmt: (v: number) => `${fmt(v)}` },
            { label: 'Costo por Pedido (S)', value: S, set: setS, min: 1000000, max: 15000000, step: 100000, fmt: (v: number) => `$${fmt(v)}` },
            { label: 'Costo Mantenimiento (H)', value: H, set: setH, min: 500, max: 10000, step: 100, fmt: (v: number) => `$${fmt(v)}` },
            { label: 'Lead Time (L)', value: L, set: setL, min: 5, max: 90, step: 1, fmt: (v: number) => `${v} dias` },
          ].map(p => (
            <div key={p.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">{p.label}</span>
                <span className="text-blue-600 font-bold">{p.fmt(p.value)}</span>
              </div>
              <input type="range" min={p.min} max={p.max} step={p.step} value={p.value}
                onChange={e => p.set(+e.target.value)} className="w-full accent-blue-600" />
            </div>
          ))}

          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 border border-blue-200 flex gap-2">
            <IconInfo size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <span><span className="font-bold">Ajustar el Lead Time</span> impactará directamente el Punto de Re-orden (ROP).</span>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex flex-col gap-5">

          {/* Gráfica TC */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Impacto en Costos Totales — Comparativa
            </p>
            <div className="h-56">
              <ChartTC D={D} S={S} Qstar={sim.Qstar} Qfinal={sim.Qfinal} />
            </div>
          </div>

          {/* Tabla KPIs comparativa */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="grid grid-cols-4 gap-3 text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
              <span>Métrica KPI</span>
              <span>Estado Actual</span>
              <span>Escenario Simulado</span>
              <span>Desviación</span>
            </div>
            {kpis.map(k => (
              <div key={k.label} className="grid grid-cols-4 gap-3 py-3 border-b border-gray-50 items-center">
                <span className="text-sm text-gray-700 font-medium">{k.label}</span>
                <span className="text-sm text-gray-500 tabular-nums">{k.base}</span>
                <span className="text-sm font-bold text-blue-700 tabular-nums">{k.sim}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit tabular-nums ${
                  k.up ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                }`}>
                  {k.up ? '+' : ''}{k.pct}%
                </span>
              </div>
            ))}
          </div>

        </div>
      </main>

      <p className="text-center text-[10px] text-gray-300 pb-4 tracking-widest uppercase">
        Entorno de Simulación Activo · RICOL V1.0
      </p>
    </div>
  );
}
