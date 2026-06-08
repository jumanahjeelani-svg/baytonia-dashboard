"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Upload, Image, Film, BookOpen } from "lucide-react";

type Platform = "instagram" | "tiktok" | "snapchat";
type PostStatus = "published" | "scheduled" | "draft";
type Placement =
  | "instagram_post" | "instagram_reel" | "instagram_story"
  | "tiktok_video" | "tiktok_story"
  | "snapchat_video" | "snapchat_story";

interface Post {
  id: number;
  platform: Platform;
  placement: Placement;
  date: string;
  time: string;
  caption: string;
  status: PostStatus;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  mediaFiles?: string[];
}

const MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const DAYS_SHORT = ["أح","اث","ثل","أر","خم","جم","سب"];

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: "انستغرام", tiktok: "تيك توك", snapchat: "سناب شات",
};
const PLATFORM_ICON: Record<Platform, string> = {
  instagram: "📷", tiktok: "🎵", snapchat: "👻",
};
const STATUS_LABEL: Record<PostStatus, string> = {
  published: "منشور", scheduled: "مجدول", draft: "مسودة",
};
const PLATFORM_COLOR: Record<Platform, string> = {
  instagram: "#E1306C", tiktok: "#69C9D0", snapchat: "#E6D800",
};

const PLACEMENTS: Record<Platform, { value: Placement; label: string; icon: string; multi: boolean }[]> = {
  instagram: [
    { value: "instagram_post",  label: "بوست",  icon: "🖼️", multi: true  },
    { value: "instagram_reel",  label: "ريل",   icon: "🎬", multi: false },
    { value: "instagram_story", label: "ستوري", icon: "⭕", multi: false },
  ],
  tiktok: [
    { value: "tiktok_video", label: "فيديو", icon: "🎵", multi: false },
    { value: "tiktok_story", label: "ستوري", icon: "⭕", multi: false },
  ],
  snapchat: [
    { value: "snapchat_video", label: "فيديو", icon: "👻", multi: false },
    { value: "snapchat_story", label: "ستوري", icon: "⭕", multi: false },
  ],
};

