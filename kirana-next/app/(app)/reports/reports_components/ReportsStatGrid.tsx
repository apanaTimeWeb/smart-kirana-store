"use client";

import React from "react";
import { IndianRupee, TrendingUp, BookOpen, AlertTriangle } from "lucide-react";
import { ReportsConstants } from "./ReportsConstants";
import { ReportsStatCard } from "./ReportsStatCard";

interface ReportsStatGridProps {
  isLoading: boolean;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  totalPending: number;
  pendingCustomersCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  moneyFormatter: (val: number) => string;
}

export function ReportsStatGrid({
  isLoading,
  totalRevenue,
  totalProfit,
  profitMargin,
  totalPending,
  pendingCustomersCount,
  lowStockCount,
  outOfStockCount,
  moneyFormatter,
}: ReportsStatGridProps) {
  const statCards = [
    {
      label: ReportsConstants.LABELS.TOTAL_REVENUE,
      sublabel: ReportsConstants.LABELS.SELECTED_PERIOD_SALE,
      value: moneyFormatter(totalRevenue),
      icon: IndianRupee,
      colorClass: "text-[var(--reports-sale-color)]",
      bgClass: "bg-[var(--reports-sale-bg)]",
      borderClass: "border-[var(--reports-sale-border)]",
    },
    {
      label: ReportsConstants.LABELS.TOTAL_PROFIT,
      sublabel: ReportsConstants.LABELS.ESTIMATED_MARGIN,
      value: moneyFormatter(totalProfit),
      note: `${profitMargin.toFixed(1)}% margin`,
      icon: TrendingUp,
      colorClass: "text-[var(--reports-profit-color)]",
      bgClass: "bg-[var(--reports-profit-bg)]",
      borderClass: "border-[var(--reports-profit-border)]",
    },
    {
      label: ReportsConstants.LABELS.PENDING_KHATA,
      sublabel: ReportsConstants.LABELS.CUSTOMER_DUES,
      value: moneyFormatter(totalPending),
      note: `${pendingCustomersCount} customers`,
      icon: BookOpen,
      colorClass: "text-[var(--reports-khata-color)]",
      bgClass: "bg-[var(--reports-khata-bg)]",
      borderClass: "border-[var(--reports-khata-border)]",
    },
    {
      label: ReportsConstants.LABELS.LOW_STOCK,
      sublabel: ReportsConstants.LABELS.NEEDS_PURCHASE,
      value: `${lowStockCount}`,
      note: `${outOfStockCount} out of stock`,
      icon: AlertTriangle,
      colorClass: "text-[var(--reports-lowstock-color)]",
      bgClass: "bg-[var(--reports-lowstock-bg)]",
      borderClass: "border-[var(--reports-lowstock-border)]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <ReportsStatCard key={card.label} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}
