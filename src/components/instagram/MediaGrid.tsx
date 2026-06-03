import { IGMedia } from "@/lib/instagram";
import { Heart, MessageCircle, ExternalLink, Film, Images } from "lucide-react";

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function MediaTypeIcon({ type }: { type: IGMedia["media_type"] }) {
  if (type === "VIDEO") return <Film size={12} />;
  if (type === "CAROUSEL_ALBUM") return <Images size={12} />;
  return null;
}

export default function MediaGrid({ media }: { media: IGMedia[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-slate-800 font-bold text-base">آخر المنشورات</h2>
          <p className="text-slate-400 text-xs mt-0.5">{media.length} منشور</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {media.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group"
          >
            {post.media_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.media_type === "VIDEO" ? (post.thumbnail_url ?? post.media_url) : post.media_url}
                alt={post.caption?.slice(0, 40) ?? "منشور"}
                className="w-full h-full object-cover"
              />
            )}
            {/* Type badge */}
            {post.media_type !== "IMAGE" && (
              <span className="absolute top-1.5 right-1.5 bg-black/50 text-white rounded-md px-1.5 py-0.5 flex items-center gap-1 text-xs">
                <MediaTypeIcon type={post.media_type} />
              </span>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-sm font-semibold">
              <span className="flex items-center gap-1">
                <Heart size={14} />
                {formatNum(post.like_count)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                {formatNum(post.comments_count)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
