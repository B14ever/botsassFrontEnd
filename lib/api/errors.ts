import { AxiosError } from "axios";

export type LimitReachedError = {
  error: "limit_reached";
  limit: string;
  plan_code: string;
  period_end: string;
  upgrade_suggestion?: string[];
};

export function isLimitReachedError(value: unknown): value is LimitReachedError {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { error?: string };
  return candidate.error === "limit_reached";
}

export function getAxiosErrorPayload(error: unknown): unknown {
  return (error as AxiosError<unknown>)?.response?.data;
}

export function getAxiosErrorMessage(error: unknown, fallback: string): string {
  const payload = getAxiosErrorPayload(error) as { error?: string } | undefined;
  return payload?.error || fallback;
}
