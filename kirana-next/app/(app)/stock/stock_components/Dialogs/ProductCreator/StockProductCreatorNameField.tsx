"use client";

// StockProductCreatorNameField.tsx
// Renders the "Product Name" labeled input with inline validation message.
// Reads/writes: name, setName. Triggers submit on Enter if form is valid.

import React from "react";
import { Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStockProductCreator } from "../../../stock_context/StockProductCreatorContext";

export function StockProductCreatorNameField() {
  const { name, setName, isValid, handleSubmit } = useStockProductCreator();

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold flex items-center gap-1.5">
        <Tag className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
        Product Name
        <span className="text-[var(--stock-destructive-text)]">*</span>
      </label>
      <Input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Tata Salt, Fortune Mustard Oil, Parle-G..."
        className="h-12 text-base font-medium"
        onKeyDown={(e) => e.key === "Enter" && isValid && handleSubmit()}
      />
      {name.trim().length > 0 && name.trim().length < 2 && (
        <p className="text-xs text-[var(--stock-destructive-text)]">Name too short</p>
      )}
    </div>
  );
}
