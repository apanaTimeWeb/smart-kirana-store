"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      barcode: product.barcode ?? "",
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
          <DialogTitle>Edit Variant - {product.productName}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <Input value={draft.variantName} onChange={(e) => patchDraft({ variantName: e.target.value })} />
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
            value={draft.barcode ?? ""}
            onChange={(e) => patchDraft({ barcode: e.target.value })}
            placeholder="Barcode"
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
        <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <Checkbox
            checked={draft.quickSelect}
            onCheckedChange={(checked) => patchDraft({ quickSelect: Boolean(checked) })}
          />
          Quick billing suggestion
        </label>

        <Button onClick={() => onSubmit(product.id, draft)} disabled={isPending} className="h-11 font-bold">
          {isPending ? "Saving..." : "Update Variant"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