const PLACEMENT_LABEL: Record<Placement, string> = {
  instagram_post: "بوست", instagram_reel: "ريل", instagram_story: "ستوري انستغرام",
  tiktok_video: "فيديو تيك توك", tiktok_story: "ستوري تيك توك",
  snapchat_video: "فيديو سناب", snapchat_story: "ستوري سناب",
};

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "م";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "ك";
  return String(n);
}
function fmtShortDate(d: string): string {
  const [, m, day] = d.split("-");
  return `${parseInt(day)} ${MONTHS[parseInt(m) - 1]}`;
}
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function platformBg(p: Platform): React.CSSProperties {
  if (p === "instagram") return { background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" };
  if (p === "tiktok") return { background: "#010101" };
  return { background: "#FFFC00" };
}

const INIT_POSTS: Post[] = [
  { id: 1,  platform: "instagram", placement: "instagram_post",  date: "2026-06-01", time: "09:00", caption: "بداية جديدة لشهر يونيو! ✨", status: "published", views: 5420,  likes: 876,  comments: 123, shares: 45  },
  { id: 2,  platform: "tiktok",    placement: "tiktok_video",    date: "2026-06-01", time: "18:00", caption: "تحدي جديد! 🎵", status: "published", views: 12500, likes: 2100, comments: 340, shares: 890 },
  { id: 3,  platform: "snapchat",  placement: "snapchat_story",  date: "2026-06-03", time: "14:00", caption: "استوري اليوم 👀", status: "published", views: 3200,  likes: 580,  comments: 42,  shares: 15  },
  { id: 4,  platform: "instagram", placement: "instagram_reel",  date: "2026-06-05", time: "10:00", caption: "نصائح لتحسين محتواك 📱", status: "published", views: 8100, likes: 1240, comments: 198, shares: 67 },
  { id: 5,  platform: "tiktok",    placement: "tiktok_video",    date: "2026-06-07", time: "20:00", caption: "أحدث الترندات 🔥", status: "published", views: 28000, likes: 4500, comments: 780, shares: 2100 },
  { id: 6,  platform: "instagram", placement: "instagram_story", date: "2026-06-08", time: "11:00", caption: "ستوري اليوم 🎨", status: "published", views: 6750, likes: 980, comments: 156, shares: 34 },
  { id: 7,  platform: "instagram", placement: "instagram_post",  date: "2026-06-17", time: "10:00", caption: "كيفية الحصول على أول 1000 متابع 📈", status: "scheduled", views: 0, likes: 0, comments: 0, shares: 0 },
  { id: 8,  platform: "tiktok",    placement: "tiktok_video",    date: "2026-06-18", time: "21:00", caption: "لايف مباشر اليوم! 🔴", status: "scheduled", views: 0, likes: 0, comments: 0, shares: 0 },
  { id: 9,  platform: "instagram", placement: "instagram_reel",  date: "2026-06-20", time: "14:00", caption: "تصميم جديد 🎨", status: "draft", views: 0, likes: 0, comments: 0, shares: 0 },
  { id: 10, platform: "snapchat",  placement: "snapchat_story",  date: "2026-06-22", time: "11:00", caption: "فلتر جديد حصري! 👻", status: "scheduled", views: 0, likes: 0, comments: 0, shares: 0 },
];

export default function SchedulerClient() {
  const [month, setMonth] = useState(new Date(2026, 5, 1));
  const [selDate, setSelDate] = useState<string | null>(null);
  const [platFilter, setPlatFilter] = useState<"all" | Platform>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [rangeStart, setRangeStart] = useState("2026-06-01");
  const [rangeEnd, setRangeEnd] = useState("2026-06-30");
  const [applied, setApplied] = useState({ start: "2026-06-01", end: "2026-06-30" });
  const [posts, setPosts] = useState<Post[]>(INIT_POSTS);
  const [showModal, setShowModal] = useState(false);
  const [newPlat, setNewPlat] = useState<Platform | null>(null);
  const [newPlacement, setNewPlacement] = useState<Placement | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("12:00");
  const [newStatus, setNewStatus] = useState<PostStatus>("scheduled");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const year = month.getFullYear();
  const mo = month.getMonth();
  const daysInMonth = new Date(year, mo + 1, 0).getDate();
  const firstDay = new Date(year, mo, 1).getDay();
  const today = toDateStr(new Date());

  const rangePosts = posts.filter(p =>
    (platFilter === "all" || p.platform === platFilter) &&
    p.date >= applied.start && p.date <= applied.end
  );

  const visiblePosts = posts
    .filter(p =>
      (platFilter === "all" || p.platform === platFilter) &&
      (statusFilter === "all" || p.status === statusFilter)
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  const totalViews    = rangePosts.reduce((s, p) => s + p.views, 0);
  const totalLikes    = rangePosts.reduce((s, p) => s + p.likes, 0);
  const totalComments = rangePosts.reduce((s, p) => s + p.comments, 0);
  const totalShares   = rangePosts.reduce((s, p) => s + p.shares, 0);
  const totalEng      = totalLikes + totalComments + totalShares;
  const engRate       = totalViews > 0 ? ((totalEng / totalViews) * 100).toFixed(1) : "0";

  function platStats(pl: Platform) {
    const pp = rangePosts.filter(p => p.platform === pl);
    const v = pp.reduce((s, p) => s + p.views, 0);
    const l = pp.reduce((s, p) => s + p.likes, 0);
    const c = pp.reduce((s, p) => s + p.comments, 0);
    const sh = pp.reduce((s, p) => s + p.shares, 0);
    return { count: pp.length, views: v, likes: l, comments: c, shares: sh, er: v > 0 ? (((l + c + sh) / v) * 100).toFixed(1) : "0" };
  }

  const cells: Array<{ day: number; ds: string } | null> = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, ds: `${year}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }

  function openModal(date?: string) {
    setNewPlat(null);
    setNewPlacement(null);
    setNewCaption("");
    setNewDate(date ?? today);
    setNewTime("12:00");
    setNewStatus("scheduled");
    setMediaFiles([]);
    setShowModal(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const isMulti = newPlacement ? PLACEMENTS[newPlat!]?.find(p => p.value === newPlacement)?.multi : false;
    const limit = isMulti ? 10 : 1;
    const selected = files.slice(0, limit);
    const urls = selected.map(f => URL.createObjectURL(f));
    setMediaFiles(urls);
  }

  function selectPlatform(pl: Platform) {
    setNewPlat(pl);
    setNewPlacement(null);
    setMediaFiles([]);
  }

  function savePost() {
    if (!newPlat) { alert("الرجاء اختيار المنصة"); return; }
    if (!newPlacement) { alert("الرجاء اختيار نوع المنشور"); return; }
    if (!newCaption.trim()) { alert("الرجاء كتابة نص المنشور"); return; }
    setPosts(prev => [...prev, {
      id: Date.now(), platform: newPlat!, placement: newPlacement!, date: newDate, time: newTime,
      caption: newCaption.trim(), status: newStatus, views: 0, likes: 0, comments: 0, shares: 0,
      mediaFiles,
    }]);
    setShowModal(false);
  }

  const currentPlacement = newPlat && newPlacement ? PLACEMENTS[newPlat]?.find(p => p.value === newPlacement) : null;
  const isMultiMedia = currentPlacement?.multi ?? false;

  return (
    <main className="flex-1 overflow-y-auto p-5 space-y-4">

      {/* Filter + Add */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">المنصة:</span>
          {(["all", "instagram", "tiktok", "snapchat"] as const).map(p => {
            const active = platFilter === p;
            return (
              <button key={p} onClick={() => setPlatFilter(p)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${active ? "text-white border-transparent" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600"}`}
                style={active ? p === "all" ? { background: "#6366F1" } : p === "instagram" ? { background: "#E1306C" } : p === "tiktok" ? { background: "#010101" } : { background: "#E6D800", color: "#422" } : undefined}
              >
                {p !== "all" && <span className="w-1.5 h-1.5 rounded-full" style={{ background: PLATFORM_COLOR[p as Platform] }} />}
                {p === "all" ? "الكل" : PLATFORM_LABEL[p as Platform]}
              </button>
            );
          })}
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
          <Plus size={14} /> إضافة منشور
        </button>
      </div>

      {/* Date range */}
      <div className="bg-white rounded-xl px-5 py-3 flex items-center gap-3 flex-wrap shadow-sm">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">تحليل الفترة:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">من</span>
          <input type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:border-indigo-400" style={{ direction: "ltr" }} />
          <span className="text-xs font-semibold text-slate-400">إلى</span>
          <input type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:border-indigo-400" style={{ direction: "ltr" }} />
        </div>
        <button onClick={() => setApplied({ start: rangeStart, end: rangeEnd })} className="border border-indigo-400 text-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">تطبيق</button>
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: "إجمالي المنشورات", value: rangePosts.length, sub: "في الفترة المحددة", color: "#6366F1" },
          { label: "المشاهدات", value: fmtNum(totalViews), sub: "مشاهدة", color: "#3B82F6" },
          { label: "الإعجابات", value: fmtNum(totalLikes), sub: "إعجاب", color: "#E1306C" },
          { label: "التعليقات", value: fmtNum(totalComments), sub: "تعليق", color: "#10B981" },
          { label: "المشاركات", value: fmtNum(totalShares), sub: "مشاركة", color: "#F59E0B" },
          { label: "معدل التفاعل", value: `${engRate}%`, sub: "من المشاهدات", color: "#8B5CF6" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border-r-4 hover:-translate-y-0.5 transition-transform" style={{ borderRightColor: card.color }}>
            <div className="text-[10px] text-slate-400 font-semibold mb-1">{card.label}</div>
            <div className="text-2xl font-extrabold text-slate-800 leading-none mb-1">{card.value}</div>
            <div className="text-[10px] text-emerald-600 font-medium">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Platform breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["instagram", "tiktok", "snapchat"] as Platform[]).map(pl => {
          const s = platStats(pl);
          return (
            <div key={pl} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base" style={platformBg(pl)}>{PLATFORM_ICON[pl]}</div>
                <div>
                  <div className="font-bold text-sm text-slate-800">{PLATFORM_LABEL[pl]}</div>
                  <div className="text-xs text-slate-400">{s.count} منشور</div>
                </div>
              </div>
              {([["المشاهدات", fmtNum(s.views), false], ["الإعجابات", fmtNum(s.likes), false], ["التعليقات", fmtNum(s.comments), false], ["المشاركات", fmtNum(s.shares), false], ["معدل التفاعل", `${s.er}%`, true]] as [string, string, boolean][]).map(([lbl, val, accent]) => (
                <div key={lbl} className="flex justify-between py-1.5 text-xs border-b border-slate-100 last:border-b-0">
                  <span className="text-slate-500">{lbl}</span>
                  <span className={`font-semibold ${accent ? "text-indigo-600" : "text-slate-800"}`}>{val}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Calendar + Posts */}
      <div className="flex flex-col xl:flex-row gap-4 items-start">
        <div className="w-full xl:w-[300px] xl:shrink-0 bg-white rounded-xl p-5 shadow-sm xl:sticky xl:top-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600"><ChevronRight size={15} /></button>
            <span className="text-sm font-bold text-slate-800">{MONTHS[mo]} {year}</span>
            <button onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600"><ChevronLeft size={15} /></button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {DAYS_SHORT.map(d => <div key={d} className="text-center text-[9px] font-bold text-slate-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-px">
            {cells.map((cell, idx) => {
              if (!cell) return <div key={`e${idx}`} className="aspect-square" />;
              const { day, ds } = cell;
              const isToday = ds === today;
              const isSel = ds === selDate;
              const inRange = ds >= applied.start && ds <= applied.end;
              const dayPosts = posts.filter(p => p.date === ds);
              const uniqueP = [...new Set(dayPosts.map(p => p.platform))];
              return (
                <div key={ds} onClick={() => setSelDate(selDate === ds ? null : ds)}
                  className={`aspect-square flex flex-col items-center justify-center cursor-pointer text-[11px] font-medium rounded-md transition-all select-none ${isSel ? "bg-indigo-600 text-white" : isToday ? "bg-indigo-50 text-indigo-700 font-bold" : inRange ? "bg-indigo-50/60 text-indigo-600" : "text-slate-700 hover:bg-slate-100"}`}
                >
                  <span>{day}</span>
                  {uniqueP.length > 0 && (
                    <div className="flex gap-px mt-0.5">
                      {uniqueP.slice(0, 3).map(pl => <span key={pl} className="block w-1 h-1 rounded-full" style={{ background: isSel ? "rgba(255,255,255,0.8)" : PLATFORM_COLOR[pl] }} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {selDate && (() => {
            const dayPosts = posts.filter(p => p.date === selDate);
            return (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700">{fmtShortDate(selDate)}</span>
                  <button onClick={() => openModal(selDate)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">+ إضافة</button>
                </div>
                {dayPosts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2">لا توجد منشورات</p>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {dayPosts.map(p => (
                      <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PLATFORM_COLOR[p.platform] }} />
                        <span className="text-slate-500 font-semibold shrink-0">{p.time}</span>
                        <span className="flex-1 truncate text-slate-700">{p.caption}</span>
                        <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${p.status === "published" ? "bg-emerald-100 text-emerald-700" : p.status === "scheduled" ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"}`}>{STATUS_LABEL[p.status]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Posts list */}
        <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-bold text-slate-800">المنشورات</h2>
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {(["all", "published", "scheduled", "draft"] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${statusFilter === s ? "bg-white text-slate-800 font-semibold shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  {s === "all" ? "الكل" : STATUS_LABEL[s as PostStatus]}
                </button>
              ))}
            </div>
          </div>
          {visiblePosts.length === 0 ? (
            <div className="text-center py-14 text-slate-400"><div className="text-4xl mb-2">📭</div><p className="text-sm">لا توجد منشورات</p></div>
          ) : (
            <div className="divide-y divide-slate-100">
              {visiblePosts.map(p => (
                <div key={p.id} className="px-5 py-4 flex gap-3 items-start hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={platformBg(p.platform)}>{PLATFORM_ICON[p.platform]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold" style={{ color: PLATFORM_COLOR[p.platform] }}>{PLATFORM_LABEL[p.platform]}</span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{PLACEMENT_LABEL[p.placement]}</span>
                      <span className="text-xs text-slate-400">{fmtShortDate(p.date)} · {p.time}</span>
                    </div>
                    <p className="text-sm text-slate-700 truncate mb-1.5">{p.caption}</p>
                    {p.mediaFiles && p.mediaFiles.length > 0 && (
                      <div className="flex gap-1 mb-1.5">
                        {p.mediaFiles.slice(0, 3).map((url, i) => (
                          <img key={i} src={url} alt="" className="w-8 h-8 rounded object-cover border border-slate-200" />
                        ))}
                        {p.mediaFiles.length > 3 && <span className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs text-slate-500">+{p.mediaFiles.length - 3}</span>}
                      </div>
                    )}
                    {p.status === "published" && (
                      <div className="flex gap-3 text-xs text-slate-400">
                        <span>👁 {fmtNum(p.views)}</span>
                        <span>❤️ {fmtNum(p.likes)}</span>
                        <span>💬 {fmtNum(p.comments)}</span>
                        <span>↗️ {fmtNum(p.shares)}</span>
                      </div>
                    )}
                  </div>
                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold ${p.status === "published" ? "bg-emerald-100 text-emerald-700" : p.status === "scheduled" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{STATUS_LABEL[p.status]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">منشور جديد</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"><X size={14} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Platform */}
              <div>
                <label className="block text-sm font-bold mb-2.5 text-slate-700">المنصة</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["instagram", "tiktok", "snapchat"] as Platform[]).map(pl => (
                    <button key={pl} onClick={() => selectPlatform(pl)}
                      className={`border-2 rounded-xl py-3 flex flex-col items-center gap-1.5 transition-all ${newPlat !== pl ? "border-slate-200 hover:border-slate-300" : ""}`}
                      style={newPlat === pl ? { borderColor: PLATFORM_COLOR[pl], background: pl === "instagram" ? "#FCE4EC" : pl === "tiktok" ? "#E0F7FA" : "#FFFDE7" } : undefined}
                    >
                      <span className="text-xl">{PLATFORM_ICON[pl]}</span>
                      <span className="text-xs font-semibold">{PLATFORM_LABEL[pl]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Placement */}
              {newPlat && (
                <div>
                  <label className="block text-sm font-bold mb-2.5 text-slate-700">نوع المنشور</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLACEMENTS[newPlat].map(pl => (
                      <button key={pl.value} onClick={() => { setNewPlacement(pl.value); setMediaFiles([]); }}
                        className={`border-2 rounded-xl py-3 flex flex-col items-center gap-1.5 transition-all ${newPlacement !== pl.value ? "border-slate-200 hover:border-indigo-300" : "border-indigo-500 bg-indigo-50"}`}
                      >
                        <span className="text-xl">{pl.icon}</span>
                        <span className="text-xs font-semibold">{pl.label}</span>
                        {pl.multi && <span className="text-[9px] text-indigo-500 font-bold">متعدد</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Upload */}
              {newPlacement && (
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    {isMultiMedia ? "رفع صور (حتى 10)" : "رفع ملف"}
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
                  >
                    <Upload size={24} className="text-slate-400" />
                    <p className="text-xs text-slate-500 text-center">
                      {isMultiMedia ? "اضغطي لرفع صور متعددة (JPG, PNG)" : "اضغطي لرفع صورة أو فيديو"}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={isMultiMedia ? "image/*" : "image/*,video/*"}
                      multiple={isMultiMedia}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  {mediaFiles.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {mediaFiles.map((url, i) => (
                        <div key={i} className="relative">
                          <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                          <button onClick={() => setMediaFiles(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">النص / الكابشن</label>
                <textarea value={newCaption} onChange={e => setNewCaption(e.target.value)} placeholder="اكتب نص المنشور هنا..." rows={4} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-400 resize-none" />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">التاريخ</label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-400" style={{ direction: "ltr" }} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">الوقت</label>
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-400" style={{ direction: "ltr" }} />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">الحالة</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as PostStatus)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-400">
                  <option value="scheduled">مجدول</option>
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end px-6 py-4 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">إلغاء</button>
              <button onClick={savePost} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">حفظ المنشور</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
