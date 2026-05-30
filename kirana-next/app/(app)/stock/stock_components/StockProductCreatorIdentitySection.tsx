"use client";

// StockProductCreatorIdentitySection.tsx
// Renders the "Product Identity" card inside the creator dialog.
// Fields: Variant Name override, Category, Brand, Keywords, Shortcut Key.

import React from "react";
import { Info, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStockProductCreator } from "./StockProductCreatorContext";

export function StockProductCreatorIdentitySection() {
  const {
    cfg,
    unitType,
    variantName,
    setVariantNameOverride,
    category, setCategory,
    brand, setBrand,
    keywords, setKeywords,
    shortcut, setShortcut,
  } = useStockProductCreator();

  return (
    <>
      {/* Variant Name Override */}
      <div className="rounded-xl border bg-[var(--stock-card-bg)] p-4 space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-[var(--stock-muted-text)]" />
          Variant Name
        </h4>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
            Name (auto-suggested: &quot;{cfg?.variantNameSuggestion ?? unitType}&quot;)
          </label>
          <Input
            value={variantName}
            onChange={(e) => setVariantNameOverride(e.target.value)}
            placeholder={cfg?.variantNameSuggestion ?? unitType}
            className="h-9 text-sm"
          />
          <p className="text-[11px] text-[var(--stock-muted-text)]">
            This is the size/pack name shown in the product table and billing screen.
          </p>
        </div>
      </div>

      {/* Product Identity */}
      <div className="rounded-xl border bg-[var(--stock-card-bg)] p-4 space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Info className="h-4 w-4 text-[var(--stock-muted-text)]" />
          Product Identity
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">Category</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Oil, Dal, Snacks"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">Brand</label>
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Fortune, Tata, Amul"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
              Search Keywords (comma-separated)
            </label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. sarso tel, mustard oil"
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
              Shortcut Key (for fast billing search)
            </label>
            <Input
              value={shortcut}
              onChange={(e) => setShortcut(e.target.value)}
              placeholder="e.g. oil, att, chi"
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
}
