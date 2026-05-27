"use client";

import "./reports.css";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  BookOpen,
  CalendarIcon,
  IndianRupee,
  TrendingUp,
  X,
} from "lucide-react";
import { format, isSameDay, subDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useGetLowStockReport,
  useGetPendingKhataReport,
  useGetProfitReport,
  useGetSalesReport,
} from "@/lib/api";

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
          <Card key={card.label} className={`border ${card.borderClass} ${card.bgClass}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{card.sublabel}</p>
                </div>
                <card.icon className={`h-4 w-4 ${card.colorClass}`} />
              </div>
              {isLoading ? (
                <Skeleton className="mt-3 h-8 w-24" />
              ) : (
                <div className={`mt-3 text-2xl font-extrabold ${card.colorClass}`}>
                  {card.value}
                </div>
              )}
              {card.note && <p className="mt-1 text-xs text-muted-foreground">{card.note}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daily Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            {salesLoading ? (
              <Skeleton className="h-full w-full" />
            ) : salesReport?.data.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesReport.data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(value) => String(value).slice(5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(value) => money(Number(value))} />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(value) => [money(Number(value)), "Sales"]} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Is period mein koi sales nahi.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Profit Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            {profitLoading ? (
              <Skeleton className="h-full w-full" />
            ) : profitReport?.data.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitReport.data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--reports-profit-chart-grad)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--reports-profit-chart-grad)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(value) => String(value).slice(5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(value) => money(Number(value))} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(value) => [money(Number(value)), "Profit"]} />
                  <Area type="monotone" dataKey="profit" stroke="var(--reports-profit-chart-stroke)" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Is period mein koi profit data nahi.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-[var(--reports-khata-color)]" />
              Pending Udhaar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {khataLoading ? (
              <div className="space-y-2 p-5">
                {[1, 2, 3].map((item) => <Skeleton key={item} className="h-10 w-full" />)}
              </div>
            ) : pendingCustomers.length > 0 ? (
              <div className="divide-y">
                {pendingCustomers.slice(0, 6).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20" data-testid={`row-khata-${customer.id}`}>
                    <div>
                      <p className="text-sm font-semibold">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.phone}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--reports-khata-color)]">{money(customer.totalDue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <BookOpen className="mb-2 h-8 w-8 opacity-20" />
                <p className="text-sm">Koi udhaar nahi, sab clear hai.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stockLoading ? (
              <div className="space-y-2 p-5">
                {[1, 2, 3].map((item) => <Skeleton key={item} className="h-10 w-full" />)}
              </div>
            ) : lowStockProducts.length > 0 ? (
              <div className="divide-y">
                {lowStockProducts.slice(0, 6).map((product) => (
                  <div key={product.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20" data-testid={`row-lowstock-${product.id}`}>
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge className={cn("text-[10px] font-medium", product.currentStock === 0 || product.stockInBaseUnit <= 0 ? "bg-[var(--reports-badge-out-bg)] text-[var(--reports-badge-out-text)] border-[var(--reports-badge-out-border)]" : "bg-[var(--reports-badge-low-bg)] text-[var(--reports-badge-low-text)] border-[var(--reports-badge-low-border)]")}>
                      {product.currentStock === 0 || product.stockInBaseUnit <= 0
                        ? "Out of Stock"
                        : `${product.currentStock} ${product.unit} left`}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <AlertTriangle className="mb-2 h-8 w-8 opacity-20" />
                <p className="text-sm">Sab stock sahi level par hai.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
