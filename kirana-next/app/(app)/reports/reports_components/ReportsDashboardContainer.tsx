"use client";

import React from "react";
import { format } from "date-fns";
import {
  useGetLowStockReport,
  useGetPendingKhataReport,
  useGetProfitReport,
  useGetSalesReport,
} from "@/lib/api";
import { useReports } from "./ReportsContext";
import { ReportsHeader } from "./ReportsHeader";
import { ReportsDatePicker } from "./ReportsDatePicker";
import { ReportsStatGrid } from "./ReportsStatGrid";
import { ReportsSalesChart } from "./ReportsSalesChart";
import { ReportsProfitChart } from "./ReportsProfitChart";
import { ReportsKhataContainer } from "./ReportsKhataContainer";
import { ReportsStockContainer } from "./ReportsStockContainer";

function dateToStr(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function money(value: number) {
  return `Rs ${value.toFixed(0)}`;
}

export function ReportsDashboardContainer() {
  const { dateRange } = useReports();
  const from = dateRange.from ? dateToStr(dateRange.from) : undefined;
  const to = dateRange.to ? dateToStr(dateRange.to) : from;

  const { data: salesReport, isLoading: salesLoading } = useGetSalesReport({ from, to });
  const { data: profitReport, isLoading: profitLoading } = useGetProfitReport({ from, to });
  const { data: khataReport, isLoading: khataLoading } = useGetPendingKhataReport();
  const { data: lowStockProducts = [], isLoading: stockLoading } = useGetLowStockReport();

  const isLoading = salesLoading || profitLoading || khataLoading || stockLoading;

  const totalRevenue = profitReport?.totalRevenue ?? salesReport?.totalSales ?? 0;
  const totalProfit = profitReport?.totalProfit ?? 0;
  const profitMargin = profitReport?.profitMargin ?? 0;
  const pendingCustomers = khataReport?.customers ?? [];
  const totalPending = khataReport?.totalPending ?? 0;
  
  const outOfStockCount = lowStockProducts.filter(
    (product) => product.currentStock === 0 || product.stockInBaseUnit <= 0
  ).length;

  return (
    <div className="space-y-6" data-testid="page-reports">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ReportsHeader />
        <ReportsDatePicker />
      </div>

      <ReportsStatGrid
        isLoading={isLoading}
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        profitMargin={profitMargin}
        totalPending={totalPending}
        pendingCustomersCount={pendingCustomers.length}
        lowStockCount={lowStockProducts.length}
        outOfStockCount={outOfStockCount}
        moneyFormatter={money}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ReportsSalesChart
          isLoading={salesLoading}
          data={salesReport?.data}
          moneyFormatter={money}
        />
        <ReportsProfitChart
          isLoading={profitLoading}
          data={profitReport?.data}
          moneyFormatter={money}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReportsKhataContainer
          isLoading={khataLoading}
          customers={pendingCustomers}
          moneyFormatter={money}
        />
        <ReportsStockContainer
          isLoading={stockLoading}
          products={lowStockProducts}
        />
      </div>
    </div>
  );
}
