import { storiesPerformance, fmt } from "@/lib/snapchat-data";
import { Eye, Camera, ChevronsUp } from "lucide-react";

export default function SnapchatStories() {
  const maxViews = Math.max(...storiesPerformance.map((s) => s.avgViews));

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="mb-4">
        <h2 className="text-slate-800 font-bold text-base">أداء القصص حسب النوع</h2>
        <p className="text-slate-400 text-xs mt-0.5">متوسط الأداء لكل فئة</p>
      </div>

      <div className="space-y-4">
        {storiesPerformance.map((story) => (
          <div key={story.type} className="space-y-1.5">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <span className="text-slate-700 text-sm font-medium">{story.type}</span>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye size={10} className="text-slate-400" />
                  {fmt(story.avgViews)}
                </span>
                <span className="flex items-center gap-1">
                  <Camera size={10} className="text-amber-400" />
                  {fmt(story.screenshots)}
                </span>
                <span className="flex items-center gap-1">
                  <ChevronsUp size={10} className="text-emerald-400" />
                  {fmt(story.swipeUps)}
                </span>
              </div>
            </div>

            {/* Views progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-700"
                  style={{ width: `${(story.avgViews / maxViews) * 100}%` }}
                />
              </div>
              <span className="text-amber-600 text-xs font-bold w-10 text-left shrink-0">
                {story.completion}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>الشريط = متوسط المشاهدات</span>
        <span>الرقم = معدل الإكمال</span>
      </div>
    </div>
  );
}
