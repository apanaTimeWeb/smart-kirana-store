"use client";

import React from "react";
import { IndianRupee, TrendingUp, BookOpen, AlertTriangle, Clock } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useDashboardContext } from "./DashboardContext";
import { DashboardStatCard } from "./DashboardStatCard";
import { DashboardRecentBillsList } from "./DashboardRecentBillsList";
import { DashboardLowStockList } from "./DashboardLowStockList";
import { DashboardExpiringSoonList } from "./DashboardExpiringSoonList";

/**
 * DashboardPageContent
 *
 * Renders the complete dashboard UI:
 *   - Page heading with today's date
 *   - 5 stat cards (Sale, Profit, Khata, Low Stock, Expiring)
 *   - 3 detail lists (Recent Bills, Low Stock, Expiring Soon)
 *
 * Reads data from DashboardContext — no props required.
 * Must be wrapped in <DashboardProvider> (done in page.tsx).
 */
export function DashboardPageContent() {
  const { summary, isLoading } = useDashboardContext();
  const router = useRouter();

  if (isLoading || !summary) {
    return (
      <div className="p-4 text-[var(--dashboard-muted-text)]">
        Loading dashboard...
      </div>
    );
  }

  const today = format(new Date(), "EEEE, dd MMM yyyy");

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          आज का हिसाब
          <span className="ml-2 text-base font-normal text-[var(--dashboard-muted-text)]">
            (Today&apos;s Overview)
          </span>
        </h1>
        <p className="text-sm text-[var(--dashboard-muted-text)] mt-0.5">{today}</p>
      </div>

      {/* Stat cards row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardStatCard
          title="आज की बिक्री"
          subtitle="Today's Sale"
          value={`₹${(summary.todaySale ?? 0).toFixed(0)}`}
          note={`${summary.todayOrderCount} orders today`}
          icon={IndianRupee}
          colorClass="text-[var(--dashboard-sale-value)]"
          bgClass="bg-[var(--dashboard-sale-bg)]"
          borderClass="border-[var(--dashboard-sale-border)]"
          iconColorClass="text-[var(--dashboard-sale-icon)]"
          onClick={() => router.push("/history")}
        />
        <DashboardStatCard
          title="आज का मुनाफा"
          subtitle="Today's Profit"
          value={`₹${(summary.todayProfit ?? 0).toFixed(0)}`}
          icon={TrendingUp}
          colorClass="text-[var(--dashboard-profit-value)]"
          bgClass="bg-[var(--dashboard-profit-bg)]"
          borderClass="border-[var(--dashboard-profit-border)]"
          iconColorClass="text-[var(--dashboard-profit-icon)]"
          onClick={() => router.push("/reports")}
        />
        <DashboardStatCard
          title="उधार बाकी"
          subtitle="Pending Khata"
          value={`₹${(summary.pendingKhataAmount ?? 0).toFixed(0)}`}
          note={`${summary.pendingKhataCount} customers`}
          icon={BookOpen}
          colorClass="text-[var(--dashboard-khata-value)]"
          bgClass="bg-[var(--dashboard-khata-bg)]"
          borderClass="border-[var(--dashboard-khata-border)]"
          iconColorClass="text-[var(--dashboard-khata-icon)]"
          onClick={() => router.push("/khata")}
        />
        <DashboardStatCard
          title="कम स्टॉक"
          subtitle="Low Stock Alert"
          value={`${summary.lowStockCount}`}
          note={`${summary.outOfStockCount} out of stock`}
          icon={AlertTriangle}
          colorClass="text-[var(--dashboard-lowstock-value)]"
          bgClass="bg-[var(--dashboard-lowstock-bg)]"
          borderClass="border-[var(--dashboard-lowstock-border)]"
          iconColorClass="text-[var(--dashboard-lowstock-icon)]"
          onClick={() => router.push("/stock?filter=low")}
        />
        <DashboardStatCard
          title="एक्सपायरी अलर्ट"
          subtitle="Expiring Soon"
          value={`${summary.expiringProducts?.length || 0}`}
          note="items expiring in 15 days"
          icon={Clock}
          colorClass="text-[var(--dashboard-expiry-value)]"
          bgClass="bg-[var(--dashboard-expiry-bg)]"
          borderClass="border-[var(--dashboard-expiry-border)]"
          iconColorClass="text-[var(--dashboard-expiry-icon)]"
          onClick={() => router.push("/stock?filter=expiring")}
        />
      </div>

      {/* Detail lists grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardRecentBillsList />
        <DashboardLowStockList />
        <DashboardExpiringSoonList />
      </div>
    </div>
  );
}
