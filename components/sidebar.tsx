'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Package, Download, Upload, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const navItems = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/products', label: 'Productos', icon: Package },
    { href: '/entries', label: 'Entradas', icon: Download },
    { href: '/exits', label: 'Salidas', icon: Upload },
    { href: '/reports', label: 'Reportes', icon: FileText },
    { href: '/configuration', label: 'Configuración', icon: Settings },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-sidebar text-white hover:bg-opacity-90"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">DISTRIBUIDORA</h1>
              <p className="text-xs text-gray-300">Sistema de Inventario</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
                  isActive(item.href) ? 'bg-primary text-white' : 'hover:bg-sidebar-accent text-sidebar-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-md hover:bg-sidebar-accent transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        <div className="p-4 text-center text-xs text-gray-400">
          <button
            onClick={() => setIsOpen(false)}
            className="hover:text-sidebar-foreground"
          >
            ≪
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
