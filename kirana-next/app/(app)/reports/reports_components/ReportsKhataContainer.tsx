"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import { ReportsConstants } from "./ReportsConstants";
import type { ReportsKhataCustomer } from "./ReportsTypes";
import { ReportsKhataItem } from "./ReportsKhataItem";
import { ReportsPagination } from "./ReportsPagination";

interface ReportsKhataContainerProps {
  isLoading: boolean;
  customers: ReportsKhataCustomer[];
  moneyFormatter: (value: number) => string;
}

export function ReportsKhataContainer({
  isLoading,
  customers,
  moneyFormatter,
}: ReportsKhataContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentCustomers = filteredCustomers.slice(
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
        <CardTitle className="flex items-center gap-2 text-base text-[var(--reports-foreground)]">
          <BookOpen className="h-4 w-4 text-[var(--reports-khata-color)]" />
          {ReportsConstants.TEXTS.PENDING_UDHAAR}
        </CardTitle>
      </CardHeader>
      {!isLoading && (
        <div className="px-5 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--reports-muted-text)]" />
            <Input
              type="search"
              placeholder={ReportsConstants.TEXTS.SEARCH_CUSTOMER}
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
        ) : currentCustomers.length > 0 ? (
          <div className="divide-y divide-[var(--reports-border)]">
            {currentCustomers.map((customer) => (
              <ReportsKhataItem
                key={customer.id}
                customer={customer}
                moneyFormatter={moneyFormatter}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-[var(--reports-muted-text)]">
            <BookOpen className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">{ReportsConstants.TEXTS.NO_UDHAAR}</p>
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
