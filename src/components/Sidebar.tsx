'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Instagram, Music2, Ghost,
  BarChart2, Calendar, Bot, TrendingUp, X
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/instagram', label: 'انستجرام', icon: Instagram },
  { href: '/tiktok', label: 'تيك توك', icon: Music2 },
  { href: '/snapchat', label: 'سناب', icon: Ghost },
  { href: '/analytics', label: 'أناليتكس', icon: BarChart2 },
  { href: '/scheduler', label: 'جدولة', icon: Calendar },
  { href: '/chat', label: 'مساعد', icon: Bot },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
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
