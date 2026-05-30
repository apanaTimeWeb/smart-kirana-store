"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReportsConstants } from "../../constants/ReportsSharedConstants";

interface ReportsStockSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * ReportsStockSearchInput
 *
 * Responsibility (ONE): Renders the search input field inside the
 * Low Stock Alert card. Fires onChange back to ReportsStockContainer
 * which owns the search state.
 *
 * "use client" required — has an onChange event listener.
 */
export function ReportsStockSearchInput({ value, onChange }: ReportsStockSearchInputProps) {
  return (
    <div className="px-5 pb-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--reports-muted-text)]" />
        <Input
          type="search"
          id="stock-search-input"
          placeholder={ReportsConstants.TEXTS.SEARCH_PRODUCT}
          className="pl-8 h-9 bg-[var(--reports-background)] border-[var(--reports-border)] text-[var(--reports-foreground)]"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
