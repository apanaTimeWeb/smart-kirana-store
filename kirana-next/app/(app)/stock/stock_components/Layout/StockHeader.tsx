"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Warehouse, PackagePlus } from "lucide-react";
import { useStock } from "../../stock_context/StockContext";

export function StockHeader() {
  const { setIsPurchaseOpen, setIsAddOpen } = useStock();
  
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mera Stock</h1>
        <p className="text-sm text-[var(--stock-muted-text)]">Category-wise products — sab ek jagah.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setIsPurchaseOpen(true)}>
          <Warehouse className="h-4 w-4" />
          Maal Aaya
        </Button>
        <Button onClick={() => setIsAddOpen(true)}>
          <PackagePlus className="h-4 w-4" />
          Naya Item Jodo
        </Button>
      </div>
    </div>
  );
}
