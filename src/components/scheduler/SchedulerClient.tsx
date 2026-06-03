"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type Platform = "instagram" | "tiktok" | "snapchat";
type PostStatus = "published" | "scheduled" | "draft";

interface Post {
  id: number;
  platform: Platform;
  date: string;
  time: string;
  caption: string;
  status: PostStatus;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

// ── Locale ─────────────────────────────────────────────────────────────────
const MONTHS = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];
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

// ── Helpers ────────────────────────────────────────────────────────────────
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
  if (p === "instagram")
    return { background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" };
  if (p === "tiktok") return { background: "#010101" };
  return { background: "#FFFC00" };
}

// ── Sample data ────────────────────────────────────────────────────────────
const INIT_POSTS: Post[] = [
  { id:  1, platform: "instagram", date: "2026-06-01", time: "09:00", caption: "بداية جديدة لشهر يونيو! تابعونا لمزيد من المحتوى الرائع ✨",          status: "published",  views: 5420,  likes: 876,  comments: 123,  shares: 45   },
  { id:  2, platform: "tiktok",    date: "2026-06-01", time: "18:00", caption: "تحدي جديد! شاركونا تجربتكم 🎵 #تيك_توك",                              status: "published",  views: 12500, likes: 2100, comments: 340,  shares: 890  },
  { id:  3, platform: "snapchat",  date: "2026-06-03", time: "14:00", caption: "استوري اليوم: خلف الكواليس 👀",                                        status: "published",  views: 3200,  likes: 580,  comments: 42,   shares: 15   },
  { id:  4, platform: "instagram", date: "2026-06-05", time: "10:00", caption: "نصائح لتحسين محتواك على وسائل التواصل الاجتماعي 📱",                  status: "published",  views: 8100,  likes: 1240, comments: 198,  shares: 67   },
  { id:  5, platform: "tiktok",    date: "2026-06-07", time: "20:00", caption: "أحدث الترندات لهذا الأسبوع! لا تفوتوها 🔥",                           status: "published",  views: 28000, likes: 4500, comments: 780,  shares: 2100 },
  { id:  6, platform: "instagram", date: "2026-06-08", time: "11:00", caption: "رحلتنا: استكشاف عالم الإبداع الرقمي 🎨",                              status: "published",  views: 6750,  likes: 980,  comments: 156,  shares: 34   },
  { id:  7, platform: "snapchat",  date: "2026-06-10", time: "16:00", caption: "سؤال اليوم: ما هو تطبيقك المفضل؟ 💬",                                 status: "published",  views: 4100,  likes: 320,  comments: 89,   shares: 12   },
  { id:  8, platform: "tiktok",    date: "2026-06-12", time: "19:00", caption: "دورة مجانية في تعلم المونتاج! ابدأ رحلتك الآن 🎬",                    status: "published",  views: 35000, likes: 6200, comments: 1200, shares: 3400 },
  { id:  9, platform: "instagram", date: "2026-06-14", time: "09:30", caption: "أفضل 10 أدوات لإنشاء محتوى احترافي في 2026 🛠️",                      status: "published",  views: 9200,  likes: 1560, comments: 234,  shares: 89   },
  { id: 10, platform: "snapchat",  date: "2026-06-15", time: "12:00", caption: "منتصف الشهر! كيف أمضيتم أيامكم؟ ✨",                                  status: "published",  views: 2800,  likes: 410,  comments: 67,   shares: 8    },
  { id: 11, platform: "instagram", date: "2026-06-17", time: "10:00", caption: "كيفية الحصول على أول 1000 متابع في أسبوع واحد 📈",                    status: "scheduled",  views: 0, likes: 0, comments: 0, shares: 0 },
  { id: 12, platform: "tiktok",    date: "2026-06-18", time: "21:00", caption: "لايف مباشر اليوم! ادخلوا وتحدثوا معنا 🔴",                            status: "scheduled",  views: 0, likes: 0, comments: 0, shares: 0 },
  { id: 13, platform: "instagram", date: "2026-06-20", time: "14:00", caption: "تصميم جديد لصفحتنا! أخبرونا بآرائكم 🎨",                             status: "draft",      views: 0, likes: 0, comments: 0, shares: 0 },
  { id: 14, platform: "snapchat",  date: "2026-06-22", time: "11:00", caption: "فلتر جديد حصري! جربوه الآن 👻",                                       status: "scheduled",  views: 0, likes: 0, comments: 0, shares: 0 },
  { id: 15, platform: "tiktok",    date: "2026-06-25", time: "18:00", caption: "تعلم الرقص في 5 دقائق! سهل وممتع 💃",                                status: "draft",      views: 0, likes: 0, comments: 0, shares: 0 },
  { id: 16, platform: "instagram", date: "2026-06-28", time: "10:00", caption: "ملخص شهر يونيو 2026! ماذا تعلمنا؟ 📊",                               status: "draft",      views: 0, likes: 0, comments: 0, shares: 0 },
  { id: 17, platform: "tiktok",    date: "2026-06-30", time: "20:00", caption: "وداع يونيو 👋 أراكم في يوليو بمحتوى أفضل!",                          status: "scheduled",  views: 0, likes: 0, comments: 0, shares: 0 },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function SchedulerClient() {
  // Calendar state
  const [month, setMonth] = useState(new Date(2026, 5, 1));
  const [selDate, setSelDate] = useState<string | null>(null);

  // Filter state
  const [platFilter, setPlatFilter] = useState<"all" | Platform>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");

  // Date range state — rangeStart/End are the inputs; applied is what's active
  const [rangeStart, setRangeStart] = useState("2026-06-01");
  const [rangeEnd, setRangeEnd]     = useState("2026-06-30");
  const [applied, setApplied]       = useState({ start: "2026-06-01", end: "2026-06-30" });

  // Posts
  const [posts, setPosts] = useState<Post[]>(INIT_POSTS);

  // Modal state
  const [showModal, setShowModal]   = useState(false);
  const [newPlat, setNewPlat]       = useState<Platform | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [newDate, setNewDate]       = useState("");
  const [newTime, setNewTime]       = useState("12:00");
  const [newStatus, setNewStatus]   = useState<PostStatus>("scheduled");

  // ── Derived ──────────────────────────────────────────────────────────────
  const year        = month.getFullYear();
  const mo          = month.getMonth();
  const daysInMonth = new Date(year, mo + 1, 0).getDate();
  const firstDay    = new Date(year, mo, 1).getDay();
  const today       = toDateStr(new Date());

  const rangePosts = posts.filter(
    p =>
      (platFilter === "all" || p.platform === platFilter) &&
      p.date >= applied.start &&
      p.date <= applied.end,
  );

  const visiblePosts = posts
    .filter(
      p =>
        (platFilter === "all" || p.platform === platFilter) &&
        (statusFilter === "all" || p.status === statusFilter),
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
    const v  = pp.reduce((s, p) => s + p.views, 0);
    const l  = pp.reduce((s, p) => s + p.likes, 0);
    const c  = pp.reduce((s, p) => s + p.comments, 0);
    const sh = pp.reduce((s, p) => s + p.shares, 0);
    return {
      count: pp.length, views: v, likes: l, comments: c, shares: sh,
      er: v > 0 ? (((l + c + sh) / v) * 100).toFixed(1) : "0",
    };
  }

  // Calendar cells: null = empty leading cell
  const cells: Array<{ day: number; ds: string } | null> = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      ds: `${year}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  function openModal(date?: string) {
    setNewPlat(null);
    setNewCaption("");
    setNewDate(date ?? today);
    setNewTime("12:00");
    setNewStatus("scheduled");
    setShowModal(true);
  }

  function savePost() {
    if (!newPlat)            { alert("الرجاء اختيار المنصة"); return; }
    if (!newCaption.trim())  { alert("الرجاء كتابة نص المنشور"); return; }
    setPosts(prev => [
      ...prev,
      {
        id: Date.now(),
        platform: newPlat,
        date: newDate,
        time: newTime,
        caption: newCaption.trim(),
        status: newStatus,
        views: 0, likes: 0, comments: 0, shares: 0,
      },
    ]);
    setShowModal(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="flex-1 overflow-y-auto p-5 space-y-4">

      {/* ── Platform filter + Add button ────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">المنصة:</span>
          {(["all", "instagram", "tiktok", "snapchat"] as const).map(p => {
            const active = platFilter === p;
            return (
              <button
                key={p}
                onClick={() => setPlatFilter(p)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "text-white border-transparent"
                    : "bg-white border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600"
                }`}
                style={
                  active
                    ? p === "all"       ? { background: "#6366F1" }
                    : p === "instagram" ? { background: "#E1306C" }
                    : p === "tiktok"    ? { background: "#010101" }
                    :                     { background: "#E6D800", color: "#422" }
                    : undefined
                }
              >
                {p !== "all" && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: PLATFORM_COLOR[p as Platform] }}
                  />
                )}
                {p === "all" ? "الكل" : PLATFORM_LABEL[p as Platform]}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus size={14} /> إضافة منشور
        </button>
      </div>

      {/* ── Date range bar ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl px-5 py-3 flex items-center gap-3 flex-wrap shadow-sm">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">تحليل الفترة:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">من</span>
          <input
            type="date"
            value={rangeStart}
            onChange={e => setRangeStart(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:border-indigo-400"
            style={{ direction: "ltr" }}
          />
          <span className="text-xs font-semibold text-slate-400">إلى</span>
          <input
            type="date"
            value={rangeEnd}
            onChange={e => setRangeEnd(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:border-indigo-400"
            style={{ direction: "ltr" }}
          />
        </div>
        <button
          onClick={() => setApplied({ start: rangeStart, end: rangeEnd })}
          className="border border-indigo-400 text-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors"
        >
          تطبيق
        </button>
      </div>

      {/* ── Analytics cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: "إجمالي المنشورات", value: rangePosts.length,        sub: "في الفترة المحددة", color: "#6366F1" },
          { label: "المشاهدات",        value: fmtNum(totalViews),       sub: "مشاهدة",            color: "#3B82F6" },
          { label: "الإعجابات",        value: fmtNum(totalLikes),       sub: "إعجاب",             color: "#E1306C" },
          { label: "التعليقات",        value: fmtNum(totalComments),    sub: "تعليق",             color: "#10B981" },
          { label: "المشاركات",        value: fmtNum(totalShares),      sub: "مشاركة",            color: "#F59E0B" },
          { label: "معدل التفاعل",     value: `${engRate}%`,            sub: "من المشاهدات",      color: "#8B5CF6" },
        ].map(card => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-4 shadow-sm border-r-4 hover:-translate-y-0.5 transition-transform"
            style={{ borderRightColor: card.color }}
          >
            <div className="text-[10px] text-slate-400 font-semibold mb-1">{card.label}</div>
            <div className="text-2xl font-extrabold text-slate-800 leading-none mb-1">{card.value}</div>
            <div className="text-[10px] text-emerald-600 font-medium">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Platform breakdown ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["instagram", "tiktok", "snapchat"] as Platform[]).map(pl => {
          const s = platStats(pl);
          const rows: [string, string, boolean][] = [
            ["المشاهدات",     fmtNum(s.views),    false],
            ["الإعجابات",     fmtNum(s.likes),    false],
            ["التعليقات",     fmtNum(s.comments), false],
            ["المشاركات",     fmtNum(s.shares),   false],
            ["معدل التفاعل",  `${s.er}%`,         true ],
          ];
          return (
            <div key={pl} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base"
                  style={platformBg(pl)}
                >
                  {PLATFORM_ICON[pl]}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800">{PLATFORM_LABEL[pl]}</div>
                  <div className="text-xs text-slate-400">{s.count} منشور</div>
                </div>
              </div>
              {rows.map(([lbl, val, accent]) => (
                <div
                  key={lbl}
                  className="flex justify-between py-1.5 text-xs border-b border-slate-100 last:border-b-0"
                >
                  <span className="text-slate-500">{lbl}</span>
                  <span className={`font-semibold ${accent ? "text-indigo-600" : "text-slate-800"}`}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── Calendar + Posts list ────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-4 items-start">

        {/* Calendar */}
        <div className="w-full xl:w-[300px] xl:shrink-0 bg-white rounded-xl p-5 shadow-sm xl:sticky xl:top-4">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600"
            >
              <ChevronRight size={15} />
            </button>
            <span className="text-sm font-bold text-slate-800">{MONTHS[mo]} {year}</span>
            <button
              onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600"
            >
              <ChevronLeft size={15} />
            </button>
          </div>

          {/* Day name headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_SHORT.map(d => (
              <div key={d} className="text-center text-[9px] font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px">
            {cells.map((cell, idx) => {
              if (!cell) return <div key={`e${idx}`} className="aspect-square" />;

              const { day, ds } = cell;
              const isToday   = ds === today;
              const isSel     = ds === selDate;
              const inRange   = ds >= applied.start && ds <= applied.end;
              const dayPosts  = posts.filter(p => p.date === ds);
              const uniqueP   = [...new Set(dayPosts.map(p => p.platform))];

              return (
                <div
                  key={ds}
                  onClick={() => setSelDate(selDate === ds ? null : ds)}
                  className={`aspect-square flex flex-col items-center justify-center cursor-pointer text-[11px] font-medium rounded-md transition-all select-none
                    ${isSel    ? "bg-indigo-600 text-white"
                    : isToday  ? "bg-indigo-50 text-indigo-700 font-bold"
                    : inRange  ? "bg-indigo-50/60 text-indigo-600"
                    :            "text-slate-700 hover:bg-slate-100"}
                  `}
                >
                  <span>{day}</span>
                  {uniqueP.length > 0 && (
                    <div className="flex gap-px mt-0.5">
                      {uniqueP.slice(0, 3).map(pl => (
                        <span
                          key={pl}
                          className="block w-1 h-1 rounded-full"
                          style={{
                            background: isSel ? "rgba(255,255,255,0.8)" : PLATFORM_COLOR[pl],
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected date panel */}
          {selDate && (() => {
            const dayPosts = posts.filter(p => p.date === selDate);
            return (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700">{fmtShortDate(selDate)}</span>
                  <button
                    onClick={() => openModal(selDate)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    + إضافة
                  </button>
                </div>
                {dayPosts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2">لا توجد منشورات</p>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {dayPosts.map(p => (
                      <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 text-xs">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: PLATFORM_COLOR[p.platform] }}
                        />
                        <span className="text-slate-500 font-semibold shrink-0">{p.time}</span>
                        <span className="flex-1 truncate text-slate-700">{p.caption}</span>
                        <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold
                          ${p.status === "published" ? "bg-emerald-100 text-emerald-700"
                          : p.status === "scheduled" ? "bg-blue-100 text-blue-700"
                          :                            "bg-slate-200 text-slate-500"}
                        `}>
                          {STATUS_LABEL[p.status]}
                        </span>
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
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                    ${statusFilter === s
                      ? "bg-white text-slate-800 font-semibold shadow-sm"
                      : "text-slate-500 hover:text-slate-700"}
                  `}
                >
                  {s === "all" ? "الكل" : STATUS_LABEL[s as PostStatus]}
                </button>
              ))}
            </div>
          </div>

          {visiblePosts.length === 0 ? (
            <div className="text-center py-14 text-slate-400">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-sm">لا توجد منشورات</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {visiblePosts.map(p => (
                <div
                  key={p.id}
                  className="px-5 py-4 flex gap-3 items-start hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={platformBg(p.platform)}
                  >
                    {PLATFORM_ICON[p.platform]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-xs font-bold"
                        style={{ color: PLATFORM_COLOR[p.platform] }}
                      >
                        {PLATFORM_LABEL[p.platform]}
                      </span>
                      <span className="text-xs text-slate-400">
                        {fmtShortDate(p.date)} · {p.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 truncate mb-1.5">{p.caption}</p>
                    {p.status === "published" && (
                      <div className="flex gap-3 text-xs text-slate-400">
                        <span>👁 {fmtNum(p.views)}</span>
                        <span>❤️ {fmtNum(p.likes)}</span>
                        <span>💬 {fmtNum(p.comments)}</span>
                        <span>↗️ {fmtNum(p.shares)}</span>
                      </div>
                    )}
                  </div>
                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold
                    ${p.status === "published" ? "bg-emerald-100 text-emerald-700"
                    : p.status === "scheduled" ? "bg-blue-100 text-blue-700"
                    :                            "bg-slate-100 text-slate-500"}
                  `}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add Post Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">منشور جديد</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Platform */}
              <div>
                <label className="block text-sm font-bold mb-2.5 text-slate-700">المنصة</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["instagram", "tiktok", "snapchat"] as Platform[]).map(pl => (
                    <button
                      key={pl}
                      onClick={() => setNewPlat(pl)}
                      className={`border-2 rounded-xl py-3 flex flex-col items-center gap-1.5 transition-all
                        ${newPlat !== pl ? "border-slate-200 hover:border-slate-300" : ""}
                      `}
                      style={
                        newPlat === pl
                          ? {
                              borderColor: PLATFORM_COLOR[pl],
                              background:
                                pl === "instagram" ? "#FCE4EC"
                                : pl === "tiktok"  ? "#E0F7FA"
                                :                    "#FFFDE7",
                            }
                          : undefined
                      }
                    >
                      <span className="text-xl">{PLATFORM_ICON[pl]}</span>
                      <span className="text-xs font-semibold">{PLATFORM_LABEL[pl]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">النص / الكابشن</label>
                <textarea
                  value={newCaption}
                  onChange={e => setNewCaption(e.target.value)}
                  placeholder="اكتب نص المنشور هنا..."
                  rows={4}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">التاريخ</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-400"
                    style={{ direction: "ltr" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">الوقت</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-400"
                    style={{ direction: "ltr" }}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">الحالة</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as PostStatus)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-400"
                >
                  <option value="scheduled">مجدول</option>
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2.5 justify-end px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={savePost}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                حفظ المنشور
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
