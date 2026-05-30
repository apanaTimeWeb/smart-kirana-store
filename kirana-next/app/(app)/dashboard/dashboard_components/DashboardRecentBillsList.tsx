"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ShoppingBag } from "lucide-react";
import { useDashboardContext } from "./DashboardContext";
import { DASHBOARD_CONSTANTS, PAYMENT_MODE_LABELS } from "./DashboardTypes";
import { DashboardSearchFilter } from "./DashboardSearchFilter";
import { DashboardPagination } from "./DashboardPagination";

export function DashboardRecentBillsList() {
  const { summary } = useDashboardContext();
  const bills = summary?.recentBills ?? [];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBills = bills.filter(bill => {
    const query = searchQuery.toLowerCase();
    const name = (bill.customerName || "Walk-in Customer").toLowerCase();
    const id = bill.id.toString();
    return name.includes(query) || id.includes(query);
  });

  const totalPages = Math.ceil(filteredBills.length / DASHBOARD_CONSTANTS.ITEMS_PER_PAGE);
  const currentBills = filteredBills.slice(
    (currentPage - 1) * DASHBOARD_CONSTANTS.ITEMS_PER_PAGE,
    currentPage * DASHBOARD_CONSTANTS.ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingBag className="h-4 w-4 text-[var(--dashboard-primary-icon)]" />
          हाल की बिक्री
          <span className="text-sm font-normal text-muted-foreground ml-1">(Recent Bills)</span>
        </CardTitle>
      </CardHeader>
      <div className="px-5 pb-2">
        <DashboardSearchFilter 
          placeholder="Search by customer or bill ID..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <CardContent className="p-0 flex-1">
        {currentBills.length > 0 ? (
          <div className="divide-y">
            {currentBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
                data-testid={`row-bill-${bill.id}`}
              >
                <div>
                  <p className="font-semibold text-sm">{bill.customerName || "Walk-in Customer"}</p>
                  <p className="text-xs text-muted-foreground">
                    Bill #{bill.id} · {format(new Date(bill.createdAt), "hh:mm a")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">₹{bill.finalAmount.toFixed(0)}</p>
                  <Badge
                    variant="outline"
                    className={
                      bill.paymentMode === "khata"
                        ? "text-[var(--dashboard-badge-khata-text)] border-[var(--dashboard-badge-khata-border)] bg-[var(--dashboard-badge-khata-bg)] text-[10px]"
                        : bill.paymentMode === "upi"
                        ? "text-[var(--dashboard-badge-upi-text)] border-[var(--dashboard-badge-upi-border)] bg-[var(--dashboard-badge-upi-bg)] text-[10px]"
                        : "text-[var(--dashboard-badge-cash-text)] border-[var(--dashboard-badge-cash-border)] bg-[var(--dashboard-badge-cash-bg)] text-[10px]"
                    }
                  >
                    {PAYMENT_MODE_LABELS[bill.paymentMode] || bill.paymentMode}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm">No bills found</p>
          </div>
        )}
      </CardContent>
      <div className="flex items-center justify-between px-5 py-3 border-t mt-auto">
        <DashboardPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Card>
  );
}
