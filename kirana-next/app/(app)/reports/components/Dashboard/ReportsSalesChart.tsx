"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ReportsConstants } from "../../constants/ReportsSharedConstants";
import type { ReportsSalesData } from "../../types/ReportsTypes";

interface ReportsSalesChartProps {
  isLoading: boolean;
  data?: ReportsSalesData[];
}

export function ReportsSalesChart({ isLoading, data }: ReportsSalesChartProps) {
  const { formatMoney } = ReportsConstants.UTILS;
  return (
    <Card className="bg-[var(--reports-card-bg)] border-[var(--reports-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-[var(--reports-foreground)]">
          {ReportsConstants.LABELS.SALES_TREND}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[220px]">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : data?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
                tickFormatter={(value) => formatMoney(Number(value))}
              />
              <Tooltip
                cursor={{ fill: "var(--reports-muted-bg)" }}
                contentStyle={{
                  backgroundColor: "var(--reports-card-bg)",
                  borderRadius: "8px",
                  border: "1px solid var(--reports-border)",
                  fontSize: 12,
                  color: "var(--reports-foreground)"
                }}
                formatter={(value) => [formatMoney(Number(value)), "Sales"]}
              />
              <Bar dataKey="sales" fill="var(--reports-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--reports-muted-text)]">
            {ReportsConstants.TEXTS.NO_SALES}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
