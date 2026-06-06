'use client';

import { useState } from 'react';
import { Escenario, saveEscenario, deleteEscenario } from '@/lib/supabase';
import { EOQResult } from '@/lib/eoq';

interface Props {
  D: number;
  S: number;
  result: EOQResult;
  escenarios: Escenario[];
  onSaved: () => void;
}

const fmt = (v: number) => Math.round(v).toLocaleString('es-CO');

export default function EscenariosPanel({ D, S, result, escenarios, onSaved }: Props) {
  const [nombre, setNombre] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!nombre.trim()) { setError('Ingresa un nombre para el escenario.'); return; }
    setSaving(true);
    setError('');
    try {
      await saveEscenario({
        nombre: nombre.trim(),
        D,
        S,
        Q_star: result.Qfinal,
        TC: result.TC,
        N: result.N,
        T: result.T,
        ROP: result.ROP,
      });
      setNombre('');
      onSaved();
    } catch {
      setError('Error al guardar. Verifica las credenciales de Supabase.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteEscenario(id);
      onSaved();
    } catch {
      // silently ignore
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
        Escenarios guardados
      </p>

      {/* Guardar nuevo */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre del escenario..."
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

      {/* Tabla de escenarios */}
      {escenarios.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">
          No hay escenarios guardados. Mueve los sliders y guarda uno.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {['Nombre', 'D (kg/año)', 'S (COP)', 'Q* (kg)', 'TC (COP/año)', 'N', 'T (días)', 'ROP (kg)', ''].map(h => (
                  <th key={h} className="text-left py-2 pr-3 font-semibold text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {escenarios.map(e => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 pr-3 font-medium text-gray-800 whitespace-nowrap">{e.nombre}</td>
                  <td className="py-2 pr-3 tabular-nums">{fmt(e.D)}</td>
                  <td className="py-2 pr-3 tabular-nums">{fmt(e.S)}</td>
                  <td className="py-2 pr-3 tabular-nums font-semibold text-blue-700">{fmt(e.Q_star)}</td>
                  <td className="py-2 pr-3 tabular-nums">{fmt(e.TC)}</td>
                  <td className="py-2 pr-3 tabular-nums">{e.N.toFixed(1)}</td>
                  <td className="py-2 pr-3 tabular-nums">{e.T.toFixed(1)}</td>
                  <td className="py-2 pr-3 tabular-nums">{fmt(e.ROP)}</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleDelete(e.id!)}
                      className="text-gray-300 hover:text-red-500 transition-colors text-base leading-none"
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
