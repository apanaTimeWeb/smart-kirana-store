"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MinusCircle, CopyPlus } from "lucide-react";
import { Product } from "@/lib/api";
import { StockBadge } from "../Shared/StockBadge";
import { StockExpiryBadge } from "../Shared/StockExpiryBadge";
import { useStock } from "../../stock_context/StockContext";
import { formatBaseUnits } from "../../stock_utils/StockUtils";
import { getCategoryById } from "../../stock_constants/CategoryMaster";

export function StockTableRow({ product }: { product: Product }) {
  const { setEditingProduct, remove, setAdjustingProduct, openAddVariantFor } = useStock();
  const category = getCategoryById(product.category);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-start gap-2">
          {category && (
            <span className="text-lg leading-none mt-0.5 shrink-0">{category.icon}</span>
          )}
          <div>
            <p className="font-semibold leading-tight">{product.productName}</p>
            <p className="text-xs text-[var(--stock-muted-text)]">
              {category?.name ?? product.category}
              {product.brand ? ` · ${product.brand}` : ""}
              {product.shortcut ? ` · ${product.shortcut}` : ""}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="font-medium">{product.variantName}</p>
        <p className="text-xs text-[var(--stock-muted-text)]">
          1 = {formatBaseUnits(product.baseQuantity, product.baseUnit)}
        </p>
      </TableCell>
      <TableCell>
        <p className="font-semibold">{product.currentStock} {product.unit}</p>
        <p className="text-xs text-[var(--stock-muted-text)]">
          {formatBaseUnits(product.stockInBaseUnit, product.baseUnit)}
        </p>
      </TableCell>
      <TableCell>
        <p className="font-semibold text-[var(--stock-selling-price)]">₹{product.sellingPrice}</p>
        {product.purchasePrice > 0 && (
          <p className="text-xs text-[var(--stock-muted-text)]">Buy ₹{product.purchasePrice}</p>
        )}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <StockBadge product={product} />
          <StockExpiryBadge product={product} />
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" className="text-orange-600" onClick={() => setAdjustingProduct(product)}>
          <MinusCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => openAddVariantFor(product)} title="Add Another Size">
          <CopyPlus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-[var(--stock-btn-delete-text)]" onClick={() => remove(product)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
