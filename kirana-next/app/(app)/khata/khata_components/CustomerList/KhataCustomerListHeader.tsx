"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useKhata } from "@/app/(app)/khata/khata_context/KhataContext";
import { KhataConstants } from "@/app/(app)/khata/khata_constants/KhataConstants";

interface KhataCustomerListHeaderProps {
  totalCustomers: number;
}

export function KhataCustomerListHeader({ totalCustomers }: KhataCustomerListHeaderProps) {
  const { customerSearch, setCustomerSearch, setIsAddCustomerOpen } = useKhata();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--khata-foreground)]">
          Khata (खाता)
        </h1>
        <p className="text-[var(--khata-muted-text)]">{totalCustomers} Customers</p>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--khata-muted-text)]" />
          <Input
            placeholder={KhataConstants.LABELS.SEARCH_PLACEHOLDER}
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="pl-9 w-full sm:w-64 bg-[var(--khata-background)]"
          />
        </div>
        <Button onClick={() => setIsAddCustomerOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{KhataConstants.LABELS.ADD_CUSTOMER}</span>
        </Button>
      </div>
    </div>
  );
}
