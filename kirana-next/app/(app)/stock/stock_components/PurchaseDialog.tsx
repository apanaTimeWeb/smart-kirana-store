"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, useListSuppliers } from "@/lib/api";
import { formatBaseUnits, numberValue } from "./utils";

export function PurchaseDialog({
  open,
  onOpenChange,
  products,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSubmit: (variantId: number, quantity: number, purchasePrice?: number, supplierId?: number, expiryDate?: string) => void;
  isPending: boolean;
}) {
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState("");
  const [supplierId, setSupplierId] = useState<string>("none");
  const [expiryDate, setExpiryDate] = useState("");

  const { data: suppliers = [] } = useListSuppliers();

  const selected = products.find((product) => product.id.toString() === variantId);
  const addedBase = selected ? selected.baseQuantity * quantity : 0;

  const submit = () => {
    if (!selected) return;
    onSubmit(
      selected.id,
      quantity,
      purchasePrice ? Number(purchasePrice) : undefined,
      supplierId !== "none" ? Number(supplierId) : undefined,
      expiryDate || undefined
    );
    setQuantity(1);
    setPurchasePrice("");
    setSupplierId("none");
    setExpiryDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Purchase Entry</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Product variant</label>
            <Select value={variantId} onValueChange={setVariantId}>
              <SelectTrigger><SelectValue placeholder="Chini 50kg Bora" /></SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.productName} - {product.variantName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Qty</label>
              <Input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(numberValue(e.target.value, 0))}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">New purchase rate</label>
              <Input
                type="number"
                min="0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Supplier (Khata)</label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger><SelectValue placeholder="Select Supplier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Supplier (Cash)</SelectItem>
                  {suppliers.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id.toString()}>
                      {sup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Expiry Date (Batch)</label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="optional"
              />
            </div>
          </div>

          {selected && (
            <div className="rounded-lg border bg-[var(--stock-purchase-preview-bg)] p-4">
              <p className="text-sm font-semibold">{quantity} x {selected.variantName}</p>
              <p className="mt-1 text-2xl font-extrabold text-[var(--stock-purchase-preview-text)]">
                + {formatBaseUnits(addedBase, selected.baseUnit)}
              </p>
              <p className="text-xs text-muted-foreground">
                Stock base me add hoga. Current: {selected.currentStock} {selected.unit}
              </p>
            </div>
          )}

          <Button
            onClick={submit}
            disabled={!selected || quantity <= 0 || isPending}
            className="h-11 font-bold"
          >
            {isPending ? "Saving..." : "Stock Add Karein"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
