"use client";

import "./reports.css";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { IndianRupee, TrendingUp, BookOpen, AlertTriangle, CalendarIcon, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isSameDay, subDays, isWithinInterval, parseISO } from "date-fns";

import rawData from "@/lib/data.json";

// ── Static data derived from data.json ──────────────────────────────
const ALL_SALES_DATA   = rawData.salesReportData;   // { date, sales, orders }
const ALL_PROFIT_DATA  = rawData.profitReportData;  // { date, revenue, profit }
const ALL_CUSTOMERS    = rawData.customers;
const ALL_PRODUCTS     = rawData.products;

const PENDING_CUSTOMERS = ALL_CUSTOMERS.filter((c) => c.totalDue > 0);
const TOTAL_PENDING     = PENDING_CUSTOMERS.reduce((s, c) => s + c.totalDue, 0);

const LOW_STOCK_PRODUCTS = ALL_PRODUCTS.filter(
  (p) => p.currentStock <= p.lowStockThreshold
);

// ── Helpers ──────────────────────────────────────────────────────────
function dateToStr(d: Date) { return d.toISOString().split("T")[0]; }
function buildDatetimeStr(dateStr: string, timeStr: string) { return `${dateStr}T${timeStr}:00`; }

export default function Reports() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({ from: subDays(today, 14), to: today });
  const [calOpen, setCalOpen] = useState(false);
  const isSingleDay = dateRange.from != null && (dateRange.to == null || isSameDay(dateRange.from, dateRange.to));
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime]     = useState("23:59");

  // Filter chart data by selected date range
  const filteredSales = ALL_SALES_DATA.filter((d) => {
    if (!dateRange.from) return true;
    const dt = parseISO(d.date);
    const to = dateRange.to ?? dateRange.from;
    return isWithinInterval(dt, { start: dateRange.from, end: to });
  });

  const filteredProfit = ALL_PROFIT_DATA.filter((d) => {
    if (!dateRange.from) return true;
    const dt = parseISO(d.date);
    const to = dateRange.to ?? dateRange.from;
    return isWithinInterval(dt, { start: dateRange.from, end: to });
  });

  const totalRevenue = filteredProfit.reduce((s, d) => s + d.revenue, 0);
  const totalProfit  = filteredProfit.reduce((s, d) => s + d.profit, 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  function handleRangeSelect(range: DateRange | undefined) {
    if (!range) { setDateRange({ from: undefined, to: undefined }); return; }
    setDateRange(range);
    if (range.from && range.to && !isSameDay(range.from, range.to)) setCalOpen(false);
  }

  function clearFilter() {
    setDateRange({ from: subDays(today, 14), to: today });
    setFromTime("00:00"); setToTime("23:59");
  }

  function rangeLabelText() {
    if (!dateRange.from) return "Select date range";
    if (isSingleDay) return format(dateRange.from, "dd MMM yyyy");
    const f = format(dateRange.from, "dd MMM");
    const t = dateRange.to ? format(dateRange.to, "dd MMM yyyy") : "...";
    return `${f} – ${t}`;
  }

  return (
    <div className="space-y-6" data-testid="page-reports">
      {/* ── Header + Date Filter ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reports <span className="ml-2 text-base font-normal text-muted-foreground">(रिपोर्ट)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Apni dukaan ka performance dekhein</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex items-center gap-2">
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("h-9 gap-2 text-sm font-medium w-full sm:min-w-[200px] justify-start", !dateRange.from && "text-muted-foreground")} data-testid="button-date-filter">
                  <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="flex-1 text-left">{rangeLabelText()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-lg" align="end" sideOffset={6}>
                <div className="p-3 border-b">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date Range Select Karein</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Ek date click karein ya range ke liye drag karein</p>
                </div>
                <Calendar mode="range" selected={dateRange} onSelect={handleRangeSelect} disabled={{ after: today }} numberOfMonths={1} defaultMonth={dateRange.from ?? today} />
                <div className="border-t p-3 flex justify-between items-center gap-2">
                  <div className="flex gap-1 flex-wrap">
                    {[{ label: "Aaj", days: 0 }, { label: "7 दिन", days: 6 }, { label: "15 दिन", days: 14 }, { label: "30 दिन", days: 29 }].map((q) => (
                      <button key={q.label} onClick={() => { setDateRange({ from: subDays(today, q.days), to: today }); setFromTime("00:00"); setToTime("23:59"); if (q.days > 0) setCalOpen(false); }} className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors">
                        {q.label}
                      </button>
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setCalOpen(false)}>Done</Button>
                </div>
              </PopoverContent>
            </Popover>
            {dateRange.from && (
              <button onClick={clearFilter} className="h-9 w-9 flex items-center justify-center rounded-md border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Filter clear karein">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {isSingleDay && (
            <div className="flex items-center gap-2 rounded-lg border [background-color:var(--reports-timebar-bg)] [border-color:var(--reports-timebar-border)] px-3 py-2">
              <Clock className="h-3.5 w-3.5 [color:var(--reports-timebar-icon)] shrink-0" />
              <span className="text-xs font-medium [color:var(--reports-timebar-label)]">Time filter:</span>
              <div className="flex items-center gap-1.5">
                <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} className="rounded [border-color:var(--reports-timebar-input-border)] border [background-color:var(--reports-timebar-input-bg)] px-1.5 py-0.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[var(--reports-timebar-input-ring)]" data-testid="input-from-time" />
                <span className="text-xs [color:var(--reports-timebar-sep)] font-medium">to</span>
                <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} className="rounded [border-color:var(--reports-timebar-input-border)] border [background-color:var(--reports-timebar-input-bg)] px-1.5 py-0.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[var(--reports-timebar-input-ring)]" data-testid="input-to-time" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "कुल बिक्री", sublabel: "Total Revenue", value: `₹${totalRevenue.toFixed(0)}`, icon: IndianRupee, colorClass: "[color:var(--reports-sale-color)]", bgClass: "[background-color:var(--reports-sale-bg)]", borderClass: "[border-color:var(--reports-sale-border)]" },
          { label: "कुल मुनाफा", sublabel: "Total Profit", value: `₹${totalProfit.toFixed(0)}`, note: `${profitMargin.toFixed(1)}% margin`, icon: TrendingUp, colorClass: "[color:var(--reports-profit-color)]", bgClass: "[background-color:var(--reports-profit-bg)]", borderClass: "[border-color:var(--reports-profit-border)]" },
          { label: "उधार बाकी", sublabel: "Pending Khata", value: `₹${TOTAL_PENDING.toFixed(0)}`, note: `${PENDING_CUSTOMERS.length} customers`, icon: BookOpen, colorClass: "[color:var(--reports-khata-color)]", bgClass: "[background-color:var(--reports-khata-bg)]", borderClass: "[border-color:var(--reports-khata-border)]" },
          { label: "कम स्टॉक", sublabel: "Low Stock Items", value: `${LOW_STOCK_PRODUCTS.length}`, note: `${LOW_STOCK_PRODUCTS.filter((p) => p.currentStock === 0).length} out of stock`, icon: AlertTriangle, colorClass: "[color:var(--reports-lowstock-color)]", bgClass: "[background-color:var(--reports-lowstock-bg)]", borderClass: "[border-color:var(--reports-lowstock-border)]" },
        ].map((card) => (
          <Card key={card.label} className={`border ${card.borderClass} ${card.bgClass}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{card.label}</p>
                  <p className="text-[10px] text-muted-foreground">{card.sublabel}</p>
                </div>
                <card.icon className={`h-4 w-4 ${card.colorClass}`} />
              </div>
              <div className={`mt-3 text-2xl font-extrabold ${card.colorClass}`}>{card.value}</div>
              {card.note && <p className="mt-1 text-xs text-muted-foreground">{card.note}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">बिक्री Trend <span className="ml-1 text-sm font-normal text-muted-foreground">(Daily Sales)</span></CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            {filteredSales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredSales} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => [`₹${v.toFixed(0)}`, "Sales"]} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Is period mein koi sales nahi</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">मुनाफा Trend <span className="ml-1 text-sm font-normal text-muted-foreground">(Profit over Time)</span></CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            {filteredProfit.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredProfit} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--reports-profit-chart-grad)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--reports-profit-chart-grad)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => [`₹${v.toFixed(0)}`, "Profit"]} />
                  <Area type="monotone" dataKey="profit" stroke="var(--reports-profit-chart-stroke)" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Is period mein koi profit data nahi</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Pending Khata + Low Stock ── */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 [color:var(--reports-khata-color)]" /> Pending Udhaar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {PENDING_CUSTOMERS.length > 0 ? (
              <div className="divide-y">
                {PENDING_CUSTOMERS.slice(0, 6).map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20" data-testid={`row-khata-${c.id}`}>
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.phone}</p>
                    </div>
                    <span className="font-bold [color:var(--reports-khata-color)] text-sm">₹{c.totalDue.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <BookOpen className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">Koi udhaar nahi — sab clear hai!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" /> Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {LOW_STOCK_PRODUCTS.length > 0 ? (
              <div className="divide-y">
                {LOW_STOCK_PRODUCTS.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20" data-testid={`row-lowstock-${p.id}`}>
                    <div>
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={cn("text-[10px] font-medium", p.currentStock === 0 ? "[background-color:var(--reports-badge-out-bg)] [color:var(--reports-badge-out-text)] [border-color:var(--reports-badge-out-border)]" : "[background-color:var(--reports-badge-low-bg)] [color:var(--reports-badge-low-text)] [border-color:var(--reports-badge-low-border)]")}>
                        {p.currentStock === 0 ? "Out of Stock" : `${p.currentStock} left`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">Sab stock sahi level par hai</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
