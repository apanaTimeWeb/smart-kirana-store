"use client";

import React from "react";
import type { Product } from "@/lib/api";
import type { BillingFilter } from "./BillingTypes";
import { BillingProductSearchBar } from "./BillingProductSearchBar";
import { BillingProductQuickPicks } from "./BillingProductQuickPicks";
import { BillingProductFilters } from "./BillingProductFilters";
import { BillingProductList } from "./BillingProductList";

interface BillingProductMainGridProps {
  products: Product[];
  quickProducts: Product[];
  isLoading: boolean;
  search: string;
  setSearch: (value: string) => void;
  filter: BillingFilter;
  setFilter: (value: BillingFilter) => void;
  cartBaseQty: (productId: number) => number;
  onProductTap: (product: Product) => void;
  onRemoveTap?: (product: Product) => void;
}

export function BillingProductMainGrid({
  products,
  quickProducts,
  isLoading,
  search,
  setSearch,
  filter,
  setFilter,
  cartBaseQty,
  onProductTap,
  onRemoveTap,
}: BillingProductMainGridProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <BillingProductSearchBar
        search={search}
        setSearch={setSearch}
        products={products}
        onProductTap={onProductTap}
      />

      {!search && (
        <BillingProductQuickPicks
          quickProducts={quickProducts}
          onProductTap={onProductTap}
        />
      )}

      <BillingProductFilters filter={filter} setFilter={setFilter} />

      <div className="min-h-0 flex-1 overflow-auto">
        <BillingProductList
          isLoading={isLoading}
          products={products}
          cartBaseQty={cartBaseQty}
          onProductTap={onProductTap}
          onRemoveTap={onRemoveTap}
        />
      </div>
    </div>
  );
}
