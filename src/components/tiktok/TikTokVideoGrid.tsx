import { topVideos, fmt } from "@/lib/tiktok-data";
import { Eye, Heart, MessageCircle, Share2, Bookmark, Clock } from "lucide-react";

export default function TikTokVideoGrid() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-slate-800 font-bold text-base">أفضل الفيديوهات</h2>
          <p className="text-slate-400 text-xs mt-0.5">الأكثر مشاهدةً هذا الشهر</p>
        </div>
      </div>

      <div className="space-y-2">
        {topVideos.map((v, i) => (
          <div
            key={v.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            {/* Rank */}
            <span className={`text-sm font-bold w-5 shrink-0 text-center ${i < 3 ? "text-indigo-500" : "text-slate-300"}`}>
              {i + 1}
            </span>

            {/* Thumbnail */}
            <div className="w-12 h-16 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0 relative overflow-hidden">
              <span>{v.thumbnail}</span>
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                {v.duration}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-slate-700 text-sm font-medium leading-snug line-clamp-2">{v.title}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {v.hashtags.map((tag) => (
                  <span key={tag} className="text-indigo-500 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {v.watchTime}ث متوسط
                </span>
                <span>{v.date}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <Eye size={11} className="text-slate-400" />
                {fmt(v.views)}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={11} className="text-rose-400" />
                {fmt(v.likes)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={11} className="text-blue-400" />
                {fmt(v.comments)}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark size={11} className="text-amber-400" />
                {fmt(v.saves)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
