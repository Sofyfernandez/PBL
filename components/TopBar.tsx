'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconBell, IconSettings } from '@/components/Icons';

const tabs = [
  { href: '/',              label: 'Dashboard' },
  { href: '/analisis',      label: 'Análisis' },
  { href: '/configuracion', label: 'Configuración' },
];

interface Props {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: Props) {
  const path = usePathname();

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-0 flex items-center justify-between h-14">
      <div className="flex items-center gap-6 h-full">
        <div>
          <span className="font-bold text-gray-900 text-sm">{title}</span>
          {subtitle && <span className="text-gray-400 text-xs ml-2">{subtitle}</span>}
        </div>
        <nav className="flex items-center gap-1 h-full">
          {tabs.map(t => {
            const active = path === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-3 h-full flex items-center text-sm border-b-2 transition-colors ${
                  active
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
          <IconBell size={18} />
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
          <IconSettings size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">SF</div>
      </div>
    </header>
  );
}
