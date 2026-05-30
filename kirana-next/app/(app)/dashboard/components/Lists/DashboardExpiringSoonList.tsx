"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { useDashboardContext } from "../../context/DashboardContext";
import { DASHBOARD_CONSTANTS } from "../../constants/DashboardSharedConstants";
import { DashboardSearchFilter } from "../Shared/DashboardSearchFilter";
import { DashboardPagination } from "../Shared/DashboardPagination";

export function DashboardExpiringSoonList() {
  const { summary } = useDashboardContext();
  const products = summary?.expiringProducts ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.variantName.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / DASHBOARD_CONSTANTS.ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * DASHBOARD_CONSTANTS.ITEMS_PER_PAGE,
    currentPage * DASHBOARD_CONSTANTS.ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader className="border-b bg-[var(--dashboard-card-header-bg)] px-4 py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dashboard-expiry-bg)] text-[var(--dashboard-expiry-icon)]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Expiring Soon</CardTitle>
            <p className="text-xs text-[var(--dashboard-muted-text)]">अलेर्ट</p>
          </div>
        </div>
      </CardHeader>
      <div className="px-4 py-2 border-b">
        <DashboardSearchFilter 
          placeholder="Search by product..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <CardContent className="flex-1 overflow-auto p-0">
        {currentProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[var(--dashboard-muted-text)]">
            <Clock className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">No items match your search.</p>
          </div>
        ) : (
          <div className="divide-y">
            {currentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 hover:bg-[var(--dashboard-row-hover-bg)] transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-sm leading-none">{product.name}</span>
                  <span className="text-xs text-[var(--dashboard-muted-text)]">{product.variantName}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium bg-[var(--dashboard-expiry-bg)] text-[var(--dashboard-expiry-value)] px-2 py-0.5 rounded-md">
                    {product.daysLeft <= 0 ? "Expired" : `${product.daysLeft} days left`}
                  </span>
                  <span className="text-[10px] text-[var(--dashboard-muted-text)]">
                    {format(new Date(product.expiryDate), "dd MMM yyyy")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="flex items-center justify-between px-4 py-3 border-t mt-auto">
        <DashboardPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Card>
  );
}
