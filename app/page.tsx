'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

import { calcEOQ, BASE } from '@/lib/eoq';
import { getDemandaAnual, getEscenarios, isSupabaseConfigured, Escenario } from '@/lib/supabase';

import ParamSliders from '@/components/ParamSliders';
import KpiPanel from '@/components/KpiPanel';
import DemandaBanner from '@/components/DemandaBanner';

const ChartTC         = dynamic(() => import('@/components/ChartTC'),        { ssr: false });
const ChartQvsD       = dynamic(() => import('@/components/ChartQvsD'),      { ssr: false });
const ChartQvsS       = dynamic(() => import('@/components/ChartQvsS'),      { ssr: false });
const EscenariosPanel = dynamic(() => import('@/components/EscenariosPanel'), { ssr: false });

export default function HomePage() {
  const [D, setD] = useState<number>(BASE.D);
  const [S, setS] = useState<number>(BASE.S);

  const result = calcEOQ(D, S);

  const [dReal, setDReal]           = useState<number | null>(null);
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);
  const [supabaseOk, setSupabaseOk] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSupabaseOk(false);
      return;
    }

    getDemandaAnual()
      .then(d => { if (d > 0) setDReal(d); })
      .catch(() => setSupabaseOk(false));

    loadEscenarios();
  }, []);

  const loadEscenarios = useCallback(async () => {
    try {
      const data = await getEscenarios();
      setEscenarios(data);
    } catch {
      // Supabase no configurado aún — no bloquea la app
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="bg-[#1a3a5c] text-white px-8 py-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-extrabold text-lg flex-shrink-0">
          R
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">Simulador EOQ — RICOL SAS</h1>
          <p className="text-blue-300 text-xs mt-0.5">
            PEAD Alta Soplado &nbsp;·&nbsp; Cantidad Económica de Pedido &nbsp;·&nbsp; PBL Optimización 2026
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-5 max-w-[1600px] w-full mx-auto">

        {dReal && <DemandaBanner dReal={dReal} dActual={D} />}

        {!supabaseOk && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-3 text-sm text-yellow-800">
            <span className="font-semibold">⚠ Supabase no configurado.</span>{' '}
            Agrega <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
            <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en{' '}
            <code className="bg-yellow-100 px-1 rounded">.env.local</code> para habilitar historial y escenarios.
            El simulador funciona completamente sin conexión.
          </div>
        )}

        <div className="grid grid-cols-[340px_1fr] gap-4">
          <ParamSliders D={D} S={S} onChangeD={setD} onChangeS={setS} />
          <KpiPanel result={result} />
        </div>

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Zona óptima — Costo Total vs Q
            </p>
            <div className="h-64">
              <ChartTC D={D} S={S} Qstar={result.Qstar} Qfinal={result.Qfinal} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Pulso del mercado — Q* vs Demanda D
            </p>
            <div className="h-64">
              <ChartQvsD D={D} S={S} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Presión logística — Q* vs Costo de Pedir S
            </p>
            <div className="h-64">
              <ChartQvsS D={D} S={S} />
            </div>
          </div>

        </div>

        {supabaseOk && (
          <EscenariosPanel
            D={D}
            S={S}
            result={result}
            escenarios={escenarios}
            onSaved={loadEscenarios}
          />
        )}

      </main>

      <footer className="text-center py-4 text-xs text-gray-400">
        PBL Optimización 202610 — ICESI &nbsp;·&nbsp;
        Laura Fernández · Alejandro Valencia · José Manuel De Las Salas &nbsp;·&nbsp; Junio 2026
      </footer>
    </div>
  );
}
