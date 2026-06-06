'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { calcEOQ, BASE, Q_CAP } from '@/lib/eoq';
import { getDemandaAnual, getEscenarios, isSupabaseConfigured, Escenario } from '@/lib/supabase';
import TopBar from '@/components/TopBar';
import EscenariosPanel from '@/components/EscenariosPanel';

const ChartTC   = dynamic(() => import('@/components/ChartTC'),   { ssr: false });
const ChartQvsD = dynamic(() => import('@/components/ChartQvsD'), { ssr: false });
const ChartQvsS = dynamic(() => import('@/components/ChartQvsS'), { ssr: false });

const fmt  = (v: number) => Math.round(v).toLocaleString('es-CO');
const fmt1 = (v: number) => v.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function DashboardPage() {
  const [D, setD] = useState<number>(BASE.D);
  const [S, setS] = useState<number>(BASE.S);
  const [grafica, setGrafica] = useState<'tc' | 'd' | 's'>('tc');
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);
  const [supabaseOk, setSupabaseOk] = useState(true);

  const result = calcEOQ(D, S);

  useEffect(() => {
    if (!isSupabaseConfigured()) { setSupabaseOk(false); return; }
    getDemandaAnual().then(d => { if (d > 0) setD(d); }).catch(() => {});
    loadEscenarios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEscenarios = useCallback(async () => {
    try { setEscenarios(await getEscenarios()); } catch { /* sin supabase */ }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="RICOL SAS" subtitle="Simulador EOQ · PEAD Alta Soplado" />

      <main className="flex-1 p-6 flex flex-col gap-5">

        {/* ── Fila superior: sliders + KPIs ── */}
        <div className="grid grid-cols-[300px_1fr] gap-4">

          {/* Sliders */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Parámetros Variables</p>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Demanda Anual (D)</span>
                <span className="text-blue-600 font-bold">{fmt(D)} kg</span>
              </div>
              <input type="range" min={400000} max={1500000} step={1000} value={D}
                onChange={e => setD(+e.target.value)} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Costo de Pedir (S)</span>
                <span className="text-blue-600 font-bold">${(S/1e6).toFixed(1)}M</span>
              </div>
              <input type="range" min={1000000} max={15000000} step={100000} value={S}
                onChange={e => setS(+e.target.value)} className="w-full accent-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">H (Mantenimiento)</p>
                <p className="text-sm font-bold text-gray-700 mt-1">$2,000</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">L (Lead Time)</p>
                <p className="text-sm font-bold text-gray-700 mt-1">30 Días</p>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-3">

            {/* Q* */}
            <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Q* (kg/pedido)</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums">{fmt(result.Qstar)}</p>
              <div className="w-full bg-blue-100 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, (result.Qfinal / Q_CAP) * 100)}%` }} />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${result.restriccionActiva ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                {result.restriccionActiva ? 'RESTRINGIDO' : 'FACTIBLE'}
              </span>
            </div>

            {/* N */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">N (pedidos/año)</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums">{fmt1(result.N)}</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, (result.N / 24) * 100)}%` }} />
              </div>
              <span className="text-xs text-green-600 font-semibold">⊙ CICLO OPTIMIZADO</span>
            </div>

            {/* T */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">T (Tiempo entre pedidos)</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums">{fmt1(result.T)} <span className="text-lg font-normal text-gray-400">d</span></p>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, (result.T / 60) * 100)}%` }} />
              </div>
            </div>

            {/* TC */}
            <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm p-4 flex flex-col gap-1">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">TC (COP/año)</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">${(result.TC / 1e6).toFixed(1)}M</p>
              <p className="text-xs text-gray-400">Suma de costos totales</p>
            </div>

            {/* ROP */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">ROP (Punto de Reorden)</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(result.ROP)} kg</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${result.restriccionActiva ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                {result.restriccionActiva ? '⚠ NIVEL DE ALERTA' : '✓ NIVEL SEGURO'}
              </span>
            </div>

            {/* Eficiencia */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1 items-center justify-center">
              <div className="text-3xl text-blue-600">✓</div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">Estado de Operación</p>
              <p className="text-sm font-bold text-gray-800">
                Eficiencia {(Math.min(100, (result.Qfinal / result.Qstar) * 100)).toFixed(1)}%
              </p>
            </div>

          </div>
        </div>

        {/* ── Gráfica ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Visualización de Sensibilidad</p>
            <select value={grafica} onChange={e => setGrafica(e.target.value as typeof grafica)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer">
              <option value="tc">Curva de equilibrio — TC vs Q</option>
              <option value="d">Pulso del mercado — Q* vs Demanda D</option>
              <option value="s">Presión logística — Q* vs Costo de Pedir S</option>
            </select>
          </div>
          <div className="h-72">
            {grafica === 'tc' && <ChartTC D={D} S={S} Qstar={result.Qstar} Qfinal={result.Qfinal} />}
            {grafica === 'd'  && <ChartQvsD D={D} S={S} />}
            {grafica === 's'  && <ChartQvsS D={D} S={S} />}
          </div>
        </div>

        {/* ── Escenarios ── */}
        {supabaseOk && (
          <EscenariosPanel D={D} S={S} result={result} escenarios={escenarios} onSaved={loadEscenarios} />
        )}

      </main>
    </div>
  );
}
