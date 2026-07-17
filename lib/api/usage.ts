import api from "@/lib/api";

export type UsageSnapshot = {
  plan_code: "free" | "standard" | "team" | "pro";
  period_start: string;
  period_end: string;
  limits: {
    bots: number;
    sources: number;
    website_pages_per_month: number;
    pdf_pages_per_month: number;
    chat_messages_per_month: number;
    projects: number;
    project_messages: number;
    reports_generated: number;
    channels_connected: number;
  };
  used: {
    bots: number;
    sources: number;
    website_pages: number;
    pdf_pages: number;
    chat_messages: number;
    projects: number;
    project_messages: number;
    reports_generated: number;
    channels: number;
  };
};

export async function fetchUsage(): Promise<UsageSnapshot> {
  const response = await api.get<UsageSnapshot>("/usage/");
  return response.data;
}

export type UsageAnalytics = {
  avg_response_time: number;
  resolution_rate: number;
  daily_counts: Array<{ date: string; count: number }>;
  bot_counts: Array<{ bot_id: string; bot_name: string; count: number }>;
  billing_period_start: string;
  billing_period_end: string;
};

export async function fetchUsageAnalytics(): Promise<UsageAnalytics> {
  const response = await api.get<UsageAnalytics>("/usage/analytics");
  return response.data;
}
