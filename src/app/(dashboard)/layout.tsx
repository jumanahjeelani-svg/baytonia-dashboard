'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Menu, X } from 'lucide-react';

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
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-64 z-50 transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 right-0 h-full w-64 z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="md:mr-64 flex flex-col min-h-screen">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 sticky top-0 z-30">
          <p className="font-bold text-white text-lg">بيتونيا</p>
          <button onClick={() => setOpen(true)} className="text-white p-1">
            <Menu size={24} />
          </button>
        </div>

        <div className="hidden md:block">
          <TopBar />
        </div>

        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

    </div>
  );
}
