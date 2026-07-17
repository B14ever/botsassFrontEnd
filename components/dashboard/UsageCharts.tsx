"use client";

import React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { UsageAnalytics, UsageSnapshot } from "@/lib/api/usage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LineChart as LineIcon, Activity } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface UsageChartsProps {
  analytics: UsageAnalytics;
  usage: UsageSnapshot;
}

const lineChartConfig = {
  messages: {
    label: "Messages",
    color: "#2a78d6",
  },
} satisfies ChartConfig;

const barChartConfig = {
  credits: {
    label: "Credits",
    color: "#2a78d6",
  },
} satisfies ChartConfig;

export default function UsageCharts({ analytics, usage }: UsageChartsProps) {
  // Check if there is enough data (at least 1 message exists)
  const totalMessages = analytics.daily_counts.reduce((sum, item) => sum + item.count, 0);
  const hasEnoughData = totalMessages >= 1;


  // Format dates for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const billingPeriodStr = analytics.billing_period_start && analytics.billing_period_end
    ? `${formatDate(analytics.billing_period_start)} - ${formatDate(analytics.billing_period_end)}`
    : "";

  return (
    <div className="space-y-6">
      {/* KPI Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary border border-border p-4 rounded-lg flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Messages this month
            </span>
            {billingPeriodStr && (
              <p className="text-[9px] text-muted-foreground/60 mt-0.5">
                {billingPeriodStr}
              </p>
            )}
          </div>
          <span className="text-2xl font-bold text-foreground mt-2">
            {usage.used.chat_messages}
            <span className="text-xs text-muted-foreground font-normal ml-1">
              / {usage.limits.chat_messages_per_month}
            </span>
          </span>
        </div>

        <div className="bg-secondary border border-border p-4 rounded-lg flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Connected Channels
            </span>
            <p className="text-[9px] text-muted-foreground/60 mt-0.5">
              Active Telegram and WhatsApp bots
            </p>
          </div>
          <span className="text-2xl font-bold text-foreground mt-2">
            {usage.used.channels}
            <span className="text-xs text-muted-foreground font-normal ml-1">
              / {usage.limits.channels_connected}
            </span>
          </span>
        </div>
      </div>

      {/* Chart Visualizations */}
      {hasEnoughData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border bg-card rounded-lg shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground text-sm font-bold flex items-center gap-1.5">
                <LineIcon className="w-4 h-4 text-muted-foreground" />
                Messages over the last 14 days
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-4">
              <ChartContainer config={lineChartConfig} className="h-full w-full">
                <canvas className="sr-only" aria-label="Line chart showing daily message counts for the past 14 days" />
                <AreaChart
                  accessibilityLayer
                  data={analytics.daily_counts}
                  margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const d = new Date(value);
                      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    }}
                    stroke="#737373"
                    fontSize={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    stroke="#737373"
                    fontSize={10}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Area
                    dataKey="count"
                    name="messages"
                    type="monotone"
                    stroke="var(--color-messages)"
                    fill="rgba(42, 120, 214, 0.05)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card rounded-lg shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground text-sm font-bold flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                Credits used per agent
              </CardTitle>
              {billingPeriodStr && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Current billing period: {billingPeriodStr}
                </p>
              )}
            </CardHeader>
            <CardContent className="h-64 pt-4">
              {analytics.bot_counts.length > 0 ? (
                <ChartContainer config={barChartConfig} className="h-full w-full">
                  <canvas className="sr-only" aria-label="Horizontal bar chart displaying credits used per agent in this billing period" />
                  <BarChart
                    accessibilityLayer
                    data={analytics.bot_counts}
                    layout="vertical"
                    margin={{ left: -10, right: 10, top: 10, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} stroke="rgba(0, 0, 0, 0.05)" />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      stroke="#737373"
                      fontSize={10}
                    />
                    <YAxis
                      dataKey="bot_name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      stroke="#737373"
                      fontSize={10}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="count"
                      name="credits"
                      fill="var(--color-credits)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                  No active agents created yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-lg bg-muted/10">
          <Activity className="w-8 h-8 text-muted-foreground/30 mb-2.5" />
          <h4 className="text-foreground font-bold text-xs">Analytics are gathering</h4>
          <p className="text-muted-foreground max-w-xs mx-auto mt-0.5 text-[11px]">
            Send messages to your bots to build response latency records and daily counts.
          </p>
        </div>
      )}
    </div>
  );
}
