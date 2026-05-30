"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BillingProductCard } from "./BillingProductCard";
import { useBilling } from "../../context/BillingContext";

export function BillingProductList() {
  const {
    isLoading,
    filteredProducts: products,
    cartBaseQty,
    handleProductTap,
    handleProductRemove,
  } = useBilling();
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
          onTap={handleProductTap}
          onRemoveTap={handleProductRemove}
        />
      ))}
    </div>
  );
}
