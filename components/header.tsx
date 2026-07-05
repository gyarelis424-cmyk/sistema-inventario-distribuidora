'use client';

import { useState } from 'react';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-border flex items-center justify-between px-6 py-4 ml-64">
      <h1 className="text-2xl font-bold text-foreground"></h1>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors"
        >
          <User size={20} className="text-foreground" />
          <span className="text-foreground">Administrador</span>
          <ChevronDown size={16} className="text-foreground" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-md shadow-lg">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-muted transition-colors text-foreground first:rounded-t-md last:rounded-b-md"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
