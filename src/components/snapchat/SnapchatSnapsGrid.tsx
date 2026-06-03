import { topSnaps, fmt } from "@/lib/snapchat-data";
import { Eye, Camera, MessageCircle, ChevronsUp } from "lucide-react";

const typeColors: Record<string, string> = {
  "قصة":    "bg-amber-50 text-amber-700",
  "إعلان":  "bg-rose-50 text-rose-600",
  "نصيحة":  "bg-emerald-50 text-emerald-700",
};

export default function SnapchatSnapsGrid() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-slate-800 font-bold text-base">أفضل السنابات</h2>
          <p className="text-slate-400 text-xs mt-0.5">الأكثر مشاهدةً هذا الشهر</p>
        </div>
      </div>

      <div className="space-y-2">
        {topSnaps.map((snap, i) => (
          <div
            key={snap.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            {/* Rank */}
            <span className={`text-sm font-bold w-5 shrink-0 text-center ${i < 3 ? "text-amber-500" : "text-slate-300"}`}>
              {i + 1}
            </span>

            {/* Thumbnail */}
            <div className="w-10 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">
              <span>{snap.thumbnail}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-slate-700 text-sm font-medium leading-snug line-clamp-1">{snap.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[snap.type] ?? "bg-slate-100 text-slate-600"}`}>
                  {snap.type}
                </span>
                <span className="text-slate-400 text-xs">{snap.date}</span>
              </div>
              {/* Completion bar */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${snap.completionRate}%` }}
                  />
                </div>
                <span className="text-amber-600 text-xs font-semibold shrink-0">{snap.completionRate}%</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <Eye size={11} className="text-slate-400" />
                {fmt(snap.views)}
              </span>
              <span className="flex items-center gap-1">
                <Camera size={11} className="text-amber-400" />
                {fmt(snap.screenshots)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={11} className="text-blue-400" />
                {fmt(snap.replies)}
              </span>
              <span className="flex items-center gap-1">
                <ChevronsUp size={11} className="text-emerald-400" />
                {fmt(snap.swipeUps)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
