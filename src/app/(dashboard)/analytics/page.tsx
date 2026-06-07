'use client';
import { useEffect, useState } from 'react';
import { useDateRange } from '@/DateRangeContext';
import { Users, Eye, ShoppingCart, TrendingUp, Globe, Clock } from 'lucide-react';

interface GA4Data {
  totalSessions: number;
  totalUsers: number;
  totalRevenue: number;
  totalPurchases: number;
  bounceRate: number;
  pageViews: number;
  channelData: { channel: string; sessions: number; revenue: number }[];
}

export default function AnalyticsPage() {
  const { startDate, endDate } = useDateRange();
  const [data, setData] = useState<GA4Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?start=${startDate}&end=${endDate}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [startDate, endDate]);

  const stats = data ? [
    { label: 'الجلسات', value: data.totalSessions.toLocaleString('ar'), icon: Globe, color: 'bg-blue-50 text-blue-600' },
    { label: 'المستخدمون', value: data.totalUsers.toLocaleString('ar'), icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'الإيراد', value: `${data.totalRevenue.toLocaleString('ar')} ر.س`, icon: ShoppingCart, color: 'bg-amber-50 text-amber-600' },
    { label: 'المشتريات', value: data.totalPurchases.toLocaleString('ar'), icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'معدل الارتداد', value: `${(data.bounceRate * 100).toFixed(1)}%`, icon: Clock, color: 'bg-red-50 text-red-600' },
    { label: 'مشاهدات الصفحة', value: data.pageViews.toLocaleString('ar'), icon: Eye, color: 'bg-indigo-50 text-indigo-600' },
  ] : [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
          {data && data.channelData.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-slate-800 mb-4">مصادر الترافيك</h3>
              <div className="space-y-3">
                {data.channelData.map((ch) => (
                  <div key={ch.channel} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{ch.channel}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-800">{ch.sessions.toLocaleString('ar')} جلسة</span>
                      <span className="text-sm text-green-600">{ch.revenue.toLocaleString('ar')} ر.س</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
