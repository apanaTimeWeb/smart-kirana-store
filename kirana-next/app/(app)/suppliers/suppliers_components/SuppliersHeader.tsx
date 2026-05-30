"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSuppliers } from "./SuppliersContext";

export function SuppliersHeader() {
  const { suppliers, setIsAddOpen } = useSuppliers();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Supplier (खाता)</h1>
        <p className="text-[var(--supplier-muted-text)]">{suppliers.length} Suppliers</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setIsAddOpen(true)} className="shrink-0 bg-[var(--supplier-primary-bg)] text-[var(--supplier-primary-text)]">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Supplier</span>
        </Button>
      </div>
    </div>
  );
}
