"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HistorySearchFilterProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export function HistorySearchFilter({ 
  placeholder, 
  value, 
  onChange, 
  className = "relative",
  inputClassName = "pl-9 h-11"
}: HistorySearchFilterProps) {
  return (
    <div className={className}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--history-muted-text)]" />
      <Input 
        type="search"
        placeholder={placeholder} 
        className={inputClassName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
