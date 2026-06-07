'use client';

import { useState } from 'react';
import TopBar from '@/components/TopBar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Instagram, Music2, Ghost,
  BarChart2, Calendar, Bot, Menu, X,
  TrendingUp, Settings
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/instagram', label: 'انستجرام', icon: Instagram },
  { href: '/tiktok', label: 'تيك توك', icon: Music2 },
  { href: '/snapchat', label: 'سناب شات', icon: Ghost },
  { href: '/analytics', label: 'جوجل أناليتيكس', icon: BarChart2 },
  { href: '/scheduler', label: 'جدولة المحتوى', icon: Calendar },
  { href: '/chat', label: 'المساعد الذكي', icon: Bot },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 h-full bg-slate-900 flex flex-col">
      <div className="px-6 py-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold">بيتونيا</p>
            <p className="text-slate-500 text-xs">لوحة التحكم</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white md:hidden">
            <X size={20} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 bg-slate-800/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">ب</div>
          <div>
            <p className="text-slate-200 text-xs font-semibold">بيتونيا للأثاث</p>
            <p className="text-slate-500 text-xs">admin@baitonia.sa</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <SidebarContent onClose={() => setOpen(false)} />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:shrink-0 md:sticky md:top-0 md:h-screen">
          <SidebarContent />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 sticky top-0 z-30">
            <p className="text-white font-bold text-lg">بيتونيا</p>
            <button onClick={() => setOpen(true)} className="text-white p-1">
              <Menu size={24} />
            </button>
          </div>
<div className="hidden md:block"><TopBar /></div>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>

    </div>
  );
}
