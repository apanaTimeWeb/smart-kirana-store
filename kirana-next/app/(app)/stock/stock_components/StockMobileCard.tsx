"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/lib/api";
import { StockBadge } from "./StockBadge";
import { useStock } from "./StockContext";
import { MODE_LABEL } from "./StockConstants";

export function StockMobileCard({ product }: { product: Product }) {
  const { setEditingProduct, remove } = useStock();

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{product.productName}</p>
          <p className="text-sm text-muted-foreground">{product.variantName}</p>
        </div>
        <StockBadge product={product} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Stock</span>
          <p className="font-semibold">{product.currentStock} {product.unit}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Sell</span>
          <p className="font-semibold">Rs {product.sellingPrice}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Mode</span>
          <p className="font-semibold">{MODE_LABEL[product.sellingMode]}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingProduct(product)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--stock-btn-delete-text)]" onClick={() => remove(product)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
