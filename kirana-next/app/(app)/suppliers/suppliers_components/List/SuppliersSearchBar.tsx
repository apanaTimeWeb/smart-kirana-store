"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSuppliers } from "../../suppliers_context/SuppliersContext";

export function SuppliersSearchBar() {
  const { search, setSearch } = useSuppliers();

  return (
    <div className="relative flex-1 sm:flex-none">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--supplier-muted-text)]" />
      <Input
        placeholder="Naam ya phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9 w-full sm:w-64"
      />
    </div>
  );
}
