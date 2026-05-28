"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Master + Variants</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Product name</label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Fortune Mustard Oil"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  placeholder="Oil"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Brand</label>
                <Input
                  value={draft.brand}
                  onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                  placeholder="Fortune"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Search keywords</label>
              <Input
                value={draft.keywords}
                onChange={(e) => setDraft({ ...draft, keywords: e.target.value })}
                placeholder="sarso tel, oil, mustard"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Shortcut</label>
                <Input
                  value={draft.shortcut}
                  onChange={(e) => setDraft({ ...draft, shortcut: e.target.value })}
                  placeholder="oil"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Master barcode</label>
                <Input
                  value={draft.barcode}
                  onChange={(e) => setDraft({ ...draft, barcode: e.target.value })}
                  placeholder="optional"
                />
              </div>
            </div>

            <div className="rounded-lg border bg-[var(--products-type-bg)] p-3">
              <p className="mb-3 text-sm font-semibold">Selling type</p>
              <div className="grid gap-2">
                {([
                  ["khula", "Khula"],
                  ["fixed", "Fixed Pack"],
                  ["multiple", "Multiple Variant"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
                    <Checkbox
                      checked={draft.sellingTypes[key]}
                      onCheckedChange={(checked) => setType(key, Boolean(checked))}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold">Variant Add</p>
                <p className="text-xs text-muted-foreground">Stock hamesha base unit me save hoga: gram, ml, piece.</p>
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
                <Plus className="h-4 w-4" />
                Row
              </Button>
            </div>

            <div className="space-y-3">
              {draft.variants.map((variant, index) => (
                <div key={variant.rowId} className="rounded-lg border bg-card p-3">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Badge variant="outline">Variant {index + 1}</Badge>
                    {draft.variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[var(--products-btn-delete-text)]"
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
                  <div className="grid gap-3 md:grid-cols-4">
                    <Input
                      value={variant.variantName}
                      onChange={(e) => setVariant(variant.rowId, { variantName: e.target.value })}
                      placeholder="500ml pouch"
                    />
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
                    <Select
                      value={String(variant.unitType)}
                      onValueChange={(value) => setVariant(variant.rowId, { unitType: value as any })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={variant.baseUnit}
                      onValueChange={(value) => setVariant(variant.rowId, { baseUnit: value as BaseUnit })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {BASE_UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={variant.baseQuantity}
                      onChange={(e) => setVariant(variant.rowId, { baseQuantity: numberValue(e.target.value, 1) })}
                      placeholder="Base qty"
                    />
                    <Input
                      type="number"
                      value={variant.purchasePrice}
                      onChange={(e) => setVariant(variant.rowId, { purchasePrice: numberValue(e.target.value) })}
                      placeholder="Purchase rate"
                    />
                    <Input
                      type="number"
                      value={variant.sellingPrice}
                      onChange={(e) => setVariant(variant.rowId, { sellingPrice: numberValue(e.target.value) })}
                      placeholder="Selling rate"
                    />
                    <Input
                      value={variant.barcode ?? ""}
                      onChange={(e) => setVariant(variant.rowId, { barcode: e.target.value })}
                      placeholder="Barcode"
                    />
                    <Input
                      type="number"
                      value={variant.stockInBaseUnit}
                      onChange={(e) => setVariant(variant.rowId, { stockInBaseUnit: numberValue(e.target.value) })}
                      placeholder="Stock in base unit"
                    />
                    <Input
                      type="number"
                      value={variant.lowStockThresholdInBaseUnit}
                      onChange={(e) => setVariant(variant.rowId, { lowStockThresholdInBaseUnit: numberValue(e.target.value) })}
                      placeholder="Low stock base"
                    />
                    <Input
                      type="number"
                      value={variant.mrp ?? 0}
                      onChange={(e) => setVariant(variant.rowId, { mrp: numberValue(e.target.value) })}
                      placeholder="MRP"
                    />
                    <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                      <Checkbox
                        checked={variant.quickSelect}
                        onCheckedChange={(checked) => setVariant(variant.rowId, { quickSelect: Boolean(checked) })}
                      />
                      Quick
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    1 {variant.unitType.toLowerCase()} = {formatBaseUnits(numberValue(variant.baseQuantity, 1), variant.baseUnit)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={submit}
          disabled={isPending || !draft.name.trim() || draft.variants.length === 0}
          className="h-11 w-full font-bold"
        >
          {isPending ? "Saving..." : "Product Save Karein"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
