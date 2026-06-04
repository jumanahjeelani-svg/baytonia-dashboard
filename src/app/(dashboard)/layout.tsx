'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Instagram,
  Music2,
  Ghost,
  BarChart2,
  Calendar,
  Bot,
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

function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-50 md:hidden">
      <div className="flex overflow-x-auto scrollbar-hide">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[60px] flex-1 ${
                isActive ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="flex">
        <div className="hidden md:flex md:w-64 md:shrink-0 md:sticky md:top-0 md:h-screen">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
