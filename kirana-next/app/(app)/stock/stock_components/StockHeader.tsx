"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Warehouse, PackagePlus } from "lucide-react";
import { useStock } from "./StockContext";

export function StockHeader() {
  const { setIsPurchaseOpen, setIsAddOpen } = useStock();
  
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Product Master</h1>
        <p className="text-sm text-muted-foreground">Khula, packet, bora, tin, box aur carton variants ek jagah.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setIsPurchaseOpen(true)}>
          <Warehouse className="h-4 w-4" />
          Purchase Entry
        </Button>
        <Button onClick={() => setIsAddOpen(true)}>
          <PackagePlus className="h-4 w-4" />
          Naya Product
        </Button>
      </div>
    </div>
  );
}
