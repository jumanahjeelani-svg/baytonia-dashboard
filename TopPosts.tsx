import { topPosts, formatNumber } from "@/lib/mock-data";
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";

const platformColors: Record<string, string> = {
  instagram: "bg-pink-100 text-pink-600",
  tiktok: "bg-slate-100 text-slate-700",
  snapchat: "bg-yellow-100 text-yellow-700",
};

export default function TopPosts() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-slate-800 font-bold text-base">أفضل المنشورات</h2>
          <p className="text-slate-400 text-xs mt-0.5">الأكثر تفاعلاً هذا الشهر</p>
        </div>
        <button className="text-amber-500 text-xs font-semibold hover:text-amber-600">
          عرض الكل
        </button>
      </div>
      <div className="space-y-3">
        {topPosts.map((post, i) => (
          <div
            key={post.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            {/* Rank */}
            <span className="text-slate-300 text-sm font-bold w-5 shrink-0 text-center">
              {i + 1}
            </span>
            {/* Emoji thumbnail */}
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
              {post.thumbnail}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${platformColors[post.platform]}`}>
                  {post.platformName}
                </span>
                <span className="text-slate-400 text-xs">{post.date}</span>
              </div>
              <p className="text-slate-700 text-sm font-medium truncate">{post.title}</p>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {formatNumber(post.views)}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={12} />
                {formatNumber(post.likes)}
              </span>
              <span className="flex items-center gap-1 hidden sm:flex">
                <Share2 size={12} />
                {formatNumber(post.shares)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
