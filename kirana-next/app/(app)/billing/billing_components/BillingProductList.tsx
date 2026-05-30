"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/api";
import { BillingProductCard } from "./BillingProductCard";

interface BillingProductListProps {
  isLoading: boolean;
  products: Product[];
  cartBaseQty: (productId: number) => number;
  onProductTap: (product: Product) => void;
  onRemoveTap?: (product: Product) => void;
}

export function BillingProductList({
  isLoading,
  products,
  cartBaseQty,
  onProductTap,
  onRemoveTap,
}: BillingProductListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="border-[var(--billing-border)] bg-[var(--billing-card-bg)]">
            <CardContent className="p-3">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-[var(--billing-muted-text)]">
        Koi product nahi mila
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 pb-2 sm:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <BillingProductCard
          key={product.id}
          product={product}
          inCartBaseQty={cartBaseQty(product.id)}
          onTap={onProductTap}
          onRemoveTap={onRemoveTap}
        />
      ))}
    </div>
  );
}
