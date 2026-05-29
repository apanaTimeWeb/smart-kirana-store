"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function ExpiringSoonList({
  products,
}: {
  products: { id: number; name: string; variantName: string; expiryDate: string; daysLeft: number }[];
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.variantName.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader className="border-b bg-muted/20 px-4 py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dashboard-expiry-bg)] text-[var(--dashboard-expiry-icon)]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Expiring Soon</CardTitle>
            <p className="text-xs text-muted-foreground">अलेर्ट</p>
          </div>
        </div>
      </CardHeader>
      <div className="px-4 py-2 border-b">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="search"
            placeholder="Search by product..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <CardContent className="flex-1 overflow-auto p-0">
        {currentProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Clock className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">No items match your search.</p>
          </div>
        ) : (
          <div className="divide-y">
            {currentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-sm leading-none">{product.name}</span>
                  <span className="text-xs text-muted-foreground">{product.variantName}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium bg-[var(--dashboard-expiry-bg)] text-[var(--dashboard-expiry-value)] px-2 py-0.5 rounded-md">
                    {product.daysLeft <= 0 ? "Expired" : `${product.daysLeft} days left`}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(product.expiryDate), "dd MMM yyyy")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="flex items-center justify-between px-4 py-3 border-t mt-auto">
        <p className="text-xs text-muted-foreground">
          Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </Card>
  );
}
