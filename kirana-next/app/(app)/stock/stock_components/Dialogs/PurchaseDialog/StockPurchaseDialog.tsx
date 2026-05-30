"use client";

// StockPurchaseDialog.tsx
// ─────────────────────────────────────────────────────────────────────────────
// "Purchase Entry" dialog — records incoming stock.
// This file owns the minimal local form state (variantId, quantity,
// purchasePrice, supplierId, expiryDate) and composes isolated sub-components.
//
// NOTE: Purchase dialog state is small enough (5 fields) that it does NOT
// need a dedicated Context. All state lives here and is passed as props to
// the sub-components, which is one clean level of prop passing.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStock } from "../../Contexts/StockContext";
import { StockPurchaseDialogProductSelector } from "./StockPurchaseDialogProductSelector";
import { StockPurchaseDialogQuantityRateFields } from "./StockPurchaseDialogQuantityRateFields";
import { StockPurchaseDialogSupplierExpiryFields } from "./StockPurchaseDialogSupplierExpiryFields";
import { StockPurchaseDialogStockPreview } from "./StockPurchaseDialogStockPreview";

export function StockPurchaseDialog() {
  const { isPurchaseOpen, setIsPurchaseOpen, allProducts, purchase, isPurchasing } = useStock();

  // Local form state — 5 fields, no context needed
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState("");
  const [supplierId, setSupplierId] = useState<string>("none");
  const [expiryDate, setExpiryDate] = useState("");

  const selectedProduct = allProducts.find((p) => p.id.toString() === variantId);

  const resetForm = () => {
    setVariantId("");
    setQuantity(1);
    setPurchasePrice("");
    setSupplierId("none");
    setExpiryDate("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    setIsPurchaseOpen(open);
  };

  const handleSubmit = () => {
    if (!selectedProduct) return;
    purchase(
      selectedProduct.id,
      quantity,
      purchasePrice ? Number(purchasePrice) : undefined,
      supplierId !== "none" ? Number(supplierId) : undefined,
      expiryDate || undefined
    );
    resetForm();
  };

  return (
    <Dialog open={isPurchaseOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Purchase Entry</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <StockPurchaseDialogProductSelector
            variantId={variantId}
            onVariantChange={setVariantId}
          />

          <StockPurchaseDialogQuantityRateFields
            quantity={quantity}
            purchasePrice={purchasePrice}
            onQuantityChange={setQuantity}
            onPurchasePriceChange={setPurchasePrice}
          />

          <StockPurchaseDialogSupplierExpiryFields
            supplierId={supplierId}
            expiryDate={expiryDate}
            onSupplierChange={setSupplierId}
            onExpiryDateChange={setExpiryDate}
          />

          {selectedProduct && (
            <StockPurchaseDialogStockPreview
              selectedProduct={selectedProduct}
              quantity={quantity}
            />
          )}

          <Button
            onClick={handleSubmit}
            disabled={!selectedProduct || quantity <= 0 || isPurchasing}
            className="h-11 font-bold"
          >
            {isPurchasing ? "Saving..." : "Stock Add Karein"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
