import { topHashtags, fmt } from "@/lib/tiktok-data";
import { Hash, TrendingUp } from "lucide-react";

export default function TikTokHashtags() {
  const maxViews = Math.max(...topHashtags.map((h) => h.totalViews));

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="mb-4">
        <h2 className="text-slate-800 font-bold text-base">الهاشتاقات الأفضل</h2>
        <p className="text-slate-400 text-xs mt-0.5">حسب إجمالي المشاهدات</p>
      </div>

      <div className="space-y-3">
        {topHashtags.map((h, i) => (
          <div key={h.tag} className="flex items-center gap-3">
            {/* rank badge */}
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
              i === 0 ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
            }`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-700 text-sm font-semibold flex items-center gap-1">
                  <Hash size={12} className="text-indigo-400" />
                  {h.tag.replace("#", "")}
                </span>
                <span className="text-slate-400 text-xs">{fmt(h.totalViews)} مشاهدة</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(h.totalViews / maxViews) * 100}%`,
                    background: i === 0 ? "#6366F1" : "#C7D2FE",
                  }}
                />
              </div>
            </div>
            <span className="text-slate-400 text-xs shrink-0">{h.uses} فيديو</span>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-2">
        <TrendingUp size={14} className="text-indigo-500 mt-0.5 shrink-0" />
        <p className="text-indigo-700 text-xs leading-relaxed">
          استخدام <strong>#بيتونيا</strong> في كل فيديو يُحقق أعلى وصول — استمر في هذا!
        </p>
      </div>
    </div>
  );
}
