'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/',            label: 'Resumen',    icon: '▦' },
  { href: '/simulacion',  label: 'Simulación', icon: '⚡' },
  { href: '/historial',   label: 'Historial',  icon: '🕐' },
  { href: '/analisis',    label: 'Análisis',   icon: '📈' },
  { href: '/configuracion', label: 'Configuración', icon: '⚙' },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-52 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Image src="/logo_ricol_head.png" alt="RICOL SAS" width={120} height={40} className="object-contain" />
        <p className="text-[10px] text-gray-400 mt-1">Plásticos de Colombia</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3">
        {nav.map(item => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100">
        <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <span>↪</span> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
