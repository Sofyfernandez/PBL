'use client';

import { useState } from 'react';
import { PARAMS, Q_CAP } from '@/lib/eoq';
import TopBar from '@/components/TopBar';

export default function ConfiguracionPage() {
  const [H, setH] = useState<number>(PARAMS.H);
  const [B, setB] = useState<number>(PARAMS.B);
  const [f, setF] = useState<number>(PARAMS.f);
  const [L, setL] = useState<number>(PARAMS.L);
  const [saved, setSaved] = useState(false);

  const qcap = B / f;

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDiscard() {
    setH(PARAMS.H); setB(PARAMS.B); setF(PARAMS.f); setL(PARAMS.L);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="RICOL SAS" subtitle="Simulador EOQ · PEAD Alta Soplado" />

      <main className="flex-1 p-6 grid grid-cols-[1fr_320px] gap-5 items-start">

        {/* Parámetros globales */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙</span>
            <div>
              <h2 className="font-bold text-gray-900">Parámetros de Operación</h2>
              <p className="text-xs text-gray-400">Modifica los parámetros fijos del modelo EOQ. Los cambios afectan todos los cálculos.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Costo de Almacenamiento (H)
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <span className="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-r border-gray-200">$</span>
                <input type="number" value={H} onChange={e => setH(+e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none" />
                <span className="px-3 py-2 bg-gray-50 text-gray-400 text-xs border-l border-gray-200">/kg/año</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Capacidad Total de Bodega (B)
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <input type="number" value={B} onChange={e => setB(+e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none" />
                <span className="px-3 py-2 bg-gray-50 text-gray-400 text-xs border-l border-gray-200">m²</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Factor de Ocupación (f)
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <input type="number" value={f} step={0.001} onChange={e => setF(+e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none" />
                <span className="px-3 py-2 bg-gray-50 text-gray-400 text-xs border-l border-gray-200">m²/kg</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Lead Time Promedio (L)
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <input type="number" value={L} onChange={e => setL(+e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none" />
                <span className="px-3 py-2 bg-gray-50 text-gray-400 text-xs border-l border-gray-200">Días</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
            Con estos parámetros, la capacidad de bodega es <strong>Q_cap = B/f = {Math.round(qcap).toLocaleString('es-CO')} kg</strong>.
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={handleDiscard}
              className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Descartar
            </button>
            <button onClick={handleSave}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              {saved ? '✓ Guardado' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {/* Panel información */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Información del Modelo</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Modelo', value: 'EOQ Clásico (Wilson)' },
                { label: 'Producto', value: 'PEAD Alta Soplado' },
                { label: 'Empresa', value: 'RICOL SAS — Cali' },
                { label: 'Periodo', value: 'Mar 2025 – Mar 2026' },
                { label: 'Versión', value: 'PBL Optimización 2026' },
              ].map(i => (
                <div key={i.label} className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-xs text-gray-400">{i.label}</span>
                  <span className="text-xs font-semibold text-gray-700">{i.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Equipo</p>
            {[
              { nombre: 'Laura Fernández', rol: 'A00410462' },
              { nombre: 'Alejandro Valencia', rol: 'A00409962' },
              { nombre: 'José M. De Las Salas', rol: 'A00409912' },
            ].map(u => (
              <div key={u.nombre} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  {u.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{u.nombre}</p>
                  <p className="text-[10px] text-gray-400">{u.rol}</p>
                </div>
                <span className="ml-auto text-[10px] bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-full">ACTIVO</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
