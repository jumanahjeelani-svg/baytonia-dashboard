import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA4_PROPERTY_ID!;

function getClient() {
  const keyJson = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (keyJson) {
    const credentials = JSON.parse(keyJson);
    return new BetaAnalyticsDataClient({ credentials });
  }
  // Falls back to GOOGLE_APPLICATION_CREDENTIALS env var or ADC
  return new BetaAnalyticsDataClient();
}

export interface GA4Metrics {
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  sessionsDelta: number;
  usersDelta: number;
  pageViewsDelta: number;
  topPages: { page: string; views: number }[];
  topSources: { source: string; sessions: number }[];
  dailySessions: { date: string; sessions: number; users: number }[];
  connected: true;
}

export interface GA4Error {
  connected: false;
  error: string;
  hint: string;
}

export type GA4Result = GA4Metrics | GA4Error;

type SDKRow = { dimensionValues?: { value?: string | null }[] | null; metricValues?: { value?: string | null }[] | null };

function rowValue(row: SDKRow, dimIdx: number): string {
  return row.dimensionValues?.[dimIdx]?.value ?? "";
}

function rowMetric(row: SDKRow, metIdx: number): number {
  return parseFloat(row.metricValues?.[metIdx]?.value ?? "0") || 0;
}

export async function fetchGA4Data(): Promise<GA4Result> {
  try {
    const client = getClient();
    const property = `properties/${propertyId}`;

    const today = new Date();
    const toGA = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(today.getDate() - 30);
    const sixtyDaysAgo = new Date(today); sixtyDaysAgo.setDate(today.getDate() - 60);

    const [summaryRes, topPagesRes, topSourcesRes, dailyRes] = await Promise.all([
      client.runReport({
        property,
        dateRanges: [
          { startDate: toGA(thirtyDaysAgo), endDate: "today", name: "current" },
          { startDate: toGA(sixtyDaysAgo), endDate: toGA(thirtyDaysAgo), name: "previous" },
        ],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
        ],
      }),
      client.runReport({
        property,
        dateRanges: [{ startDate: toGA(thirtyDaysAgo), endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        limit: 5,
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      }),
      client.runReport({
        property,
        dateRanges: [{ startDate: toGA(thirtyDaysAgo), endDate: "today" }],
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        limit: 5,
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      }),
      client.runReport({
        property,
        dateRanges: [{ startDate: toGA(thirtyDaysAgo), endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
    ]);

    const rows = summaryRes[0]?.rows ?? [];
    const curRow = rows.find((r) => r.dimensionValues?.[0]?.value === "current") ?? rows[0];
    const prevRow = rows.find((r) => r.dimensionValues?.[0]?.value === "previous") ?? rows[1];

    const empty: SDKRow = {};
    const cur = {
      sessions: rowMetric(curRow ?? empty, 0),
      users: rowMetric(curRow ?? empty, 1),
      pageViews: rowMetric(curRow ?? empty, 2),
      bounceRate: rowMetric(curRow ?? empty, 3),
      avgSessionDuration: rowMetric(curRow ?? empty, 4),
    };
    const prev = {
      sessions: rowMetric(prevRow ?? empty, 0),
      users: rowMetric(prevRow ?? empty, 1),
      pageViews: rowMetric(prevRow ?? empty, 2),
    };

    const delta = (c: number, p: number) => (p > 0 ? Math.round(((c - p) / p) * 100) : 0);

    const topPages = (topPagesRes[0]?.rows ?? []).map((r) => ({
      page: rowValue(r, 0),
      views: rowMetric(r, 0),
    }));

    const topSources = (topSourcesRes[0]?.rows ?? []).map((r) => ({
      source: rowValue(r, 0),
      sessions: rowMetric(r, 0),
    }));

    const dailySessions = (dailyRes[0]?.rows ?? []).map((r) => {
      const raw = rowValue(r, 0);
      const formatted = `${raw.slice(6, 8)}/${raw.slice(4, 6)}`;
      return { date: formatted, sessions: rowMetric(r, 0), users: rowMetric(r, 1) };
    });

    return {
      connected: true,
      sessions: cur.sessions,
      users: cur.users,
      pageViews: cur.pageViews,
      bounceRate: Math.round(cur.bounceRate * 100),
      avgSessionDuration: Math.round(cur.avgSessionDuration),
      sessionsDelta: delta(cur.sessions, prev.sessions),
      usersDelta: delta(cur.users, prev.users),
      pageViewsDelta: delta(cur.pageViews, prev.pageViews),
      topPages,
      topSources,
      dailySessions,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isAuth = msg.includes("credentials") || msg.includes("UNAUTHENTICATED") || msg.includes("Could not load");
    return {
      connected: false,
      error: "تعذّر الاتصال بـ Google Analytics",
      hint: isAuth
        ? "أضف بيانات اعتماد حساب الخدمة إلى GA4_SERVICE_ACCOUNT_KEY في ملف .env.local"
        : msg,
    };
  }
}
