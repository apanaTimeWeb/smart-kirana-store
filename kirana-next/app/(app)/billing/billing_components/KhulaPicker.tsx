"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Product } from "@/lib/api";
import { formatBaseUnits, priceForBaseQuantity, rateUnit, defaultPresetsFor, uniqueNumbers } from "./utils";

interface KhulaPickerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product, baseQuantity: number) => void;
}

export function KhulaPicker({ product, open, onOpenChange, onAdd }: KhulaPickerProps) {
  const [custom, setCustom] = useState("");

  if (!product) return null;

  const presets = uniqueNumbers([
    ...(product.popularBaseQuantities ?? []),
    ...(product.presetBaseQuantities ?? []),
    ...defaultPresetsFor(product),
    product.baseQuantity,
  ]).slice(0, 8);

  const add = (baseQuantity: number) => {
    onAdd(product, baseQuantity);
    setCustom("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.productName} - Khula</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-[var(--billing-khula-rate-bg)] p-3">
            <p className="text-sm text-muted-foreground">Rate</p>
            <p className="text-2xl font-extrabold text-[var(--billing-product-price)]">
              Rs {product.sellingPrice} / {rateUnit(product)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {presets.map((baseQuantity) => (
              <Button
                key={baseQuantity}
                type="button"
                variant="outline"
                className="h-14 flex-col gap-0"
                onClick={() => add(baseQuantity)}
              >
                <span className="font-bold">{formatBaseUnits(baseQuantity, product.baseUnit)}</span>
                <span className="text-xs text-muted-foreground">
                  Rs {priceForBaseQuantity(product, baseQuantity)}
                </span>
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder={
                product.baseUnit === "gram"
                  ? "Custom gram"
                  : product.baseUnit === "ml"
                  ? "Custom ml"
                  : "Custom pcs"
              }
            />
            <Button
              type="button"
              disabled={!Number(custom)}
              onClick={() => add(Number(custom))}
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
