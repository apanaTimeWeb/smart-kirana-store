"use client";

import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useDashboardContext } from "../../context/DashboardContext";
import { DashboardStatCard } from "../DashboardSummaryStats/DashboardStatCard";
import { DashboardRecentBillsList } from "../DashboardRecentBills/DashboardRecentBillsList";
import { DashboardLowStockList } from "../DashboardLowStock/DashboardLowStockList";
import { DashboardExpiringSoonList } from "../DashboardExpiringSoon/DashboardExpiringSoonList";
import { DASHBOARD_STAT_CARDS_CONFIG } from "../DashboardSummaryStats/DashboardSummaryStatsConstants";

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
        {DASHBOARD_STAT_CARDS_CONFIG.map((card) => (
          <DashboardStatCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            value={card.getValue(summary)}
            note={card.getNote(summary)}
            icon={card.icon}
            colorClass={card.colorClass}
            bgClass={card.bgClass}
            borderClass={card.borderClass}
            iconColorClass={card.iconColorClass}
            onClick={() => router.push(card.route)}
          />
        ))}
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
