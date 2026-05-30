"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Search } from "lucide-react";
import { ReportsConstants } from "./ReportsConstants";
import type { ReportsProduct } from "./ReportsTypes";
import { ReportsStockItem } from "./ReportsStockItem";
import { ReportsPagination } from "./ReportsPagination";

interface ReportsStockContainerProps {
  isLoading: boolean;
  products: ReportsProduct[];
}

export function ReportsStockContainer({
  isLoading,
  products,
}: ReportsStockContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Card className="flex flex-col h-full bg-[var(--reports-card-bg)] border-[var(--reports-border)]">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-[var(--reports-destructive)]">
          <AlertTriangle className="h-4 w-4" />
          {ReportsConstants.TEXTS.LOW_STOCK_ALERT}
        </CardTitle>
      </CardHeader>
      {!isLoading && (
        <div className="px-5 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--reports-muted-text)]" />
            <Input
              type="search"
              placeholder={ReportsConstants.TEXTS.SEARCH_PRODUCT}
              className="pl-8 h-9 bg-[var(--reports-background)] border-[var(--reports-border)] text-[var(--reports-foreground)]"
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
          <div className="divide-y divide-[var(--reports-border)]">
            {currentProducts.map((product) => (
              <ReportsStockItem key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-[var(--reports-muted-text)]">
            <AlertTriangle className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">{ReportsConstants.TEXTS.ALL_STOCK_GOOD}</p>
          </div>
        )}
      </CardContent>
      {!isLoading && (
        <ReportsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Card>
  );
}
