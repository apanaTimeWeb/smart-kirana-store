"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LowStockListProps {
  isLoading: boolean;
  products: { id: number; name: string; category: string; currentStock: number; stockInBaseUnit: number; unit: string }[];
}

export function LowStockList({ isLoading, products }: LowStockListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Low Stock Alert
        </CardTitle>
      </CardHeader>
      {!isLoading && (
        <div className="px-5 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by product or category..."
              className="pl-8 h-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      )}
      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <div className="space-y-2 p-5">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-10 w-full" />
            ))}
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="divide-y">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/20"
                data-testid={`row-lowstock-${product.id}`}
              >
                <div>
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <Badge
                  className={cn(
                    "text-[10px] font-medium",
                    product.currentStock === 0 || product.stockInBaseUnit <= 0
                      ? "bg-[var(--reports-badge-out-bg)] text-[var(--reports-badge-out-text)] border-[var(--reports-badge-out-border)]"
                      : "bg-[var(--reports-badge-low-bg)] text-[var(--reports-badge-low-text)] border-[var(--reports-badge-low-border)]"
                  )}
                >
                  {product.currentStock === 0 || product.stockInBaseUnit <= 0
                    ? "Out of Stock"
                    : `${product.currentStock} ${product.unit} left`}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <AlertTriangle className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">Sab stock sahi level par hai.</p>
          </div>
        )}
      </CardContent>
      {!isLoading && (
        <div className="flex items-center justify-between px-5 py-3 border-t mt-auto">
          <p className="text-xs text-muted-foreground">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
