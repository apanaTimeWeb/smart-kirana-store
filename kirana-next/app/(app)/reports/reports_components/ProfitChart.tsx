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

interface ProfitChartProps {
  isLoading: boolean;
  data?: { date: string; profit: number }[];
  moneyFormatter: (value: number) => string;
}

export function ProfitChart({ isLoading, data, moneyFormatter }: ProfitChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Profit Trend</CardTitle>
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickFormatter={(value) => String(value).slice(5)}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickFormatter={(value) => moneyFormatter(Number(value))}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
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
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Is period mein koi profit data nahi.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
