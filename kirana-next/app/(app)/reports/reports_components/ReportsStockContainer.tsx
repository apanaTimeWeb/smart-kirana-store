"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { ReportsConstants } from "./ReportsConstants";
import type { ReportsProduct } from "./ReportsTypes";
import { ReportsStockItem } from "./ReportsStockItem";
import { ReportsStockSearchInput } from "./ReportsStockSearchInput";
import { ReportsStockSkeletonList } from "./ReportsStockSkeletonList";
import { ReportsStockEmptyState } from "./ReportsStockEmptyState";
import { ReportsPagination } from "./ReportsPagination";

interface ReportsStockContainerProps {
  isLoading: boolean;
  products: ReportsProduct[];
}

/**
 * ReportsStockContainer
 *
 * Responsibility (ONE): Owns and manages the Low Stock Alert section's
 * local state (search query, current page) and composes the section from
 * isolated micro-components.
 *
 * It does NOT render search input (→ ReportsStockSearchInput).
 * It does NOT render skeleton rows (→ ReportsStockSkeletonList).
 * It does NOT render empty state (→ ReportsStockEmptyState).
 * It does NOT render individual rows (→ ReportsStockItem).
 */
export function ReportsStockContainer({
  isLoading,
  products,
}: ReportsStockContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { ITEMS_PER_PAGE } = ReportsConstants.PAGINATION;

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }

  return (
    <Card className="flex flex-col h-full bg-[var(--reports-card-bg)] border-[var(--reports-border)]">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-[var(--reports-destructive)]">
          <AlertTriangle className="h-4 w-4" />
          {ReportsConstants.TEXTS.LOW_STOCK_ALERT}
        </CardTitle>
      </CardHeader>

      {!isLoading && (
        <ReportsStockSearchInput value={searchQuery} onChange={handleSearchChange} />
      )}

      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <ReportsStockSkeletonList />
        ) : currentProducts.length > 0 ? (
          <div className="divide-y divide-[var(--reports-border)]">
            {currentProducts.map((product) => (
              <ReportsStockItem key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <ReportsStockEmptyState />
        )}
      </CardContent>

      {!isLoading && (
        <ReportsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Card>
  );
}
