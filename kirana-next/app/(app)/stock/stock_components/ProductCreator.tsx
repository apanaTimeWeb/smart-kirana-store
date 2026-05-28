"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Info, Scale, IndianRupee, Package, Calendar } from "lucide-react";
import { ProductDraft, SellingTypeKey, VariantDraft } from "./types";
import {
  BASE_UNITS,
  MODE_LABEL,
  UNITS,
  buildTemplate,
  defaultBaseQuantity,
  defaultBaseUnit,
  emptyDraft,
  formatBaseUnits,
  numberValue,
  variantDraft,
} from "./utils";
import { BaseUnit, SellingMode } from "@/lib/api";

export function ProductCreator({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: ProductDraft) => void;
  isPending: boolean;
}) {
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft());

  const setType = (type: SellingTypeKey, checked: boolean) => {
    const sellingTypes = { ...draft.sellingTypes, [type]: checked };
    setDraft({ ...draft, sellingTypes, variants: buildTemplate(sellingTypes) });
  };

  const setVariant = (rowId: string, patch: Partial<VariantDraft>) => {
    setDraft({
      ...draft,
      variants: draft.variants.map((variant) => {
        if (variant.rowId !== rowId) return variant;
        const unitType = patch.unitType ?? variant.unitType;
        const baseUnit = patch.unitType ? defaultBaseUnit(unitType) : patch.baseUnit ?? variant.baseUnit;
        const baseQuantity = patch.unitType ? defaultBaseQuantity(unitType) : patch.baseQuantity ?? variant.baseQuantity;
        return { ...variant, ...patch, unitType, baseUnit, baseQuantity };
      }),
    });
  };

  const submit = () => {
    onSubmit(draft);
    setDraft(emptyDraft());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-muted/10">
        <DialogHeader className="bg-card p-5 border-b sticky top-0 z-10 -mx-6 -mt-6 mb-4">
          <DialogTitle className="text-xl">Add New Product</DialogTitle>
          <p className="text-sm text-muted-foreground">Define product details and all its variants (Khula, Packets, Wholesale).</p>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* Left Column: Master Product Info */}
          <div className="space-y-5">
            <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
              <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Master Info
              </h3>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Product Name *</label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Fortune Mustard Oil"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    placeholder="e.g. Oil"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Brand</label>
                  <Input
                    value={draft.brand}
                    onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                    placeholder="e.g. Fortune"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Search Keywords</label>
                <Input
                  value={draft.keywords}
                  onChange={(e) => setDraft({ ...draft, keywords: e.target.value })}
                  placeholder="e.g. sarso tel, mustard"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Shortcut Key</label>
                <Input
                  value={draft.shortcut}
                  onChange={(e) => setDraft({ ...draft, shortcut: e.target.value })}
                  placeholder="e.g. oil"
                />
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
              <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Auto-Generate Variants
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Select selling types to automatically create common variant templates.
              </p>
              <div className="grid gap-2.5">
                {([
                  ["khula", "Khula (Loose selling)"],
                  ["fixed", "Fixed Pack (Packets/Bottles)"],
                  ["multiple", "Wholesale (Carton/Bora)"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={draft.sellingTypes[key]}
                      onCheckedChange={(checked) => setType(key, Boolean(checked))}
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Variants Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Variants Configuration</h3>
                <p className="text-sm text-muted-foreground">Set pricing, stock, and details for each selling option.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setDraft({
                    ...draft,
                    variants: [
                      ...draft.variants,
                      variantDraft({ variantName: "New Variant", sellingMode: "variant", unitType: "PACKET" }),
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Variant
              </Button>
            </div>

            <div className="space-y-5">
              {draft.variants.map((variant, index) => (
                <div key={variant.rowId} className="rounded-xl border bg-card shadow-sm overflow-hidden">
                  <div className="bg-muted/30 px-4 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-background">Variant {index + 1}</Badge>
                      <span className="text-sm font-semibold">{variant.variantName || "Unnamed Variant"}</span>
                    </div>
                    {draft.variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            variants: draft.variants.filter((v) => v.rowId !== variant.rowId),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="p-5 space-y-6">
                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Variant Name</label>
                        <Input
                          value={variant.variantName}
                          onChange={(e) => setVariant(variant.rowId, { variantName: e.target.value })}
                          placeholder="e.g. 500ml pouch"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Selling Mode</label>
                        <Select
                          value={variant.sellingMode}
                          onValueChange={(value) => setVariant(variant.rowId, { sellingMode: value as SellingMode })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(MODE_LABEL).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Measurement & Pricing */}
                    <div className="grid gap-4 md:grid-cols-[1fr_1.5fr]">
                      {/* Units */}
                      <div className="space-y-3 rounded-lg border p-3.5 bg-muted/10">
                        <h4 className="text-xs font-semibold flex items-center gap-1.5">
                          <Scale className="h-3.5 w-3.5" /> Measurement
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="grid gap-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Pack Type</label>
                            <Select
                              value={String(variant.unitType)}
                              onValueChange={(value) => setVariant(variant.rowId, { unitType: value as any })}
                            >
                              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {UNITS.map((unit) => (
                                  <SelectItem key={unit} value={unit} className="text-xs">{unit}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Base Unit</label>
                            <Select
                              value={variant.baseUnit}
                              onValueChange={(value) => setVariant(variant.rowId, { baseUnit: value as BaseUnit })}
                            >
                              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {BASE_UNITS.map((unit) => (
                                  <SelectItem key={unit} value={unit} className="text-xs">{unit}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Qty in Base Unit</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              className="h-8 text-xs"
                              value={variant.baseQuantity}
                              onChange={(e) => setVariant(variant.rowId, { baseQuantity: numberValue(e.target.value, 1) })}
                              placeholder="e.g. 500"
                            />
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-muted px-2 py-1.5 rounded border">
                              1 {variant.unitType.toLowerCase()} = {formatBaseUnits(numberValue(variant.baseQuantity, 1), variant.baseUnit)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="space-y-3 rounded-lg border p-3.5 bg-muted/10">
                        <h4 className="text-xs font-semibold flex items-center gap-1.5">
                          <IndianRupee className="h-3.5 w-3.5" /> Pricing (₹)
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="grid gap-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Buy Rate</label>
                            <Input
                              type="number"
                              className="h-8 text-xs"
                              value={variant.purchasePrice}
                              onChange={(e) => setVariant(variant.rowId, { purchasePrice: numberValue(e.target.value) })}
                              placeholder="e.g. 40"
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Sell Rate</label>
                            <Input
                              type="number"
                              className="h-8 text-xs"
                              value={variant.sellingPrice}
                              onChange={(e) => setVariant(variant.rowId, { sellingPrice: numberValue(e.target.value) })}
                              placeholder="e.g. 45"
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">MRP</label>
                            <Input
                              type="number"
                              className="h-8 text-xs"
                              value={variant.mrp ?? 0}
                              onChange={(e) => setVariant(variant.rowId, { mrp: numberValue(e.target.value) })}
                              placeholder="e.g. 50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stock & Expiry */}
                    <div className="space-y-3 rounded-lg border p-3.5 bg-muted/10">
                      <h4 className="text-xs font-semibold flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" /> Initial Stock & Expiry
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            Current Stock ({variant.baseUnit})
                          </label>
                          <Input
                            type="number"
                            className="h-8 text-xs"
                            value={variant.stockInBaseUnit}
                            onChange={(e) => setVariant(variant.rowId, { stockInBaseUnit: numberValue(e.target.value) })}
                            placeholder="e.g. 5000"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            Low Alert At ({variant.baseUnit})
                          </label>
                          <Input
                            type="number"
                            className="h-8 text-xs"
                            value={variant.lowStockThresholdInBaseUnit}
                            onChange={(e) => setVariant(variant.rowId, { lowStockThresholdInBaseUnit: numberValue(e.target.value) })}
                            placeholder="e.g. 1000"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3"/> Expiry Date
                          </label>
                          <Input
                            type="date"
                            className="h-8 text-xs"
                            value={variant.expiryDate || ""}
                            onChange={(e) => setVariant(variant.rowId, { expiryDate: e.target.value })}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md transition-colors">
                        <Checkbox
                          checked={variant.quickSelect}
                          onCheckedChange={(checked) => setVariant(variant.rowId, { quickSelect: Boolean(checked) })}
                        />
                        <span className="text-sm font-medium">Show in Quick Billing Panel</span>
                      </label>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 sticky bottom-0 bg-background/90 backdrop-blur-sm border-t p-4 -mx-6 mb-[-24px] z-10 flex justify-end">
              <Button
                onClick={submit}
                disabled={isPending || !draft.name.trim() || draft.variants.length === 0}
                className="h-12 px-8 text-base font-bold shadow-lg"
              >
                {isPending ? "Saving..." : "Save Product & Variants"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
