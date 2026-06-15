import api from "@/lib/api";

export type UsageSnapshot = {
  plan_code: "free" | "standard" | "pro";
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
