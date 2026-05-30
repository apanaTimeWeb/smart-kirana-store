"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useBilling } from "../../context/BillingContext";

export function BillingProductSearchBar() {
  const { search, setSearch, products, handleProductTap } = useBilling();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && products[0]) {
      handleProductTap(products[0]);
    }
  };

  return (
    <div className="relative shrink-0">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--billing-muted-text)]" />
      <Input
        placeholder="Search: chi, att, barcode, shortcut..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyPress}
        className="h-11 pl-9 border-[var(--billing-border)] bg-[var(--billing-background-bg)] text-[var(--billing-foreground-text)]"
        autoFocus
      />
    </div>
  );
}
