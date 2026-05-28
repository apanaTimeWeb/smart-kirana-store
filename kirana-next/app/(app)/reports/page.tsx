"use client";

import "./reports.css";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  CalendarIcon,
  IndianRupee,
  TrendingUp,
  X,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { format, isSameDay, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useGetLowStockReport,
  useGetPendingKhataReport,
  useGetProfitReport,
  useGetSalesReport,
} from "@/lib/api";

import { StatCard } from "./reports_components/StatCard";
import { SalesChart } from "./reports_components/SalesChart";
import { ProfitChart } from "./reports_components/ProfitChart";
import { PendingKhataList } from "./reports_components/PendingKhataList";
import { LowStockList } from "./reports_components/LowStockList";

function dateToStr(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function money(value: number) {
  return `Rs ${value.toFixed(0)}`;
}

export default function Reports() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(today, 14),
    to: today,
  });
  const [calOpen, setCalOpen] = useState(false);

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

  function handleRangeSelect(range: DateRange | undefined) {
    if (!range) {
      setDateRange({ from: undefined, to: undefined });
      return;
    }
    setDateRange(range);
    if (range.from && range.to && !isSameDay(range.from, range.to)) {
      setCalOpen(false);
    }
  }

  function clearFilter() {
    setDateRange({ from: subDays(today, 14), to: today });
  }

  function rangeLabelText() {
    if (!dateRange.from) return "Select date range";
    if (!dateRange.to || isSameDay(dateRange.from, dateRange.to)) {
      return format(dateRange.from, "dd MMM yyyy");
    }
    return `${format(dateRange.from, "dd MMM")} - ${format(dateRange.to, "dd MMM yyyy")}`;
  }

  const statCards = [
    {
      label: "Total Revenue",
      sublabel: "Selected period sale",
      value: money(totalRevenue),
      icon: IndianRupee,
      colorClass: "text-[var(--reports-sale-color)]",
      bgClass: "bg-[var(--reports-sale-bg)]",
      borderClass: "border-[var(--reports-sale-border)]",
    },
    {
      label: "Total Profit",
      sublabel: "Estimated margin",
      value: money(totalProfit),
      note: `${profitMargin.toFixed(1)}% margin`,
      icon: TrendingUp,
      colorClass: "text-[var(--reports-profit-color)]",
      bgClass: "bg-[var(--reports-profit-bg)]",
      borderClass: "border-[var(--reports-profit-border)]",
    },
    {
      label: "Pending Khata",
      sublabel: "Customer dues",
      value: money(totalPending),
      note: `${pendingCustomers.length} customers`,
      icon: BookOpen,
      colorClass: "text-[var(--reports-khata-color)]",
      bgClass: "bg-[var(--reports-khata-bg)]",
      borderClass: "border-[var(--reports-khata-border)]",
    },
    {
      label: "Low Stock",
      sublabel: "Needs purchase",
      value: `${lowStockProducts.length}`,
      note: `${outOfStockCount} out of stock`,
      icon: AlertTriangle,
      colorClass: "text-[var(--reports-lowstock-color)]",
      bgClass: "bg-[var(--reports-lowstock-bg)]",
      borderClass: "border-[var(--reports-lowstock-border)]",
    },
  ];

  return (
    <div className="space-y-6" data-testid="page-reports">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Sales, profit, khata aur stock ka live snapshot.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full gap-2 text-sm font-medium sm:min-w-[210px] justify-start",
                  !dateRange.from && "text-muted-foreground"
                )}
                data-testid="button-date-filter"
              >
                <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
                <span className="flex-1 text-left">{rangeLabelText()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-lg" align="end" sideOffset={6}>
              <div className="border-b p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Date Range
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Ek date ya range select karein.
                </p>
              </div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleRangeSelect}
                disabled={{ after: today }}
                numberOfMonths={1}
                defaultMonth={dateRange.from ?? today}
              />
              <div className="flex items-center justify-between gap-2 border-t p-3">
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: "Aaj", days: 0 },
                    { label: "7 din", days: 6 },
                    { label: "15 din", days: 14 },
                    { label: "30 din", days: 29 },
                  ].map((quick) => (
                    <button
                      key={quick.label}
                      onClick={() => {
                        setDateRange({ from: subDays(today, quick.days), to: today });
                        if (quick.days > 0) setCalOpen(false);
                      }}
                      className="rounded-md border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setCalOpen(false)}>
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          {dateRange.from && (
            <button
               onClick={clearFilter}
               className="flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
               title="Filter clear karein"
             >
               <X className="h-3.5 w-3.5" />
             </button>
           )}
         </div>
       </div>
 
       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
         {statCards.map((card) => (
           <StatCard key={card.label} {...card} isLoading={isLoading} />
         ))}
       </div>
 
       <div className="grid gap-4 md:grid-cols-2">
         <SalesChart isLoading={salesLoading} data={salesReport?.data} moneyFormatter={money} />
         <ProfitChart isLoading={profitLoading} data={profitReport?.data} moneyFormatter={money} />
       </div>
 
       <div className="grid gap-4 md:grid-cols-2">
         <PendingKhataList isLoading={khataLoading} customers={pendingCustomers} moneyFormatter={money} />
         <LowStockList isLoading={stockLoading} products={lowStockProducts} />
       </div>
     </div>
   );
 }
