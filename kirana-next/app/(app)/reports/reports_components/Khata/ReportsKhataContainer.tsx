"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { ReportsConstants } from "../../reports_constants/ReportsSharedConstants";
import type { ReportsKhataCustomer } from "../../reports_types/ReportsTypes";
import { ReportsKhataItem } from "./ReportsKhataItem";
import { ReportsKhataSearchInput } from "./ReportsKhataSearchInput";
import { ReportsKhataSkeletonList } from "./ReportsKhataSkeletonList";
import { ReportsKhataEmptyState } from "./ReportsKhataEmptyState";
import { ReportsPagination } from "../Shared/ReportsPagination";

interface ReportsKhataContainerProps {
  isLoading: boolean;
  customers: ReportsKhataCustomer[];
}

/**
 * ReportsKhataContainer
 *
 * Responsibility (ONE): Owns and manages the Pending Udhaar section's
 * local state (search query, current page) and composes the section from
 * isolated micro-components.
 *
 * It does NOT render search input (→ ReportsKhataSearchInput).
 * It does NOT render skeleton rows (→ ReportsKhataSkeletonList).
 * It does NOT render empty state (→ ReportsKhataEmptyState).
 * It does NOT render individual rows (→ ReportsKhataItem).
 * It does NOT format money (→ ReportsConstants.UTILS.formatMoney).
 */
export function ReportsKhataContainer({
  isLoading,
  customers,
}: ReportsKhataContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { ITEMS_PER_PAGE } = ReportsConstants.PAGINATION;

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const currentCustomers = filteredCustomers.slice(
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
        <CardTitle className="flex items-center gap-2 text-base text-[var(--reports-foreground)]">
          <BookOpen className="h-4 w-4 text-[var(--reports-khata-color)]" />
          {ReportsConstants.TEXTS.PENDING_UDHAAR}
        </CardTitle>
      </CardHeader>

      {!isLoading && (
        <ReportsKhataSearchInput value={searchQuery} onChange={handleSearchChange} />
      )}

      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <ReportsKhataSkeletonList />
        ) : currentCustomers.length > 0 ? (
          <div className="divide-y divide-[var(--reports-border)]">
            {currentCustomers.map((customer) => (
              <ReportsKhataItem key={customer.id} customer={customer} />
            ))}
          </div>
        ) : (
          <ReportsKhataEmptyState />
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
