'use client';

import { useState, useEffect } from 'react';
import { getEscenarios, deleteEscenario, isSupabaseConfigured, Escenario } from '@/lib/supabase';
import TopBar from '@/components/TopBar';
import { IconSearch, IconTrash } from '@/components/Icons';

const fmt  = (v: number) => Math.round(v).toLocaleString('es-CO');
const fmt1 = (v: number) => v.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function HistorialPage() {
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);
  const [busqueda, setBusqueda]     = useState('');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    getEscenarios().then(d => { setEscenarios(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtrados = escenarios.filter(e =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  async function handleDelete(id: number) {
    await deleteEscenario(id);
    setEscenarios(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Historial de Simulaciones" />

      <main className="flex-1 p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Historial de Simulaciones</h2>
          <p className="text-sm text-gray-400 mt-1">Registro de escenarios explorados con el simulador EOQ.</p>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch size={15} /></span>
            <input type="text" placeholder="Buscar por nombre de escenario..."
              value={busqueda} onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {['Nombre', 'D (kg/año)', 'S (COP)', 'Q* (kg)', 'TC (COP/año)', 'N', 'T (días)', ''].map(h => (
              <span key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</span>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-12 text-sm">Cargando...</p>
          ) : filtrados.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">
              {escenarios.length === 0 ? 'No hay escenarios guardados aún. Ve al Dashboard y guarda uno.' : 'Sin resultados para tu búsqueda.'}
            </p>
          ) : (
            filtrados.map(e => (
              <div key={e.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 items-center">
                <span className="font-semibold text-sm text-gray-800">{e.nombre}</span>
                <span className="text-sm text-gray-600 tabular-nums">{fmt(e.D)}</span>
                <span className="text-sm text-gray-600 tabular-nums">{fmt(e.S)}</span>
                <span className="text-sm font-bold text-blue-700 tabular-nums">{fmt(e.Q_star)}</span>
                <span className="text-sm text-gray-600 tabular-nums">{fmt(e.TC)}</span>
                <span className="text-sm text-gray-600 tabular-nums">{fmt1(e.N)}</span>
                <span className="text-sm text-gray-600 tabular-nums">{fmt1(e.T)}</span>
                <button onClick={() => handleDelete(e.id!)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded">
                  <IconTrash size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {!isSupabaseConfigured() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
            <span className="font-semibold">Supabase no configurado.</span> Los escenarios guardados en el Dashboard aparecerán aquí cuando configures las variables de entorno.
          </div>
        )}
      </main>
    </div>
  );
}
