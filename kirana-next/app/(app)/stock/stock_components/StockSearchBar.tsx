"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useStock } from "./StockContext";

export function StockSearchBar() {
  const { search, handleSearchChange } = useStock();
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--stock-muted-text)]" />
      <Input
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search: name, shortcut, keyword..."
        className="h-11 pl-9"
      />
    </div>
  );
}
