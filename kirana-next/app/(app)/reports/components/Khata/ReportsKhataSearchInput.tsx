"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReportsConstants } from "../../constants/ReportsSharedConstants";

interface ReportsKhataSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * ReportsKhataSearchInput
 *
 * Responsibility (ONE): Renders the search input field inside the
 * Pending Udhaar card. Fires onChange back to ReportsKhataContainer
 * which owns the search state.
 *
 * "use client" required — has an onChange event listener.
 */
export function ReportsKhataSearchInput({ value, onChange }: ReportsKhataSearchInputProps) {
  return (
    <div className="px-5 pb-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--reports-muted-text)]" />
        <Input
          type="search"
          id="khata-search-input"
          placeholder={ReportsConstants.TEXTS.SEARCH_CUSTOMER}
          className="pl-8 h-9 bg-[var(--reports-background)] border-[var(--reports-border)] text-[var(--reports-foreground)]"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
