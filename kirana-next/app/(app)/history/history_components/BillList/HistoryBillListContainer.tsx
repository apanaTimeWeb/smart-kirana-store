"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useHistoryContext } from "../../history_context/HistoryContext";
import { HistoryBill } from "../../history_shared/HistoryTypes";
import { HistorySearchFilter } from "../Common/HistorySearchFilter";
import { HISTORY_MESSAGES } from "../../history_shared/HistorySharedConstants";
import { HistoryBillCard } from "./HistoryBillCard";
import { HistoryBillListEmptyState } from "./HistoryBillListEmptyState";
import { HistoryBillDetailsDialog } from "../BillDetailsDialog/HistoryBillDetailsDialog";

/**
 * HistoryBillListContainer
 *
 * The top-level orchestrator for the bill list view. Single responsibility:
 * decide WHICH state to render based on loading / empty / has-results.
 *
 * Owns only: `searchQuery` (pure local UI state — not shared with any other component).
 * All remote data (bills, currency, dialog triggers) comes from HistoryContext.
 *
 * Renders:
 *   - Loading spinner  → while bills are being fetched
 *   - Search bar       → always visible once data is ready
 *   - HistoryBillCard  → one per filtered bill result
 *   - HistoryBillListEmptyState → when search returns no results
 *   - HistoryBillDetailsDialog  → portal, rendered once, controlled by context
 */
export function HistoryBillListContainer() {
  const { bills, isLoadingBills, currency, openBillDetails } = useHistoryContext();
  const [searchQuery, setSearchQuery] = useState("");

  // Latest bills first; filtered by Bill # or Customer Name
  const filteredBills = React.useMemo(() => {
    if (!bills) return [];
    let list = [...bills].reverse();
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          String(b.id).includes(q) ||
          (b.customerName && b.customerName.toLowerCase().includes(q))
      );
    }
    return list;
  }, [bills, searchQuery]);

  if (isLoadingBills) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--history-primary-text)]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <HistorySearchFilter
        placeholder={HISTORY_MESSAGES.SEARCH_BILLS_PLACEHOLDER}
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="space-y-3">
        {filteredBills.length === 0 ? (
          <HistoryBillListEmptyState />
        ) : (
          filteredBills.map((bill: HistoryBill) => (
            <HistoryBillCard
              key={bill.id}
              bill={bill}
              currency={currency}
              onOpen={openBillDetails}
            />
          ))
        )}
      </div>

      {/* Dialog is rendered once here; opening is triggered via HistoryContext */}
      <HistoryBillDetailsDialog />
    </div>
  );
}
