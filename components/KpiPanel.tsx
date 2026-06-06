'use client';

import { EOQResult, Q_CAP } from '@/lib/eoq';

interface Props {
  result: EOQResult;
}

const fmt = (v: number) => Math.round(v).toLocaleString('es-CO');
const fmt1 = (v: number) => v.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

interface KpiCardProps {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}

function KpiCard({ label, value, unit, highlight }: KpiCardProps) {
  return (
    <div className={`rounded-lg p-3 border ${highlight ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-transparent'}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-900 tabular-nums mt-1">{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{unit}</p>
    </div>
  );
}

export default function KpiPanel({ result }: Props) {
  const { Qstar, Qfinal, N, T, TC, ROP, restriccionActiva } = result;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
        Indicadores del modelo — tiempo real
      </p>

      <div className="grid grid-cols-3 gap-2">
        <KpiCard label="Lote óptimo Q*" value={fmt(Qstar)} unit="kg / pedido" highlight />
        <KpiCard label="Lote final Q_final" value={fmt(Qfinal)} unit="kg / pedido" />
        <KpiCard label="Pedidos al año (N)" value={fmt1(N)} unit="pedidos / año" />
        <KpiCard label="Tiempo entre pedidos (T)" value={fmt1(T)} unit="días" />
        <KpiCard label="Costo total anual (TC)" value={fmt(TC)} unit="COP / año" />
        <KpiCard label="Punto de reorden (ROP)" value={fmt(ROP)} unit="kg" />
      </div>

      {/* Alerta restricción bodega */}
      {restriccionActiva && (
        <div className="bg-orange-50 border border-orange-400 rounded-lg px-4 py-3 text-sm">
          <p className="font-bold text-orange-700">⚠ Restricción de bodega activa</p>
          <p className="text-orange-600 text-xs mt-1">
            Q* supera la capacidad máxima de bodega (Q<sub>cap</sub> = {fmt(Q_CAP)} kg).
            Se usa Q<sub>final</sub> = Q<sub>cap</sub> como lote efectivo.
          </p>
        </div>
      )}

      {/* Estado restricción */}
      <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Estado restricción bodega
        </span>
        <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${
          restriccionActiva ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
        }`}>
          {restriccionActiva ? 'Activa' : 'No activa'}
        </span>
        <span className="ml-auto text-[10px] text-gray-400">
          Q<sub>cap</sub> = {fmt(Q_CAP)} kg
        </span>
      </div>
    </div>
  );
}
