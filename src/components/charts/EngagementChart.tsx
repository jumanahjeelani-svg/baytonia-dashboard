"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { weeklyEngagement } from "@/lib/mock-data";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 text-sm">
      <p className="text-slate-700 font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500">{p.name}</span>
          </div>
          <span className="font-semibold text-slate-800">{p.value.toLocaleString("ar-SA")}</span>
        </div>
      ))}
    </div>
  );
};

export default function EngagementChart() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="mb-5">
        <h2 className="text-slate-800 font-bold text-base">التفاعل الأسبوعي</h2>
        <p className="text-slate-400 text-xs mt-0.5">توزيع التفاعل حسب المنصة</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyEngagement} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? (v / 1000).toFixed(0) + "K" : v}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="instagram" name="انستجرام" fill="#E1306C" radius={[4, 4, 0, 0]} />
          <Bar dataKey="tiktok" name="تيك توك" fill="#374151" radius={[4, 4, 0, 0]} />
          <Bar dataKey="snapchat" name="سناب شات" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3 justify-center">
        {[
          { label: "انستجرام", color: "#E1306C" },
          { label: "تيك توك", color: "#374151" },
          { label: "سناب شات", color: "#F59E0B" },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
