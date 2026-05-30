"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStock } from "../Contexts/StockContext";
import { cn } from "@/lib/utils";

export function StockPagination({ className, compact = false }: { className?: string, compact?: boolean }) {
  const { currentPage, totalPages, setCurrentPage, paginatedProducts, visibleProducts } = useStock();

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {!compact ? (
        <p className="text-sm text-[var(--stock-muted-text)]">
          Showing {paginatedProducts.length} of {visibleProducts.length} items (Page {totalPages === 0 ? 0 : currentPage} of {totalPages})
        </p>
      ) : (
        <p className="text-xs text-[var(--stock-muted-text)]">
          Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
        </p>
      )}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn("p-0", compact ? "h-7 w-7" : "h-8 w-8")}
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn("p-0", compact ? "h-7 w-7" : "h-8 w-8")}
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
