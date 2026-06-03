import { platforms, formatNumber } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function PlatformSummary() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="mb-4">
        <h2 className="text-slate-800 font-bold text-base">المنصات المتصلة</h2>
        <p className="text-slate-400 text-xs mt-0.5">أداء كل منصة هذا الشهر</p>
      </div>
      <div className="space-y-4">
        {platforms.map((p) => (
          <div key={p.id} className={`p-3 rounded-xl border ${p.borderColor} ${p.bgColor}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className={`text-sm font-bold ${p.textColor}`}>{p.name}</p>
                <p className="text-slate-400 text-xs">{p.handle}</p>
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  p.followersChange >= 0
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {p.followersChange >= 0 ? (
                  <TrendingUp size={10} />
                ) : (
                  <TrendingDown size={10} />
                )}
                {Math.abs(p.followersChange)}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-slate-800 font-bold text-sm">{formatNumber(p.followers)}</p>
                <p className="text-slate-400 text-xs">متابع</p>
              </div>
              <div>
                <p className="text-slate-800 font-bold text-sm">{formatNumber(p.views)}</p>
                <p className="text-slate-400 text-xs">مشاهدة</p>
              </div>
              <div>
                <p className="text-slate-800 font-bold text-sm">{p.engagementRate}%</p>
                <p className="text-slate-400 text-xs">تفاعل</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
