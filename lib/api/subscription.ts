import api from "@/lib/api";

export type Subscription = {
  id: string;
  subject_type: string;
  subject_id: string;
  plan_code: "free" | "standard" | "pro";
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
};

export type UpgradeResponse = {
  checkout_url: string;
  tx_ref: string;
  plan_code?: string;
};

export async function fetchSubscription(): Promise<Subscription> {
  const response = await api.get<Subscription>("/subscription/");
  return response.data;
}

export async function upgradeSubscription(planCode: string): Promise<UpgradeResponse> {
  const response = await api.post<UpgradeResponse>("/subscription/upgrade", {
    plan_code: planCode,
  });
  return response.data;
}
