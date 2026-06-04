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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 right-4 z-50 md:hidden bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      <div className="flex">
        {/* Sidebar - fixed on mobile, normal on desktop */}
        <div
          className={`fixed top-0 right-0 h-full z-40 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            md:sticky md:translate-x-0 md:top-0 md:h-screen`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content - full width on mobile */}
        <div className="flex-1 flex flex-col min-h-screen w-full">
          <TopBar />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
