import MetricCard from "@/components/MetricCard";
import TikTokVideoGrid from "@/components/tiktok/TikTokVideoGrid";
import TikTokHashtags from "@/components/tiktok/TikTokHashtags";
import { ViewsChart, WeeklyChart, AudienceChart } from "@/components/tiktok/TikTokCharts";
import { tiktokProfile, tiktokOverview, fmt } from "@/lib/tiktok-data";
import {
  Users, Eye, Heart, TrendingUp,
  Play, Clock, Percent, ExternalLink,
} from "lucide-react";

export default function TikTokPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-slate-900 rounded-2xl p-5 flex items-center gap-5 text-white">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00F2EA] to-[#FF0050] p-0.5 shrink-0">
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold">ب</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">{tiktokProfile.displayName}</h2>
              <a href={`https://tiktok.com/@${tiktokProfile.username}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                <ExternalLink size={14} />
              </a>
            </div>
            <p className="text-slate-400 text-sm">@{tiktokProfile.username}</p>
            <p className="text-slate-300 text-xs mt-1 whitespace-pre-line leading-relaxed">{tiktokProfile.bio}</p>
          </div>
          <div className="flex gap-6 shrink-0">
            {[
              { label: "متابع", value: fmt(tiktokProfile.followers) },
              { label: "يتابع", value: fmt(tiktokProfile.following) },
              { label: "إعجاب", value: fmt(tiktokProfile.likes) },
              { label: "فيديو", value: String(tiktokProfile.videoCount) },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-lg leading-none">{value}</p>
                <p className="text-slate-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="shrink-0 flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-xs font-medium">بيانات محدّثة</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="المتابعون" value={tiktokOverview.followers.value} change={tiktokOverview.followers.change} icon={Users} iconBg="bg-indigo-50" iconColor="text-indigo-600" description="إجمالي المتابعين" />
          <MetricCard label="إجمالي المشاهدات" value={tiktokOverview.totalViews.value} change={tiktokOverview.totalViews.change} icon={Eye} iconBg="bg-violet-50" iconColor="text-violet-600" description="هذا الشهر" />
          <MetricCard label="إجمالي الإعجابات" value={tiktokOverview.totalLikes.value} change={tiktokOverview.totalLikes.change} icon={Heart} iconBg="bg-rose-50" iconColor="text-rose-600" description="على جميع الفيديوهات" />
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Percent className="text-amber-600" size={22} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                <TrendingUp size={11} />{tiktokOverview.engagementRate.change}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">معدل التفاعل</p>
            <p className="text-slate-900 text-2xl font-bold">{tiktokOverview.engagementRate.value}<span className="text-base font-medium text-slate-500 mr-0.5">%</span></p>
            <p className="text-slate-400 text-xs mt-1">أعلى من متوسط المنصة (3.5%)</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Play, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", label: "مشاهدات الملف الشخصي", value: fmt(tiktokProfile.profileViews), sub: `+${tiktokProfile.profileViewsChange}% هذا الشهر` },
            { icon: Clock, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "متوسط وقت المشاهدة", value: `${tiktokProfile.avgWatchTime}ث`, sub: "لكل فيديو" },
            { icon: TrendingUp, iconBg: "bg-rose-50", iconColor: "text-rose-600", label: "معدل إكمال المشاهدة", value: `${tiktokProfile.completionRate}%`, sub: "من المشاهدين يُكملون الفيديو" },
          ].map(({ icon: Icon, iconBg, iconColor, label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}><Icon size={18} className={iconColor} /></div>
              <div>
                <p className="text-slate-500 text-xs">{label}</p>
                <p className="text-slate-900 font-bold text-xl">{value}</p>
                <p className="text-slate-400 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><ViewsChart /></div>
          <WeeklyChart />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><TikTokVideoGrid /></div>
          <div className="flex flex-col gap-4">
            <TikTokHashtags />
            <AudienceChart />
          </div>
        </div>
      </main>
    </div>
  );
}
