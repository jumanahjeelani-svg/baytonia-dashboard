import { NextRequest, NextResponse } from 'next/server';

const WINDSOR_BASE = 'https://connectors.windsor.ai/googleanalytics4';
const ACCOUNT_ID = '296803613';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  const apiKey = process.env.WINDSOR_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    let dateParam = 'date_preset=last_30d';
    if (startDate && endDate) {
      dateParam = `date_from=${startDate}&date_to=${endDate}`;
    }

    const url = `${WINDSOR_BASE}?api_key=${apiKey}&${dateParam}&fields=date,active_users,sessions,purchase_revenue,ecommerce_purchases,bounce_rate,screen_page_views,default_channel_group&account_id=${ACCOUNT_ID}`;

    const res = await fetch(url, { cache: 'no-store' });
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

    return NextResponse.json({
      totalSessions,
      totalUsers,
      totalRevenue,
      totalPurchases,
      bounceRate: count > 0 ? totalBounce / count : 0,
      pageViews: totalPageViews,
      dailyData: Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date)),
      channelData: Object.values(channelMap).sort((a, b) => b.sessions - a.sessions).slice(0, 6),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
