import TopBar from "@/components/TopBar";
import MetricCard from "@/components/MetricCard";
import SnapchatSnapsGrid from "@/components/snapchat/SnapchatSnapsGrid";
import SnapchatStories from "@/components/snapchat/SnapchatStories";
import { StoryViewsChart, WeeklyChart, AudienceChart } from "@/components/snapchat/SnapchatCharts";
import { snapchatProfile, snapchatOverview, fmt } from "@/lib/snapchat-data";
import {
  Users, Eye, TrendingUp, CheckCircle,
  Camera, MessageCircle, ChevronsUp, ExternalLink,
} from "lucide-react";

export default function SnapchatPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="سناب شات" />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ── Profile card ── */}
        <div className="bg-slate-900 rounded-2xl p-5 flex items-center gap-5 text-white">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFFC00] to-[#FFB800] p-0.5 shrink-0">
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold">
              ب
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">{snapchatProfile.displayName}</h2>
              <a
                href={`https://snapchat.com/add/${snapchatProfile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <p className="text-slate-400 text-sm">@{snapchatProfile.username}</p>
            <p className="text-slate-300 text-xs mt-1 whitespace-pre-line leading-relaxed">
              {snapchatProfile.bio}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-6 shrink-0">
            {[
              { label: "مشترك",   value: fmt(snapchatProfile.subscribers) },
              { label: "قصة",     value: String(snapchatProfile.storiesPosted) },
              { label: "سناب سكور", value: fmt(snapchatProfile.snapScore) },
              { label: "إكمال",   value: `${snapchatProfile.avgCompletionRate}%` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-lg leading-none">{value}</p>
                <p className="text-slate-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="shrink-0 flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-xs font-medium">بيانات محدّثة</span>
          </div>
        </div>

        {/* ── Metric cards ── */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="المشتركون"
            value={snapchatOverview.subscribers.value}
            change={snapchatOverview.subscribers.change}
            icon={Users}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            description="إجمالي المشتركين"
          />
          <MetricCard
            label="إجمالي المشاهدات"
            value={snapchatOverview.totalViews.value}
            change={snapchatOverview.totalViews.change}
            icon={Eye}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
            description="هذا الشهر"
          />
          <MetricCard
            label="معدل التفاعل"
            value={snapchatOverview.engagementRate.value}
            change={snapchatOverview.engagementRate.change}
            icon={TrendingUp}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            description="متوسط التفاعل"
          />
          <MetricCard
            label="معدل الإكمال"
            value={snapchatOverview.completionRate.value}
            change={snapchatOverview.completionRate.change}
            icon={CheckCircle}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            description="يُكملون القصة كاملاً"
          />
        </div>

        {/* ── Extra quick stats ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: Camera, iconBg: "bg-amber-50", iconColor: "text-amber-600",
              label: "متوسط لقطات الشاشة", value: `${snapchatProfile.avgScreenshots}`,
              sub: "لكل قصة",
            },
            {
              icon: MessageCircle, iconBg: "bg-blue-50", iconColor: "text-blue-600",
              label: "مشاهدات الملف الشخصي", value: fmt(snapchatProfile.profileViews),
              sub: `+${snapchatProfile.profileViewsChange}% هذا الشهر`,
            },
            {
              icon: ChevronsUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-600",
              label: "إجمالي القصص المنشورة", value: String(snapchatProfile.storiesPosted),
              sub: "هذا الشهر",
            },
          ].map(({ icon: Icon, iconBg, iconColor, label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={iconColor} />
              </div>
              <div>
                <p className="text-slate-500 text-xs">{label}</p>
                <p className="text-slate-900 font-bold text-xl">{value}</p>
                <p className="text-slate-400 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Story views chart + Weekly chart ── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <StoryViewsChart />
          </div>
          <WeeklyChart />
        </div>

        {/* ── Top snaps + Stories performance + Audience ── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <SnapchatSnapsGrid />
          </div>
          <div className="flex flex-col gap-4">
            <SnapchatStories />
            <AudienceChart />
          </div>
        </div>

      </main>
    </div>
  );
}
