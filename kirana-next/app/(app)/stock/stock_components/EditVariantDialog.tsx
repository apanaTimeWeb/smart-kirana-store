"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Product, ProductVariantInput, BaseUnit, SellingMode } from "@/lib/api";
import { VariantDraft } from "./types";
import { BASE_UNITS, MODE_LABEL, UNITS, defaultBaseQuantity, defaultBaseUnit, numberValue } from "./utils";

export function EditVariantDialog({
  product,
  onClose,
  onSubmit,
  isPending,
}: {
  product: Product | null;
  onClose: () => void;
  onSubmit: (id: number, input: Partial<ProductVariantInput>) => void;
  isPending: boolean;
}) {
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

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Pack / Size</DialogTitle>
          <DialogDescription>
            Update pricing, stock, and details for {product.productName}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Size Name (e.g. 500ml Pouch)</label>
            <Input value={draft.variantName} onChange={(e) => patchDraft({ variantName: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Expiry Date</label>
            <Input
              type="date"
              value={draft.expiryDate ?? ""}
              onChange={(e) => patchDraft({ expiryDate: e.target.value })}
            />
          </div>
          <Select value={draft.sellingMode} onValueChange={(value) => patchDraft({ sellingMode: value as SellingMode })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(MODE_LABEL).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(draft.unitType)} onValueChange={(value) => patchDraft({ unitType: value as any })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={draft.baseUnit} onValueChange={(value) => patchDraft({ baseUnit: value as BaseUnit })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {BASE_UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={draft.baseQuantity}
            onChange={(e) => patchDraft({ baseQuantity: numberValue(e.target.value, 1) })}
          />
          <Input
            type="number"
            value={draft.purchasePrice}
            onChange={(e) => patchDraft({ purchasePrice: numberValue(e.target.value) })}
          />
          <Input
            type="number"
            value={draft.sellingPrice}
            onChange={(e) => patchDraft({ sellingPrice: numberValue(e.target.value) })}
          />
          <Input
            type="number"
            value={draft.stockInBaseUnit}
            onChange={(e) => patchDraft({ stockInBaseUnit: numberValue(e.target.value) })}
          />
          <Input
            type="number"
            value={draft.lowStockThresholdInBaseUnit}
            onChange={(e) => patchDraft({ lowStockThresholdInBaseUnit: numberValue(e.target.value) })}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md transition-colors">
          <Checkbox
            checked={draft.quickSelect}
            onCheckedChange={(checked) => patchDraft({ quickSelect: Boolean(checked) })}
          />
          <span className="text-sm font-medium">Show in Fast Billing</span>
        </label>

        <Button onClick={() => onSubmit(product.id, draft)} disabled={isPending} className="h-11 font-bold">
          {isPending ? "Saving..." : "Update Variant"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
