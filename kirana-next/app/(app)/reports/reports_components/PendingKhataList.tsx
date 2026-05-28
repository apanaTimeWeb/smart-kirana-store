"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface PendingKhataListProps {
  isLoading: boolean;
  customers: { id: number; name: string; phone: string; totalDue: number }[];
  moneyFormatter: (value: number) => string;
}

export function PendingKhataList({ isLoading, customers, moneyFormatter }: PendingKhataListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return customer.name.toLowerCase().includes(query) || customer.phone.includes(query);
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-[var(--reports-khata-color)]" />
          Pending Udhaar
        </CardTitle>
      </CardHeader>
      {!isLoading && (
        <div className="px-5 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by customer name or phone..."
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
        ) : currentCustomers.length > 0 ? (
          <div className="divide-y">
            {currentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/20"
                data-testid={`row-khata-${customer.id}`}
              >
                <div>
                  <p className="text-sm font-semibold">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.phone}</p>
                </div>
                <span className="text-sm font-bold text-[var(--reports-khata-color)]">
                  {moneyFormatter(customer.totalDue)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <BookOpen className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">Koi udhaar nahi, sab clear hai.</p>
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
