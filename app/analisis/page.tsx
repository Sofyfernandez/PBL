'use client';

import dynamic from 'next/dynamic';
import { calcEOQ, BASE, Q_CAP } from '@/lib/eoq';
import TopBar from '@/components/TopBar';

const ChartQvsD = dynamic(() => import('@/components/ChartQvsD'), { ssr: false });
const ChartQvsS = dynamic(() => import('@/components/ChartQvsS'), { ssr: false });
const ChartTC   = dynamic(() => import('@/components/ChartTC'),   { ssr: false });

const fmt  = (v: number) => Math.round(v).toLocaleString('es-CO');
const fmt1 = (v: number) => v.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const base = calcEOQ(BASE.D, BASE.S);
const eficienciaBodega = ((base.Qfinal / Q_CAP) * 100).toFixed(1);

export default function AnalisisPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="RICOL SAS" subtitle="Simulador EOQ · PEAD Alta Soplado" />

      <main className="flex-1 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Análisis: PEAD Alta Soplado</h2>
            <p className="text-sm text-gray-400 mt-1">Optimización detallada para la referencia estratégica de polietileno.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">Mar 2025 – Mar 2026</span>
          </div>
        </div>

        {/* KPIs superiores */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Lote óptimo Q*', value: `${fmt(base.Qstar)} kg`, sub: 'Fórmula de Wilson', color: 'blue' },
            { label: 'Pedidos al año (N)', value: fmt1(base.N), sub: '~1 pedido/mes', color: 'green' },
            { label: 'Costo total anual (TC)', value: `$${fmt(base.TC)}`, sub: 'Costo mínimo alcanzable', color: 'blue' },
            { label: 'Punto de reorden (ROP)', value: `${fmt(base.ROP)} kg`, sub: `Lead time = 30 días`, color: 'purple' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{k.label}</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums mt-1">{k.value}</p>
              <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Gráficas de sensibilidad */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Zona óptima — TC vs Q</p>
            <p className="text-xs text-gray-400 mb-4">Las tres curvas de costo convergen en Q*</p>
            <div className="h-52">
              <ChartTC D={BASE.D} S={BASE.S} Qstar={base.Qstar} Qfinal={base.Qfinal} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pulso del mercado — Q* vs D</p>
            <p className="text-xs text-gray-400 mb-4">Sensibilidad del lote óptimo ante cambios en la demanda</p>
            <div className="h-52">
              <ChartQvsD D={BASE.D} S={BASE.S} />
            </div>
          </div>
        </div>

        {/* Análisis bodega + sensibilidad S */}
        <div className="grid grid-cols-[1fr_1fr] gap-4">

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Presión logística — Q* vs S</p>
            <div className="h-52">
              <ChartQvsS D={BASE.D} S={BASE.S} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Eficiencia en Almacenamiento (PEAD)</p>

            <div className="flex flex-col gap-3">
              {[
                { label: 'Capacidad bodega (Q_cap)', value: `${fmt(Q_CAP)} kg`, pct: 100, color: 'bg-gray-200' },
                { label: 'Lote óptimo Q*', value: `${fmt(base.Qfinal)} kg`, pct: +eficienciaBodega, color: 'bg-blue-500' },
                { label: 'Uso de bodega', value: `${eficienciaBodega}%`, pct: +eficienciaBodega, color: 'bg-green-400' },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{r.label}</span>
                    <span className="font-bold">{r.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${r.color} h-2 rounded-full transition-all`} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
              <span className="font-bold">✓ Restricción de bodega NO activa.</span> Q* ({fmt(base.Qstar)} kg) {'<'} Q_cap ({fmt(Q_CAP)} kg). El lote óptimo es completamente factible.
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Costo de pedir</p>
                <p className="text-base font-bold text-gray-800 tabular-nums">${fmt(base.costoPedir)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Costo de mantener</p>
                <p className="text-base font-bold text-gray-800 tabular-nums">${fmt(base.costoMantener)}</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
