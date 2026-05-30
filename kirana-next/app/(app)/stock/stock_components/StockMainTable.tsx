"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStock } from "./StockContext";
import { StockTableRow } from "./StockTableRow";
import { StockPagination } from "./StockPagination";

export function StockMainTable() {
  const { paginatedProducts } = useStock();

  return (
    <div className="hidden overflow-hidden rounded-lg border bg-[var(--stock-card-bg)] md:block">
      <Table>
        <TableHeader>
          <TableRow className="bg-[var(--stock-muted-bg-60)]">
            <TableHead>Product</TableHead>
            <TableHead>Variant</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Conversion</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Rates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <StockTableRow key={product.id} product={product} />
          ))}
          {paginatedProducts.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-[var(--stock-muted-text)]">Koi product nahi mila</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <StockPagination className="px-5 py-3 border-t" />
    </div>
  );
}
