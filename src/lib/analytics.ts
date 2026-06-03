import Anthropic from "@anthropic-ai/sdk";

const ACCOUNT_ID = process.env.WINDSOR_AI_ACCOUNT_ID ?? "296803613";

export interface GA4Metrics {
  connected: true;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  purchaseRevenue: number;
  ecommercePurchases: number;
  sessionsDelta: number;
  usersDelta: number;
  pageViewsDelta: number;
  topPages: { page: string; views: number }[];
  topSources: { source: string; sessions: number }[];
  dailySessions: { date: string; sessions: number; users: number }[];
}

export interface GA4Error {
  connected: false;
  error: string;
  hint: string;
}

export type GA4Result = GA4Metrics | GA4Error;

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const RETURN_TOOL_NAME = "return_ga4_metrics";

const RETURN_TOOL: Anthropic.Tool = {
  name: RETURN_TOOL_NAME,
  description:
    "Return computed GA4 metrics after fetching and aggregating data from Windsor.ai.",
  input_schema: {
    type: "object" as const,
    properties: {
      sessions: { type: "number" },
      users: { type: "number" },
      pageViews: { type: "number" },
      bounceRate: { type: "number", description: "Percentage 0–100" },
      avgSessionDuration: { type: "number", description: "Seconds" },
      purchaseRevenue: { type: "number" },
      ecommercePurchases: { type: "number" },
      sessionsDelta: { type: "number", description: "% change vs previous period" },
      usersDelta: { type: "number", description: "% change vs previous period" },
      pageViewsDelta: { type: "number", description: "% change vs previous period" },
      topPages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            page: { type: "string" },
            views: { type: "number" },
          },
          required: ["page", "views"],
        },
        description: "Top 5 pages by page views",
      },
      topSources: {
        type: "array",
        items: {
          type: "object",
          properties: {
            source: { type: "string" },
            sessions: { type: "number" },
          },
          required: ["source", "sessions"],
        },
        description: "Top 5 traffic channels by sessions",
      },
      dailySessions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            date: { type: "string", description: "DD/MM format" },
            sessions: { type: "number" },
            users: { type: "number" },
          },
          required: ["date", "sessions", "users"],
        },
        description: "Daily sessions and users for the last 30 days",
      },
    },
    required: [
      "sessions", "users", "pageViews", "bounceRate", "avgSessionDuration",
      "purchaseRevenue", "ecommercePurchases", "sessionsDelta", "usersDelta",
      "pageViewsDelta", "topPages", "topSources", "dailySessions",
    ],
  },
};

