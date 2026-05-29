"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { type Product } from "@/lib/api";
import { cn } from "@/lib/utils";
import { type BillingFilter } from "./types";
import { ProductCard } from "./ProductCard";

const FILTER_OPTIONS = [
  ["all", "All"],
  ["khula", "Khula"],
  ["fixed", "Fixed"],
  ["variant", "Variant"],
  ["wholesale", "Bora"],
  ["low", "Low"],
  ["in", "In Stock"],
] as const;

interface ProductGridProps {
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

export function ProductGrid({
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
}: ProductGridProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Search */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search: chi, att, barcode, shortcut..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && products[0]) onProductTap(products[0]);
          }}
          className="h-11 pl-9"
          autoFocus
        />
      </div>

      {/* Quick picks */}
      {!search && quickProducts.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onProductTap(product)}
              className="shrink-0 rounded-lg border bg-card px-3 py-2 text-left text-sm font-semibold shadow-sm hover:border-primary"
            >
              <span>{product.productName}</span>
              <span className="ml-1 text-muted-foreground">{product.variantName}</span>
            </button>
          ))}
        </div>
      )}

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTER_OPTIONS.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "shrink-0 rounded-md border px-3 py-1.5 text-xs font-bold transition-colors",
              filter === value
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted/60"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="min-h-0 flex-1 overflow-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Koi product nahi mila
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 pb-2 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                inCartBaseQty={cartBaseQty(product.id)}
                onTap={onProductTap}
                onRemoveTap={onRemoveTap}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
