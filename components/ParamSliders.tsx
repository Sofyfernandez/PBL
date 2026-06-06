'use client';

import { BASE } from '@/lib/eoq';

interface Props {
  D: number;
  S: number;
  onChangeD: (v: number) => void;
  onChangeS: (v: number) => void;
}

const fmt = (v: number) => Math.round(v).toLocaleString('es-CO');

export default function ParamSliders({ D, S, onChangeD, onChangeS }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
        Panel de control — Parámetros ajustables
      </p>

      {/* Slider D */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-sm text-gray-800">D — Demanda anual</span>
          <span className="text-blue-700 font-bold text-sm tabular-nums">
            {fmt(D)} <span className="text-gray-400 font-normal text-xs">kg/año</span>
          </span>
        </div>
        <input
          type="range"
          min={400_000}
          max={1_500_000}
          step={1_000}
          value={D}
          onChange={e => onChangeD(+e.target.value)}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>400.000</span>
          <span>1.500.000 kg/año</span>
        </div>
      </div>

      {/* Slider S */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-sm text-gray-800">S — Costo de pedir</span>
          <span className="text-blue-700 font-bold text-sm tabular-nums">
            {fmt(S)} <span className="text-gray-400 font-normal text-xs">COP/pedido</span>
          </span>
        </div>
        <input
          type="range"
          min={1_000_000}
          max={15_000_000}
          step={100_000}
          value={S}
          onChange={e => onChangeS(+e.target.value)}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>1.000.000</span>
          <span>15.000.000 COP</span>
        </div>
      </div>

      {/* Parámetros fijos */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
          Parámetros fijos del modelo
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'H — Costo mantener', val: '2.000 COP/kg·año' },
            { label: 'B — Bodega', val: '500 m²' },
            { label: 'f — Factor espacio', val: '0,005 m²/kg' },
            { label: 'L — Lead time', val: '30 días' },
          ].map(p => (
            <div key={p.label} className="bg-blue-50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-500">{p.label}</p>
              <p className="text-xs font-semibold text-gray-800">{p.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
