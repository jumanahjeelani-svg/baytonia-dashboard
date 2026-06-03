import TopBar from "@/components/TopBar";
import { fetchInstagramData } from "@/lib/instagram";
import SetupGuide from "@/components/instagram/SetupGuide";
import MediaGrid from "@/components/instagram/MediaGrid";
import { Users, Eye, TrendingUp, Heart, UserCheck, Image, ExternalLink } from "lucide-react";

function StatCard({
  label, value, sub, icon: Icon, iconBg, iconColor,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
        <Icon size={20} className={iconColor} />
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

export default async function InstagramPage() {
  const data = await fetchInstagramData();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="انستجرام" />
      <main className="flex-1 overflow-y-auto p-6">
        {!data.connected ? (
          <SetupGuide error={data.error} hint={data.hint} />
        ) : (
          <div className="space-y-6">
            {/* Profile header */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-5">
              {data.profile.profile_picture_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.profile.profile_picture_url}
                  alt={data.profile.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-2xl font-bold">
                  {data.profile.username?.[0]?.toUpperCase() ?? "B"}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-slate-800 font-bold text-lg">
                    {data.profile.name || data.profile.username}
                  </h2>
                  <a
                    href={`https://instagram.com/${data.profile.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <p className="text-slate-500 text-sm">@{data.profile.username}</p>
                {data.profile.biography && (
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">{data.profile.biography}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-emerald-600 text-sm font-medium">متصل</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="المتابعون"
                value={formatNum(data.profile.followers_count)}
                icon={Users}
                iconBg="bg-pink-50"
                iconColor="text-pink-600"
              />
              <StatCard
                label="يتابع"
                value={formatNum(data.profile.follows_count)}
                icon={UserCheck}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
              />
              <StatCard
                label="المنشورات"
                value={formatNum(data.profile.media_count)}
                icon={Image}
                iconBg="bg-rose-50"
                iconColor="text-rose-600"
              />
              <StatCard
                label="الوصول الشهري"
                value={data.insights.reach > 0 ? formatNum(data.insights.reach) : "—"}
                sub={data.insights.reachDelta !== 0 ? `${data.insights.reachDelta > 0 ? "+" : ""}${data.insights.reachDelta}% عن الشهر الماضي` : undefined}
                icon={Eye}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
              />
            </div>

            {/* Insights row */}
            {data.insights.impressions > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="الانطباعات الشهرية"
                  value={formatNum(data.insights.impressions)}
                  sub={data.insights.impressionsDelta !== 0 ? `${data.insights.impressionsDelta > 0 ? "+" : ""}${data.insights.impressionsDelta}%` : undefined}
                  icon={TrendingUp}
                  iconBg="bg-amber-50"
                  iconColor="text-amber-600"
                />
                <StatCard
                  label="مشاهدات الملف الشخصي"
                  value={formatNum(data.insights.profileViews)}
                  icon={Heart}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-600"
                />
              </div>
            )}

            {/* Media grid */}
            {data.media.length > 0 && <MediaGrid media={data.media} />}
          </div>
        )}
      </main>
    </div>
  );
}
