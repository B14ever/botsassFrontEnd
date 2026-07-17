import api from "@/lib/api";

export type Plan = {
  code: "free" | "standard" | "team" | "pro";
  name: string;
  description: string;
  llm_class: "free" | "paid";
  reasoning_quality: string;
  price: string;
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
};

export async function fetchPlans(): Promise<Plan[]> {
  const response = await api.get<{ plans: Plan[] }>("/plans");
  return response.data.plans;
}
