'use client';

import Sidebar from './sidebar';
import Header from './header';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 ml-64 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
