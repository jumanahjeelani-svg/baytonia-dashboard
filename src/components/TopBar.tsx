'use client';
import { Bell, Search, ChevronDown, Calendar, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useDateRange, rangeLabels, Range } from '@/DateRangeContext';

const pageTitles: Record<string, string> = {
  "/dashboard": "لوحة التحكم",
  "/instagram": "انستجرام",
  "/tiktok": "تيك توك",
  "/snapchat": "سناب شات",
  "/analytics": "جوجل أناليتكس",
  "/scheduler": "جدولة المحتوى",
  "/chat": "المساعد الذكي",
};

const ranges: Range[] = ['last_7d', 'last_30d', 'last_6m', 'last_year', 'custom'];

export default function TopBar({ title }: { title?: string }) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');
  const pathname = usePathname();
  const pageTitle = title ?? pageTitles[pathname] ?? "بيتونيا";
  const { range, label, setRange, setCustomDates } = useDateRange();

  function handleRangeClick(r: Range) {
    if (r === 'custom') {
      setShowCustom(true);
    } else {
      setRange(r);
      setOpen(false);
      setShowCustom(false);
    }
  }

  function applyCustom() {
    if (tempStart && tempEnd) {
      setCustomDates(tempStart, tempEnd);
      setOpen(false);
      setShowCustom(false);
    }
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <h1 className="text-slate-800 font-bold text-lg">{pageTitle}</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => { setOpen(!open); setShowCustom(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          >
            <Calendar size={14} />
            <span>{label}</span>
            <ChevronDown size={14} />
          </button>

          {open && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 min-w-[200px]">
              {!showCustom ? (
                <>
                  {ranges.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRangeClick(r)}
                      className={`w-full text-right px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${
                        range === r ? "text-amber-600 font-semibold" : "text-slate-600"
                      }`}
                    >
                      <span>{rangeLabels[r]}</span>
                      {r === 'custom' && <Calendar size={14} />}
                    </button>
                  ))}
                </>
              ) : (
                <div className="p-3 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">اختاري التاريخ</p>
                    <button onClick={() => setShowCustom(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">من</label>
                      <input
                        type="date"
                        value={tempStart}
                        onChange={(e) => setTempStart(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">إلى</label>
                      <input
                        type="date"
                        value={tempEnd}
                        onChange={(e) => setTempEnd(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <button
                    onClick={applyCustom}
                    disabled={!tempStart || !tempEnd}
                    className="w-full bg-amber-500 text-white text-sm py-1.5 rounded-lg hover:bg-amber-600 disabled:opacity-40"
                  >
                    تطبيق
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <Search size={16} />
        </button>
        <button className="relative w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
