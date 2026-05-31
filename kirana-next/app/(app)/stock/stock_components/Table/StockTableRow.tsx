"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MinusCircle } from "lucide-react";
import { Product } from "@/lib/api";
import { StockBadge } from "../Shared/StockBadge";
import { useStock } from "../../stock_context/StockContext";
import { MODE_CLASS, MODE_LABEL } from "../../stock_constants/StockSharedConstants";
import { formatBaseUnits } from "../../stock_utils/StockUtils";

export function StockTableRow({ product }: { product: Product }) {
  const { setEditingProduct, remove, setAdjustingProduct } = useStock();

  return (
    <TableRow>
      <TableCell>
        <p className="font-semibold">{product.productName}</p>
        <p className="text-xs text-[var(--stock-muted-text)]">
          {product.category}{product.shortcut ? ` / ${product.shortcut}` : ""}
        </p>
      </TableCell>
      <TableCell>
        <p className="font-medium">{product.variantName}</p>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={MODE_CLASS[product.sellingMode]}>
          {MODE_LABEL[product.sellingMode]}
        </Badge>
      </TableCell>
      <TableCell className="text-sm">
        1 {product.unitType.toLowerCase()} = {formatBaseUnits(product.baseQuantity, product.baseUnit)}
      </TableCell>
      <TableCell>
        <p className="font-semibold">{product.currentStock} {product.unit}</p>
        <p className="text-xs text-[var(--stock-muted-text)]">
          {formatBaseUnits(product.stockInBaseUnit, product.baseUnit)}
        </p>
      </TableCell>
      <TableCell>
        <p className="font-semibold text-[var(--stock-selling-price)]">Rs {product.sellingPrice}</p>
        <p className="text-xs text-[var(--stock-muted-text)]">Buy Rs {product.purchasePrice}</p>
      </TableCell>
      <TableCell>
        <StockBadge product={product} />
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" className="text-orange-600" onClick={() => setAdjustingProduct(product)}>
          <MinusCircle className="h-4 w-4" />
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
