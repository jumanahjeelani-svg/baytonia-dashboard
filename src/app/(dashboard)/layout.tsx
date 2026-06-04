'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar drawer on mobile */}
      <div className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Sidebar on desktop */}
      <div className="hidden md:fixed md:top-0 md:right-0 md:h-full md:w-64 md:flex md:z-30">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="md:mr-64 flex flex-col min-h-screen">

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <p className="font-bold text-slate-800 text-lg">بيتونيا</p>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg bg-slate-900 text-white"
          >
            <Menu size={20} />
          </button>
        </div>

        <TopBar />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

    </div>
  );
}
