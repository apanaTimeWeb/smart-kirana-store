"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/lib/api";
import { StockBadge } from "./StockBadge";
import { useStock } from "./StockContext";
import { MODE_CLASS, MODE_LABEL } from "./StockConstants";
import { formatBaseUnits } from "./StockUtils";

export function StockTableRow({ product }: { product: Product }) {
  const { setEditingProduct, remove } = useStock();

  return (
    <TableRow>
      <TableCell>
        <p className="font-semibold">{product.productName}</p>
        <p className="text-xs text-muted-foreground">
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
        <p className="text-xs text-muted-foreground">
          {formatBaseUnits(product.stockInBaseUnit, product.baseUnit)}
        </p>
      </TableCell>
      <TableCell>
        <p className="font-semibold text-[var(--stock-selling-price)]">Rs {product.sellingPrice}</p>
        <p className="text-xs text-muted-foreground">Buy Rs {product.purchasePrice}</p>
      </TableCell>
      <TableCell>
        <StockBadge product={product} />
      </TableCell>
      <TableCell className="text-right">
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
