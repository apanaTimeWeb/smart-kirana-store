"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MinusCircle, CopyPlus } from "lucide-react";
import { Product } from "@/lib/api";
import { StockBadge } from "../Shared/StockBadge";
import { StockExpiryBadge } from "../Shared/StockExpiryBadge";
import { useStock } from "../../stock_context/StockContext";
import { getCategoryById } from "../../stock_constants/CategoryMaster";

export function StockMobileCard({ product }: { product: Product }) {
  const { setEditingProduct, remove, setAdjustingProduct, openAddVariantFor } = useStock();
  const category = getCategoryById(product.category);

  return (
    <div className="rounded-xl border bg-[var(--stock-card-bg)] p-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          {category && (
            <span className="text-xl leading-none mt-0.5 shrink-0">{category.icon}</span>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-sm leading-tight">{product.productName}</p>
            <p className="text-xs text-[var(--stock-muted-text)] mt-0.5">
              {category?.name ?? product.category}
              {product.brand ? ` · ${product.brand}` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StockBadge product={product} />
          <StockExpiryBadge product={product} />
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-[var(--stock-muted-text)]">Stock</span>
          <p className="font-semibold">{product.currentStock} {product.unit}</p>
        </div>
        <div>
          <span className="text-[var(--stock-muted-text)]">Sell</span>
          <p className="font-semibold text-[var(--stock-selling-price)]">₹{product.sellingPrice}</p>
        </div>
        <div>
          <span className="text-[var(--stock-muted-text)]">Buy</span>
          <p className="font-semibold">
            {product.purchasePrice > 0 ? `₹${product.purchasePrice}` : "—"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2 flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600" onClick={() => setAdjustingProduct(product)}>
          <MinusCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => openAddVariantFor(product)}>
          <CopyPlus className="h-4 w-4" />
        </Button>
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
