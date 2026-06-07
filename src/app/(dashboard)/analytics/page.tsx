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
    { label: 'المشتريات', val
