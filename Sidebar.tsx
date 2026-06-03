"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Instagram,
  Music2,
  Ghost,
  BarChart2,
  Calendar,
  Bot,
  TrendingUp,
  Settings,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/instagram", label: "انستجرام", icon: Instagram },
  { href: "/tiktok", label: "تيك توك", icon: Music2 },
  { href: "/snapchat", label: "سناب شات", icon: Ghost },
  { href: "/analytics", label: "جوجل أناليتيكس", icon: BarChart2 },
  { href: "/scheduler", label: "جدولة المحتوى", icon: Calendar },
  { href: "/chat", label: "المساعد الذكي", icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/30">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">بيتونيا</p>
            <p className="text-slate-500 text-xs mt-0.5">لوحة التحكم</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          القائمة الرئيسية
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium group ${
                isActive
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon
                className={`w-4.5 h-4.5 shrink-0 ${
                  isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
                size={18}
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          <Settings size={18} className="text-slate-500" />
          <span>الإعدادات</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-3 mt-1 bg-slate-800/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ب
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-xs font-semibold truncate">بيتونيا للأثاث</p>
            <p className="text-slate-500 text-xs truncate">admin@baitonia.sa</p>
          </div>
          <ChevronLeft size={14} className="text-slate-600 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
