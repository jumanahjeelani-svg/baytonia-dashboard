import TopBar from "@/components/TopBar";
import { fetchGA4Data } from "@/lib/analytics";
import {
  Users, Eye, MousePointerClick, Clock, Globe, FileText,
  TrendingUp, TrendingDown, AlertCircle,
} from "lucide-react";
import GA4Chart from "@/components/analytics/GA4Chart";

function StatCard({
  label, value, sub, delta, icon: Icon, iconBg, iconColor,
}: {
  label: string; value: string; sub?: string; delta?: number;
  icon: React.ElementType; iconBg: string; iconColor: string;
}) {
  const up = delta !== undefined && delta >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
        {delta !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-slate-900 text-2xl font-bold mt-0.5">{value}</p>
      {sub && <p className="text-slate-400 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "م";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "ألف";
  return n.toLocaleString("ar-SA");
}

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}د ${s}ث`;
}

export default async function AnalyticsPage() {
  const data = await fetchGA4Data();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="جوجل أناليتيكس" />
      <main className="flex-1 overflow-y-auto p-6">
      {!data.totalSessions ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-slate-800 font-bold text-lg mb-2">{data.error}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{data.hint}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status bar */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-slate-500 text-sm">Property ID: {process.env.GA4_PROPERTY_ID} · آخر 30 يوماً</span>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="الجلسات"
                value={formatNum(data.sessions)}
                delta={data.sessionsDelta}
                sub="آخر 30 يوماً"
                icon={MousePointerClick}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
              />
              <StatCard
                label="المستخدمون النشطون"
                value={formatNum(data.users)}
                delta={data.usersDelta}
                sub="آخر 30 يوماً"
                icon={Users}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
              />
              <StatCard
                label="مشاهدات الصفحات"
                value={formatNum(data.pageViews)}
                delta={data.pageViewsDelta}
                sub="آخر 30 يوماً"
                icon={Eye}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
              />
              <StatCard
                label="متوسط مدة الجلسة"
                value={formatDuration(data.avgSessionDuration)}
                sub={`معدل الارتداد: ${data.bounceRate}%`}
                icon={Clock}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
              />
            </div>

            {/* Chart */}
            <GA4Chart data={data.dailySessions} />

            {/* Bottom row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Top pages */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-slate-400" />
                  <h3 className="text-slate-700 font-semibold text-sm">الصفحات الأكثر زيارة</h3>
                </div>
                <div className="space-y-3">
                  {data.topPages.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <span className="text-slate-600 text-sm truncate flex-1 font-mono text-xs">{p.page}</span>
                      <span className="text-slate-800 text-sm font-semibold shrink-0">{formatNum(p.views)}</span>
                    </div>
                  ))}
                  {data.topPages.length === 0 && <p className="text-slate-400 text-sm">لا توجد بيانات</p>}
                </div>
              </div>

              {/* Top sources */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={16} className="text-slate-400" />
                  <h3 className="text-slate-700 font-semibold text-sm">مصادر الزيارات</h3>
                </div>
                <div className="space-y-3">
                  {data.topSources.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <span className="text-slate-600 text-sm truncate flex-1">{s.source || "(direct)"}</span>
                      <span className="text-slate-800 text-sm font-semibold shrink-0">{formatNum(s.sessions)}</span>
                    </div>
                  ))}
                  {data.topSources.length === 0 && <p className="text-slate-400 text-sm">لا توجد بيانات</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
