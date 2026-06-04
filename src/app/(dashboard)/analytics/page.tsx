import TopBar from '@/components/TopBar';
import { fetchGA4Data } from '@/lib/analytics';
import {
  Users,
  Eye,
  ShoppingCart,
  TrendingUp,
  Globe,
  Clock,
} from 'lucide-react';

export default async function AnalyticsPage() {
  const data = await fetchGA4Data();

  const stats = [
    { label: 'الجلسات', value: data.totalSessions.toLocaleString('ar'), icon: Globe, color: 'bg-blue-50 text-blue-600' },
    { label: 'المستخدمون', value: data.totalUsers.toLocaleString('ar'), icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'الإيراد', value: `${data.totalRevenue.toLocaleString('ar')} ر.س`, icon: ShoppingCart, color: 'bg-amber-50 text-amber-600' },
    { label: 'المشتريات', value: data.totalPurchases.toLocaleString('ar'), icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'معدل الارتداد', value: `${(data.bounceRate * 100).toFixed(1)}%`, icon: Clock, color: 'bg-red-50 text-red-600' },
    { label: 'مشاهدات الصفحة', value: data.pageViews.toLocaleString('ar'), icon: Eye, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <TopBar title="جوجل أناليتيكس" />
      <main className="flex-1 p-4 md:p-6">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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

        {/* Channel Data */}
        {data.channelData.length > 0 && (
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

      </main>
    </div>
  );
}
