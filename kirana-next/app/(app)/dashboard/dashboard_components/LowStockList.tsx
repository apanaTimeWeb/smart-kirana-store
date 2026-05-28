"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PackageOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";

type LowStockProduct = {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  lowStockThreshold: number;
  unit: string;
};

interface LowStockListProps {
  products: LowStockProduct[];
}

export function LowStockList({ products }: LowStockListProps) {
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
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <PackageOpen className="h-4 w-4" />
          कम स्टॉक वाले सामान
          <span className="text-sm font-normal text-muted-foreground ml-1">(Low Stock)</span>
        </CardTitle>
      </CardHeader>
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
      <CardContent className="p-0 flex-1">
        {currentProducts.length > 0 ? (
          <div className="divide-y">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
                data-testid={`row-lowstock-${product.id}`}
              >
                <div>
                  <p className="font-semibold text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-sm ${
                      product.currentStock === 0
                        ? "text-[var(--dashboard-lowstock-value)]"
                        : "text-[var(--dashboard-khata-value)]"
                    }`}
                  >
                    {product.currentStock === 0
                      ? "Out of Stock"
                      : `${product.currentStock} ${product.unit} left`}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Min: {product.lowStockThreshold}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <PackageOpen className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm">No items match your search</p>
          </div>
        )}
      </CardContent>
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
    </Card>
  );
}
