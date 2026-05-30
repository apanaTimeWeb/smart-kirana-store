"use client";

// StockProductCreatorStockPricingSection.tsx
// Renders the "Stock & Pricing Extras" card inside the creator dialog.
// Fields: MRP, Opening Stock (with base unit conversion hint),
//         Low Stock Alert (with default hint), Expiry Date, Quick Select checkbox.

import React from "react";
import { Package, Calendar, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { numberValue, formatBaseUnits } from "../../Shared/StockUtils";
import { useStockProductCreator } from "../../Contexts/StockProductCreatorContext";

export function StockProductCreatorStockPricingSection() {
  const {
    cfg,
    mrp, setMrp,
    initialStock, setInitialStock,
    lowStockAlert, setLowStockAlert,
    expiryDate, setExpiryDate,
    quickSelect, setQuickSelect,
    defaultLowStockAlert,
  } = useStockProductCreator();

  return (
    <div className="rounded-xl border bg-[var(--stock-card-bg)] p-4 space-y-4">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Package className="h-4 w-4 text-[var(--stock-muted-text)]" />
        Stock &amp; Pricing Extras
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* MRP */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
            MRP ₹ (printed on pack)
          </label>
          <Input
            type="number"
            min={0}
            value={mrp === "" ? "" : mrp}
            onChange={(e) => setMrp(e.target.value === "" ? "" : numberValue(e.target.value))}
            placeholder="e.g. 55"
            className="h-9 text-sm"
          />
        </div>

        {/* Opening Stock */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
            Opening Stock (units)
          </label>
          <Input
            type="number"
            min={0}
            value={initialStock === "" ? "" : initialStock}
            onChange={(e) => setInitialStock(e.target.value === "" ? "" : numberValue(e.target.value))}
            placeholder="0"
            className="h-9 text-sm"
          />
          {initialStock !== "" && cfg && (
            <p className="text-[11px] text-[var(--stock-muted-text)]">
              = {formatBaseUnits(Number(initialStock) * cfg.baseQuantity, cfg.baseUnit)} stored
            </p>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
            Low Stock Alert (units)
          </label>
          <Input
            type="number"
            min={0}
            value={lowStockAlert === "" ? "" : lowStockAlert}
            onChange={(e) => setLowStockAlert(e.target.value === "" ? "" : numberValue(e.target.value))}
            placeholder={String(defaultLowStockAlert)}
            className="h-9 text-sm"
          />
          <p className="text-[11px] text-[var(--stock-muted-text)]">
            Default: {defaultLowStockAlert} units. Alert shows when stock drops below this.
          </p>
        </div>
      </div>

      {/* Expiry + Quick Select */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)] flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Expiry Date
          </label>
          <Input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-start gap-3 cursor-pointer hover:bg-[var(--stock-muted-bg-40)] p-3 rounded-lg border border-transparent hover:border-border transition-all w-full">
            <Checkbox
              checked={quickSelect}
              onCheckedChange={(v) => setQuickSelect(Boolean(v))}
              className="mt-0.5"
            />
            <div className="space-y-0.5">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-[var(--stock-warning-text)]" />
                Fast Billing Me Dikhaye
              </p>
              <p className="text-[11px] text-[var(--stock-muted-text)]">
                Billing screen ke quick-select panel me show hoga
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