export async function fetchGA4Data(): Promise<GA4Result> {
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const windsorKey = process.env.WINDSOR_AI_API_KEY;

    console.log("[analytics] fetchGA4Data called");
    console.log("[analytics] ANTHROPIC_API_KEY present:", !!anthropicKey);
    console.log("[analytics] WINDSOR_AI_API_KEY present:", !!windsorKey);
    console.log("[analytics] WINDSOR_AI_ACCOUNT_ID:", ACCOUNT_ID);

    if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY غير مضبوط في .env.local");
    if (!windsorKey) throw new Error("WINDSOR_AI_API_KEY غير مضبوط في .env.local");

    const client = new Anthropic({ apiKey: anthropicKey });

    const today = new Date();
    const d30 = new Date(today);
    d30.setDate(today.getDate() - 30);
    const d60 = new Date(today);
    d60.setDate(today.getDate() - 60);

    const dateNow = toISO(today);
    const date30 = toISO(d30);
    const date60 = toISO(d60);

    console.log("[analytics] Fetching GA4 data — period:", date30, "→", dateNow, "prev:", date60);

    const response = await (client.beta.messages.create as Function)({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      betas: ["mcp-client-2025-11-20"],
      mcp_servers: [
        {
          type: "url",
          name: "windsor",
          url: "https://mcp.windsor.ai",
          authorization_token: windsorKey,
        },
      ],
      tools: [RETURN_TOOL],
      tool_choice: { type: "auto" },
      messages: [
        {
          role: "user",
          content: `You have access to Windsor.ai tools. Use them to fetch Google Analytics 4 data for account/property ID ${ACCOUNT_ID}.

Fetch the following and then call ${RETURN_TOOL_NAME}:

1. Current period (${date30} to ${dateNow}): fields=sessions,active_users,screen_page_views,bounce_rate,average_session_duration,purchase_revenue,ecommerce_purchases
2. Previous period (${date60} to ${date30}): fields=sessions,active_users,screen_page_views
3. Daily data (${date30} to ${dateNow}): fields=date,sessions,active_users
4. Top pages (${date30} to ${dateNow}): fields=page_path,screen_page_views
5. Traffic channels (${date30} to ${dateNow}): fields=default_channel_group,sessions

Aggregation rules:
- Sum all rows for totals (sessions, users, pageViews, revenue, purchases).
- Weighted-average bounce_rate and average_session_duration by sessions; if bounce_rate is 0–1 multiply by 100.
- delta = round((current − previous) / previous × 100) — use 0 if previous is 0.
- topPages: aggregate by page_path, take top 5 by views.
- topSources: aggregate by default_channel_group, take top 5 by sessions.
- dailySessions: sort by date ascending; format date as DD/MM.

Call ${RETURN_TOOL_NAME} with the results.`,
        },
      ],
    });

    console.log("[analytics] API response stop_reason:", (response as Anthropic.Message).stop_reason);
    console.log("[analytics] API response content blocks:", (response as Anthropic.Message).content.map(b => b.type));

    for (const block of (response as Anthropic.Message).content) {
      if (block.type === "tool_use") {
        console.log("[analytics] tool_use block name:", block.name);
        if (block.name === RETURN_TOOL_NAME) {
          console.log("[analytics] return_ga4_metrics input:", JSON.stringify(block.input, null, 2));
        }
      }
      if (block.type === "text") {
        console.log("[analytics] text block:", block.text.slice(0, 300));
      }
    }

    for (const block of (response as Anthropic.Message).content) {
      if (block.type === "tool_use" && block.name === RETURN_TOOL_NAME) {
        const inp = block.input as Record<string, unknown>;
        const result: GA4Metrics = {
          connected: true,
          sessions: Math.round(Number(inp.sessions) || 0),
          users: Math.round(Number(inp.users) || 0),
          pageViews: Math.round(Number(inp.pageViews) || 0),
          bounceRate: Math.round(Number(inp.bounceRate) || 0),
          avgSessionDuration: Math.round(Number(inp.avgSessionDuration) || 0),
          purchaseRevenue: Math.round(Number(inp.purchaseRevenue) || 0),
          ecommercePurchases: Math.round(Number(inp.ecommercePurchases) || 0),
          sessionsDelta: Math.round(Number(inp.sessionsDelta) || 0),
          usersDelta: Math.round(Number(inp.usersDelta) || 0),
          pageViewsDelta: Math.round(Number(inp.pageViewsDelta) || 0),
          topPages: (inp.topPages as { page: string; views: number }[]) ?? [],
          topSources: (inp.topSources as { source: string; sessions: number }[]) ?? [],
          dailySessions: (inp.dailySessions as { date: string; sessions: number; users: number }[]) ?? [],
        };
        console.log("[analytics] Parsed metrics — sessions:", result.sessions, "users:", result.users);
        return result;
      }
    }

    // Fallback: try text blocks for embedded JSON
    for (const block of (response as Anthropic.Message).content) {
      if (block.type === "text") {
        const m = block.text.match(/\{[\s\S]*\}/);
        if (m) {
          console.log("[analytics] Falling back to JSON extraction from text block");
          const parsed = JSON.parse(m[0]) as Partial<GA4Metrics>;
          return { connected: true, ...parsed } as GA4Metrics;
        }
      }
    }

    throw new Error("لم تُرجع Windsor.ai / Claude أي بيانات قابلة للقراءة");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[analytics] fetchGA4Data error:", msg);
    return {
      connected: false,
      error: "تعذّر جلب بيانات Google Analytics",
      hint: msg,
    };
  }
}
