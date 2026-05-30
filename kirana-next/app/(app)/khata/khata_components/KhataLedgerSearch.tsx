"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useKhata } from "./KhataContext";
import { KhataConstants } from "./KhataConstants";

export function KhataLedgerSearch() {
  const { ledgerSearch, setLedgerSearch } = useKhata();

  return (
    <div className="p-3 border-b border-[var(--khata-border)] flex justify-between items-center bg-[var(--khata-muted-hover-bg)] gap-4">
      <h3 className="text-sm font-semibold ml-1 shrink-0 hidden sm:block">
        {KhataConstants.LABELS.TRANSACTIONS}
      </h3>
      <div className="relative w-full sm:max-w-xs ml-auto">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--khata-muted-text)]" />
        <Input
          placeholder={KhataConstants.LABELS.SEARCH_ITEMS_PLACEHOLDER}
          value={ledgerSearch}
          onChange={(e) => setLedgerSearch(e.target.value)}
          className="h-9 pl-9 text-xs sm:text-sm bg-[var(--khata-background)]"
        />
      </div>
    </div>
  );
}
