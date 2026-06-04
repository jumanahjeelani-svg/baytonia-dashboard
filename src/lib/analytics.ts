const WINDSOR_BASE = 'https://connectors.windsor.ai/googleanalytics4';
const ACCOUNT_ID = '296803613';

export interface GA4Data {
  totalSessions: number;
  totalUsers: number;
  totalRevenue: number;
  totalPurchases: number;
  bounceRate: number;
  pageViews: number;
  dailyData: { date: string; sessions: number; users: number; revenue: number }[];
  channelData: { channel: string; sessions: number; revenue: number }[];
}

export async function fetchGA4Data(): Promise<GA4Data> {
  const apiKey = process.env.WINDSOR_AI_API_KEY;

  if (!apiKey) {
    return getMockData();
  }

  try {
    const url = `${WINDSOR_BASE}?api_key=${apiKey}&date_preset=last_30d&fields=date,active_users,sessions,purchase_revenue,ecommerce_purchases,bounce_rate,screen_page_views,default_channel_group&account_id=${ACCOUNT_ID}`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const json = await res.json();
    const rows = json.data || [];

    const dailyMap: Record<string, any> = {};
    const channelMap: Record<string, any> = {};

    let totalSessions = 0, totalUsers = 0, totalRevenue = 0;
    let totalPurchases = 0, totalBounce = 0, totalPageViews = 0;
    let count = 0;

    for (const row of rows) {
      const date = row.date?.slice(0, 10) || '';
      if (!dailyMap[date]) dailyMap[date] = { date, sessions: 0, users: 0, revenue: 0 };
      dailyMap[date].sessions += row.sessions || 0;
      dailyMap[date].users += row.active_users || 0;
      dailyMap[date].revenue += row.purchase_revenue || 0;

      const ch = row.default_channel_group || 'Other';
      if (!channelMap[ch]) channelMap[ch] = { channel: ch, sessions: 0, revenue: 0 };
      channelMap[ch].sessions += row.sessions || 0;
      channelMap[ch].revenue += row.purchase_revenue || 0;

      totalSessions += row.sessions || 0;
      totalUsers += row.active_users || 0;
      totalRevenue += row.purchase_revenue || 0;
      totalPurchases += row.ecommerce_purchases || 0;
      totalBounce += row.bounce_rate || 0;
      totalPageViews += row.screen_page_views || 0;
      count++;
    }

    return {
      totalSessions,
      totalUsers,
      totalRevenue,
      totalPurchases,
      bounceRate: count > 0 ? totalBounce / count : 0,
      pageViews: totalPageViews,
      dailyData: Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date)),
      channelData: Object.values(channelMap).sort((a, b) => b.sessions - a.sessions).slice(0, 6),
    };
  } catch {
    return getMockData();
  }
}

function getMockData(): GA4Data {
  return {
    totalSessions: 1847432,
    totalUsers: 892341,
    totalRevenue: 4823651,
    totalPurchases: 1847,
    bounceRate: 0.124,
    pageViews: 4521000,
    dailyData: [],
    channelData: [
      { channel: 'Organic Social', sessions: 850000, revenue: 1200000 },
      { channel: 'Direct', sessions: 420000, revenue: 980000 },
      { channel: 'Paid Search', sessions: 280000, revenue: 1100000 },
      { channel: 'Organic Search', sessions: 180000, revenue: 650000 },
      { channel: 'Paid Shopping', sessions: 90000, revenue: 520000 },
      { channel: 'Display', sessions: 27432, revenue: 373651 },
    ],
  };
}
