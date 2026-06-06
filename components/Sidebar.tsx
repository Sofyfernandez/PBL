'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconDashboard, IconSimulacion, IconHistorial,
  IconAnalisis, IconConfiguracion, IconLogout,
} from '@/components/Icons';

const nav = [
  { href: '/',              label: 'Resumen',       Icon: IconDashboard },
  { href: '/simulacion',    label: 'Simulación',    Icon: IconSimulacion },
  { href: '/historial',     label: 'Historial',     Icon: IconHistorial },
  { href: '/analisis',      label: 'Análisis',      Icon: IconAnalisis },
  { href: '/configuracion', label: 'Configuración', Icon: IconConfiguracion },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-52 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-gray-100">
        <Image src="/logo_ricol_head.png" alt="RICOL SAS" width={120} height={40} className="object-contain" />
        <p className="text-[10px] text-gray-400 mt-1">Plásticos de Colombia</p>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3">
        {nav.map(({ href, label, Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-gray-100">
        <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <IconLogout size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
