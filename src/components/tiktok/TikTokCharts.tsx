"use client";

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { dailyViews, weeklyEngagementByDay, audienceByAge } from "@/lib/tiktok-data";
import { useState } from "react";

type MetricKey = "views" | "likes" | "comments" | "shares";

const metrics: { key: MetricKey; label: string; color: string }[] = [
  { key: "views",    label: "مشاهدات",  color: "#6366F1" },
  { key: "likes",    label: "إعجابات",  color: "#F43F5E" },
  { key: "comments", label: "تعليقات",  color: "#F59E0B" },
  { key: "shares",   label: "مشاركات",  color: "#10B981" },
];

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; color: string; name: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 text-sm min-w-[150px]">
      <p className="text-slate-600 font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500">{p.name}</span>
          </div>
          <span className="font-bold text-slate-800">
            {p.value >= 1000 ? (p.value / 1000).toFixed(1) + "K" : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ---------- Views over time ---------- */
export function ViewsChart() {
  const [active, setActive] = useState<MetricKey>("views");
  const m = metrics.find((x) => x.key === active)!;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-slate-800 font-bold text-base">الأداء اليومي</h2>
          <p className="text-slate-400 text-xs mt-0.5">آخر 30 يوم</p>
        </div>
        <div className="flex gap-1">
          {metrics.map((mt) => (
            <button
              key={mt.key}
              onClick={() => setActive(mt.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                active === mt.key
                  ? "text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
              style={active === mt.key ? { background: mt.color } : {}}
            >
              {mt.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={dailyViews} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`tiktok-${active}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={m.color} stopOpacity={0.18} />
              <stop offset="95%" stopColor={m.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={2} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v >= 1000 ? (v / 1000).toFixed(0) + "K" : v} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={active}
            name={m.label}
            stroke={m.color}
            strokeWidth={2.5}
            fill={`url(#tiktok-${active})`}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- Engagement by day of week ---------- */
export function WeeklyChart() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="mb-4">
        <h2 className="text-slate-800 font-bold text-base">أفضل أيام النشر</h2>
        <p className="text-slate-400 text-xs mt-0.5">متوسط المشاهدات يومياً</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyEngagementByDay} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v >= 1000 ? (v / 1000).toFixed(0) + "K" : v} />
          <Tooltip
            formatter={(v) => {
              const n = typeof v === "number" ? v : Number(v);
              return [n >= 1000 ? (n / 1000).toFixed(1) + "K" : n, "مشاهدات"];
            }}
            contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", fontSize: 12 }}
          />
          <Bar dataKey="views" radius={[6, 6, 0, 0]}>
            {weeklyEngagementByDay.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.day === "الجمعة" || entry.day === "الخميس" || entry.day === "السبت"
                  ? "#6366F1" : "#E2E8F0"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 text-center mt-2">
        <span className="text-indigo-500 font-semibold">الخميس–السبت</span> أعلى أداءً للمحتوى
      </p>
    </div>
  );
}

/* ---------- Audience by age ---------- */
export function AudienceChart() {
  const maxPct = Math.max(...audienceByAge.map((a) => a.percent));
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="mb-4">
        <h2 className="text-slate-800 font-bold text-base">الجمهور حسب الفئة العمرية</h2>
        <p className="text-slate-400 text-xs mt-0.5">توزيع المتابعين</p>
      </div>
      <div className="space-y-3">
        {audienceByAge.map((a) => (
          <div key={a.age} className="flex items-center gap-3">
            <span className="text-slate-600 text-xs font-medium w-10 shrink-0 text-left">{a.age}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(a.percent / maxPct) * 100}%`,
                  background: a.percent === maxPct ? "#6366F1" : "#A5B4FC",
                }}
              />
            </div>
            <span className={`text-xs font-bold w-8 text-left shrink-0 ${a.percent === maxPct ? "text-indigo-600" : "text-slate-500"}`}>
              {a.percent}%
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-4 border-t border-slate-100 pt-3">
        الشريحة الأكبر: <span className="text-indigo-600 font-semibold">25–34 سنة</span> (42%)
      </p>
    </div>
  );
}
