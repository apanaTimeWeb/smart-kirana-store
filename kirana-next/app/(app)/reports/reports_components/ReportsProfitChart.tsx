"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ReportsConstants } from "./ReportsConstants";
import type { ReportsProfitData } from "./ReportsTypes";

interface ReportsProfitChartProps {
  isLoading: boolean;
  data?: ReportsProfitData[];
  moneyFormatter: (value: number) => string;
}

export function ReportsProfitChart({ isLoading, data, moneyFormatter }: ReportsProfitChartProps) {
  return (
    <Card className="bg-[var(--reports-card-bg)] border-[var(--reports-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-[var(--reports-foreground)]">
          {ReportsConstants.LABELS.PROFIT_TREND}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[220px]">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : data?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--reports-profit-chart-grad)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--reports-profit-chart-grad)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--reports-border)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--reports-muted-text)", fontSize: 10 }}
                tickFormatter={(value) => String(value).slice(5)}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--reports-muted-text)", fontSize: 10 }}
                tickFormatter={(value) => moneyFormatter(Number(value))}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--reports-card-bg)",
                  borderRadius: "8px",
                  border: "1px solid var(--reports-border)",
                  fontSize: 12,
                  color: "var(--reports-foreground)",
                }}
                formatter={(value) => [moneyFormatter(Number(value)), "Profit"]}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="var(--reports-profit-chart-stroke)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#profitGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--reports-muted-text)]">
            {ReportsConstants.TEXTS.NO_PROFIT}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
