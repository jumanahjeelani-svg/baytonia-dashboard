"use client";
import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const ranges = ["آخر 7 أيام", "آخر 30 يوم", "آخر 6 أشهر", "هذا العام"];

const pageTitles: Record<string, string> = {
  "/dashboard": "لوحة التحكم",
  "/instagram": "انستجرام",
  "/tiktok": "تيك توك",
  "/snapchat": "سناب شات",
  "/analytics": "جوجل أناليتكس",
  "/scheduler": "جدولة المحتوى",
  "/chat": "المساعد الذكي",
};

export default function TopBar({ title }: { title?: string }) {
  const [range, setRange] = useState("آخر 30 يوم");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = title ?? pageTitles[pathname] ?? "بيتونيا";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <h1 className="text-slate-800 font-bold text-lg">{pageTitle}</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          >
            <span>{range}</span>
            <ChevronDown size={14} />
          </button>
          {open && (
            <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg shadow-slate-200 border border-slate-100 py-1 z-50">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setOpen(false); }}
                  className={`w-full text-right px-4 py-2 text-sm hover:bg-slate-50 ${
                    r === range ? "text-amber-600 font-semibold" : "text-slate-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300">
          <Search size={16} />
        </button>
        <button className="relative w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
