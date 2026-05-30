"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Product } from "@/lib/api";

interface BillingProductSearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  products: Product[];
  onProductTap: (product: Product) => void;
}

export function BillingProductSearchBar({
  search,
  setSearch,
  products,
  onProductTap,
}: BillingProductSearchBarProps) {
  return (
    <div className="relative shrink-0">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--billing-muted-text)]" />
      <Input
        placeholder="Search: chi, att, barcode, shortcut..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && products[0]) onProductTap(products[0]);
        }}
        className="h-11 pl-9 border-[var(--billing-border)] bg-[var(--billing-background-bg)] text-[var(--billing-foreground-text)]"
        autoFocus
      />
    </div>
  );
}
