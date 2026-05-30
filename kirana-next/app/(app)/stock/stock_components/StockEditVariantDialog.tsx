"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductVariantInput, UnitType } from "@/lib/api";
import { VariantDraft } from "./StockTypes";
import {
  defaultBaseQuantity,
  defaultBaseUnit,
  numberValue,
  formatBaseUnits
} from "./StockUtils";
import { UNIT_CONFIG, MODE_LABEL } from "./StockConstants";
import { Package, Scale, IndianRupee, Calendar, Star, CircleCheck, AlertTriangle, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { StockUnitSelector } from "./StockUnitSelector";
import { useStock } from "./StockContext";

export function StockEditVariantDialog() {
  const { editingProduct: product, setEditingProduct, update, isUpdating } = useStock();
  const [draft, setDraft] = useState<VariantDraft | null>(null);

  useEffect(() => {
    if (!product) {
      setDraft(null);
      return;
    }
    setDraft({
      rowId: product.id.toString(),
      id: product.id,
      variantName: product.variantName,
      unitType: product.unitType,
      baseUnit: product.baseUnit,
      baseQuantity: product.baseQuantity,
      sellingMode: product.sellingMode,
      mrp: product.mrp ?? 0,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      quickSelect: product.quickSelect,
      expiryDate: product.expiryDate ?? "",
      stockInBaseUnit: product.stockInBaseUnit,
      lowStockThresholdInBaseUnit: product.lowStockThresholdInBaseUnit,
      presetBaseQuantities: product.presetBaseQuantities ?? [],
    });
  }, [product]);

  if (!product || !draft) return null;

  const patchDraft = (patch: Partial<VariantDraft>) => {
    const unitType = patch.unitType ?? draft.unitType;
    setDraft({
      ...draft,
      ...patch,
      unitType,
      baseUnit: patch.unitType ? defaultBaseUnit(unitType) : patch.baseUnit ?? draft.baseUnit,
      baseQuantity: patch.unitType ? defaultBaseQuantity(unitType) : patch.baseQuantity ?? draft.baseQuantity,
    });
  };

  const handleUnitChange = (newUnit: string) => {
    const cfg = UNIT_CONFIG[newUnit];
    if (!cfg) return;
    patchDraft({
      unitType: newUnit as UnitType,
      baseUnit: cfg.baseUnit,
      baseQuantity: cfg.baseQuantity,
      sellingMode: cfg.sellingMode,
    });
  };

  const cfg = UNIT_CONFIG[draft.unitType];
  const unitStr = draft.unitType.toLowerCase();
  
  const buyPrice = draft.purchasePrice || 0;
  const sellPrice = draft.sellingPrice || 0;
  const isLoss = sellPrice > 0 && buyPrice > 0 && sellPrice < buyPrice;
  const margin = buyPrice > 0 ? (((sellPrice - buyPrice) / buyPrice) * 100).toFixed(1) : null;
  
  const errors: string[] = [];
  if (!draft.variantName.trim()) errors.push("Size Name is required");
  if (sellPrice <= 0) errors.push("Sell price must be > 0");
  const isValid = errors.length === 0;

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && setEditingProduct(null)}>
      <DialogContent className="max-w-2xl max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-[var(--stock-card-bg)] px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--stock-primary-bg)] text-[var(--stock-primary-text)] shadow-sm">
              <Package className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-lg font-bold">Edit Pack / Size</DialogTitle>
              <DialogDescription className="text-xs text-[var(--stock-muted-text)] mt-0.5">
                Update details for {product.productName}. Unit changes will auto-wire base calculations.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* ROW 1: Variant Name & Expiry Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
                Size Name
                <span className="text-[var(--stock-destructive-text)]">*</span>
              </label>
              <Input
                autoFocus
                value={draft.variantName}
                onChange={(e) => patchDraft({ variantName: e.target.value })}
                placeholder="e.g. 500g Pouch, 1 Litre Bottle..."
                className="h-12 text-base font-medium"
              />
              <p className="text-[11px] text-[var(--stock-muted-text)]">Shown in billing and tables</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
                Expiry Date
              </label>
              <Input
                type="date"
                value={draft.expiryDate ?? ""}
                onChange={(e) => patchDraft({ expiryDate: e.target.value })}
                className="h-12 text-base"
              />
              <p className="text-[11px] text-[var(--stock-muted-text)]">Leave empty if not applicable</p>
            </div>
          </div>

          {/* ROW 2: Unit Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
              How is it measured / sold?
            </label>
            <StockUnitSelector
              value={draft.unitType}
              onChange={handleUnitChange}
              triggerClassName="h-12 text-sm font-medium px-3"
            />

            {/* Auto-wired Pills matching ProductCreator */}
            {cfg && (
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
                  <CircleCheck className="h-3 w-3" />
                  Base: {draft.baseUnit}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
                  <CircleCheck className="h-3 w-3" />
                  1 {unitStr} = {formatBaseUnits(draft.baseQuantity, draft.baseUnit)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
                  <CircleCheck className="h-3 w-3" />
                  Mode: {MODE_LABEL[draft.sellingMode]}
                </span>
              </div>
            )}
          </div>

          {/* ROW 3: Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
                Buy Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--stock-muted-text)] text-sm font-medium">₹</span>
                <Input
                  type="number"
                  min={0}
                  value={draft.purchasePrice === 0 && !draft.purchasePrice ? "" : draft.purchasePrice}
                  onChange={(e) => patchDraft({ purchasePrice: numberValue(e.target.value) })}
                  placeholder="0"
                  className="h-12 pl-7 text-base font-semibold text-[var(--stock-purchase-rate)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-[var(--stock-muted-text)]" />
                Sell Price (₹)
                <span className="text-[var(--stock-destructive-text)]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--stock-muted-text)] text-sm font-medium">₹</span>
                <Input
                  type="number"
                  min={0}
                  value={draft.sellingPrice === 0 && !draft.sellingPrice ? "" : draft.sellingPrice}
                  onChange={(e) => patchDraft({ sellingPrice: numberValue(e.target.value) })}
                  placeholder="0"
                  className="h-12 pl-7 text-base font-semibold text-[var(--stock-selling-price)]"
                />
              </div>
            </div>
          </div>
          
          {/* Live Preview / Margins Box */}
          {sellPrice > 0 && (
            <div className={cn(
              "flex flex-col gap-2 rounded-lg px-4 py-3 border transition-colors",
              isLoss
                ? "bg-[var(--stock-preview-loss-bg)] border-[var(--stock-preview-loss-border)]"
                : "bg-[var(--stock-preview-ok-bg)] border-[var(--stock-preview-ok-border)]"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--stock-muted-text)] font-medium">
                  Buy ₹{buyPrice} → Sell ₹{sellPrice}
                </span>
                {margin !== null && (
                  <span className={cn(
                    "text-xs font-bold",
                    isLoss ? "text-[var(--stock-preview-loss-text)]" : "text-[var(--stock-preview-ok-text)]"
                  )}>
                    {isLoss ? "⚠️ Loss " : "↑ "}{margin}% margin
                  </span>
                )}
              </div>
              {isLoss && (
                <p className="text-xs text-[var(--stock-preview-loss-text)] flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Sell price is less than buy price.
                </p>
              )}
            </div>
          )}

          {/* ROW 4: Stock & Extras */}
          <div className="rounded-xl border bg-[var(--stock-card-bg)] p-4 space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Box className="h-4 w-4 text-[var(--stock-muted-text)]" />
              Stock & Extras
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
                  Current Stock ({unitStr})
                </label>
                <Input
                  type="number"
                  value={draft.stockInBaseUnit / draft.baseQuantity}
                  onChange={(e) => patchDraft({ stockInBaseUnit: numberValue(e.target.value) * draft.baseQuantity })}
                  placeholder="0"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
                  Low Stock Alert
                </label>
                <Input
                  type="number"
                  value={draft.lowStockThresholdInBaseUnit / draft.baseQuantity}
                  onChange={(e) => patchDraft({ lowStockThresholdInBaseUnit: numberValue(e.target.value) * draft.baseQuantity })}
                  placeholder="5"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--stock-muted-text)]">
                  MRP ₹
                </label>
                <Input
                  type="number"
                  min={0}
                  value={draft.mrp === 0 && !draft.mrp ? "" : draft.mrp}
                  onChange={(e) => patchDraft({ mrp: numberValue(e.target.value) })}
                  placeholder="0"
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <p className="text-[11px] text-[var(--stock-muted-text)] mt-2 border-t pt-2">
              Note: Stock changes automatically update Base Units. Current base inventory: <strong>{formatBaseUnits(draft.stockInBaseUnit, draft.baseUnit)}</strong>.
            </p>
          </div>

          {/* Quick Settings */}
          <div className="rounded-xl border bg-[var(--stock-card-bg)] p-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={draft.quickSelect}
                onCheckedChange={(checked) => patchDraft({ quickSelect: Boolean(checked) })}
                className="mt-1"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold flex items-center gap-1.5 group-hover:text-[var(--stock-primary-color)] transition-colors">
                  <Star className="h-3.5 w-3.5 text-[var(--stock-warning-text)]" />
                  Fast Billing Me Dikhaye
                </p>
                <p className="text-xs text-[var(--stock-muted-text)]">
                  Pin this variant to the Quick-Select panel on the billing screen for 2-click checkout.
                </p>
              </div>
            </label>
          </div>
          
        </div>

        {/* Footer */}
        <div className="border-t bg-[var(--stock-card-bg)] px-5 py-4 shrink-0">
          {!isValid && (
            <div className="mb-3 flex items-start gap-2 rounded-lg bg-[var(--stock-stock-out-bg)] border border-[var(--stock-stock-out-border)] px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-[var(--stock-stock-out-text)] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {errors.map((e, i) => (
                  <p key={i} className="text-xs text-[var(--stock-stock-out-text)]">{e}</p>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setEditingProduct(null)} className="w-24">
              Cancel
            </Button>
            <Button 
              onClick={() => update(product.id, draft)} 
              disabled={isUpdating || !isValid} 
              className="w-32 font-bold"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
