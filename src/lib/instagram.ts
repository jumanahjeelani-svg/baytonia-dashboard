const BASE = "https://graph.facebook.com/v21.0";
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!;
const HARDCODED_IG_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

export interface IGProfile {
  id: string;
  username: string;
  name: string;
  biography: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url: string;
  website: string;
}

export interface IGMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  like_count: number;
  comments_count: number;
  timestamp: string;
}

export interface IGInsightValue {
  value: number;
  end_time: string;
}

export interface IGInsight {
  name: string;
  period: string;
  values: IGInsightValue[];
  title: string;
  description: string;
}

export interface IGAccountData {
  profile: IGProfile;
  media: IGMedia[];
  insights: {
    reach: number;
    impressions: number;
    profileViews: number;
    reachDelta: number;
    impressionsDelta: number;
  };
  connected: true;
}

export interface IGError {
  connected: false;
  error: string;
  hint: string;
}

export type IGResult = IGAccountData | IGError;

async function getPageAndIGAccount(): Promise<{ pageId: string; igId: string; pageToken: string } | null> {
  const res = await fetch(
    `${BASE}/me/accounts?fields=id,name,access_token,instagram_business_account{id}&access_token=${TOKEN}`,
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  if (!data.data?.length) return null;

  for (const page of data.data) {
    if (page.instagram_business_account?.id) {
      return {
        pageId: page.id,
        igId: page.instagram_business_account.id,
        pageToken: page.access_token,
      };
    }
  }
  return null;
}

export async function fetchInstagramData(): Promise<IGResult> {
  try {
    const account = await getPageAndIGAccount();

    let igId: string;
    let pageToken: string = TOKEN;

    if (account) {
      igId = account.igId;
      pageToken = account.pageToken;
    } else if (HARDCODED_IG_ID) {
      igId = HARDCODED_IG_ID;
    } else {
      return {
        connected: false,
        error: "لم يتم العثور على حساب انستجرام مرتبط",
        hint: "تأكد من ربط حساب انستجرام البروفيشنال بصفحة فيسبوك، ثم أعد توليد التوكن.",
      };
    }

    const [profileRes, mediaRes, insightsRes] = await Promise.all([
      fetch(
        `${BASE}/${igId}?fields=id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website&access_token=${pageToken}`,
        { next: { revalidate: 300 } }
      ),
      fetch(
        `${BASE}/${igId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,like_count,comments_count,timestamp&limit=12&access_token=${pageToken}`,
        { next: { revalidate: 300 } }
      ),
      fetch(
        `${BASE}/${igId}/insights?metric=reach,impressions,profile_views&period=day&since=${Math.floor(Date.now() / 1000) - 86400 * 30}&until=${Math.floor(Date.now() / 1000)}&access_token=${pageToken}`,
        { next: { revalidate: 300 } }
      ),
    ]);

    const profileRaw = await profileRes.json();
    const mediaData = await mediaRes.json();
    const insightsData = await insightsRes.json();

    if (profileRaw.error) {
      return { connected: false, error: profileRaw.error?.message ?? "خطأ في جلب البيانات", hint: "تحقق من صلاحيات التوكن" };
    }
    const profile = profileRaw as IGProfile;

    const media: IGMedia[] = mediaData.data ?? [];

    let reach = 0, impressions = 0, profileViews = 0;
    let reachDelta = 0, impressionsDelta = 0;

    if (insightsData.data) {
      for (const insight of insightsData.data as IGInsight[]) {
        const vals = insight.values ?? [];
        const total = vals.reduce((s: number, v: IGInsightValue) => s + v.value, 0);
        if (insight.name === "reach") {
          reach = total;
          const half = Math.floor(vals.length / 2);
          const first = vals.slice(0, half).reduce((s: number, v: IGInsightValue) => s + v.value, 0);
          const second = vals.slice(half).reduce((s: number, v: IGInsightValue) => s + v.value, 0);
          reachDelta = first > 0 ? Math.round(((second - first) / first) * 100) : 0;
        }
        if (insight.name === "impressions") {
          impressions = total;
          const half = Math.floor(vals.length / 2);
          const first = vals.slice(0, half).reduce((s: number, v: IGInsightValue) => s + v.value, 0);
          const second = vals.slice(half).reduce((s: number, v: IGInsightValue) => s + v.value, 0);
          impressionsDelta = first > 0 ? Math.round(((second - first) / first) * 100) : 0;
        }
        if (insight.name === "profile_views") profileViews = total;
      }
    }

    return {
      connected: true,
      profile,
      media,
      insights: { reach, impressions, profileViews, reachDelta, impressionsDelta },
    };
  } catch (err) {
    return {
      connected: false,
      error: "خطأ في الاتصال بـ Instagram API",
      hint: String(err),
    };
  }
}
