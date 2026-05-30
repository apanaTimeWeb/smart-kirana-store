"use client";

import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBilling } from "../../context/BillingContext";
import { PRESETS_GRAM, PRESETS_ML, PRESETS_PCS } from "../../constants/BillingSharedConstants";
import { formatBaseUnits, priceForBaseQuantity } from "../../utils/BillingSharedUtils";

export function BillingLooseItemQuantityPicker() {
  const { khulaProduct: product, setKhulaProduct, addKhula } = useBilling();
  const open = Boolean(product);
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) setKhulaProduct(null);
  };
  const onAdd = addKhula;
  const [customQty, setCustomQty] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCustomQty("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!product) return null;

  const presets =
    product.baseUnit === "gram"
      ? PRESETS_GRAM
      : product.baseUnit === "ml"
      ? PRESETS_ML
      : PRESETS_PCS;

  const handleAdd = (qty: number) => {
    if (qty > 0) onAdd(product, qty);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(customQty);
    if (qty > 0) handleAdd(qty);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[var(--billing-background-bg)] border-[var(--billing-border)]">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.productName}</DialogTitle>
          <p className="text-sm text-[var(--billing-muted-text)]">
            Rate: Rs {product.sellingPrice} /{" "}
            {formatBaseUnits(product.baseQuantity, product.baseUnit)}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 py-4">
          {presets.map((qty) => (
            <Button
              key={qty}
              variant="outline"
              className="flex h-16 flex-col items-center justify-center gap-1 border-[var(--billing-border)] hover:bg-[var(--billing-muted-bg)] hover:text-[var(--billing-foreground-text)]"
              onClick={() => handleAdd(qty)}
            >
              <span className="font-bold">{formatBaseUnits(qty, product.baseUnit)}</span>
              <span className="text-xs text-[var(--billing-muted-text)]">
                Rs {priceForBaseQuantity(product, qty).toFixed(1)}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
