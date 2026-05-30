"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageOpen } from "lucide-react";
import { useDashboardContext } from "../../dashboard_context/DashboardContext";
import { DASHBOARD_CONSTANTS } from "../../dashboard_constants/DashboardSharedConstants";
import { DashboardSearchFilter } from "../DashboardShared/DashboardSearchFilter";
import { DashboardPagination } from "../DashboardShared/DashboardPagination";

export function DashboardLowStockList() {
  const { summary } = useDashboardContext();
  const products = summary?.lowStockProducts ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredProducts.length / DASHBOARD_CONSTANTS.ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * DASHBOARD_CONSTANTS.ITEMS_PER_PAGE,
    currentPage * DASHBOARD_CONSTANTS.ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-[var(--dashboard-destructive-text)]">
          <PackageOpen className="h-4 w-4" />
          कम स्टॉक वाले सामान
          <span className="text-sm font-normal text-[var(--dashboard-muted-text)] ml-1">(Low Stock)</span>
        </CardTitle>
      </CardHeader>
      <div className="px-5 pb-2">
        <DashboardSearchFilter 
          placeholder="Search by product or category..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <CardContent className="p-0 flex-1">
        {currentProducts.length > 0 ? (
          <div className="divide-y">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-[var(--dashboard-row-hover-bg)] transition-colors"
                data-testid={`row-lowstock-${product.id}`}
              >
                <div>
                  <p className="font-semibold text-sm">{product.name}</p>
                  <p className="text-xs text-[var(--dashboard-muted-text)]">{product.category}</p>
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
                  <p className="text-[10px] text-[var(--dashboard-muted-text)]">Min: {product.lowStockThreshold}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--dashboard-muted-text)]">
            <PackageOpen className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm">No items match your search</p>
          </div>
        )}
      </CardContent>
      <div className="flex items-center justify-between px-5 py-3 border-t mt-auto">
        <DashboardPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Card>
  );
}
