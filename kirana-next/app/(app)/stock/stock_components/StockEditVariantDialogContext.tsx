"use client";

// StockEditVariantDialogContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Isolated React Context for the "Edit Pack / Size" dialog's local draft state.
// Keeps draft state fully inside the dialog — zero pollution to StockContext.
//
// WHY a dedicated context?
//   The edit dialog is broken into 5+ micro-components (name/expiry row,
//   unit section, price+margin section, stock extras, footer). Without this
//   context, draft state would need to be prop-drilled 3-4 levels deep.
//
// TOMORROW: Swap useEffect initialiser with an API-fetched draft if needed.
//   Only THIS file changes.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from "react";
import { UnitType } from "@/lib/api";
import { VariantDraft } from "./StockTypes";
import { UNIT_CONFIG } from "./StockConstants";
import { defaultBaseUnit, defaultBaseQuantity } from "./StockUtils";
import { useStock } from "./StockContext";

function useStockEditVariantDialogInternal() {
  const { editingProduct: product, setEditingProduct, update, isUpdating } = useStock();
  const [draft, setDraft] = useState<VariantDraft | null>(null);

  // Sync draft when a product is opened for editing
  useEffect(() => {
    if (!product) { setDraft(null); return; }
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

  const patchDraft = (patch: Partial<VariantDraft>) => {
    if (!draft) return;
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

  // Derived values
  const cfg = draft ? UNIT_CONFIG[draft.unitType] : null;
  const buyPrice = draft?.purchasePrice ?? 0;
  const sellPrice = draft?.sellingPrice ?? 0;
  const isLoss = sellPrice > 0 && buyPrice > 0 && sellPrice < buyPrice;
  const margin = buyPrice > 0 ? (((sellPrice - buyPrice) / buyPrice) * 100).toFixed(1) : null;

  const errors: string[] = [];
  if (draft && !draft.variantName.trim()) errors.push("Size Name is required");
  if (sellPrice <= 0) errors.push("Sell price must be > 0");
  const isValid = errors.length === 0;

  const handleSave = () => {
    if (!product || !draft) return;
    update(product.id, draft);
  };

  return {
    product,
    draft,
    patchDraft,
    handleUnitChange,
    cfg,
    buyPrice,
    sellPrice,
    isLoss,
    margin,
    errors,
    isValid,
    isUpdating,
    handleSave,
    closeDialog: () => setEditingProduct(null),
  };
}

export type StockEditVariantDialogContextValue = ReturnType<typeof useStockEditVariantDialogInternal>;
const StockEditVariantDialogContext = createContext<StockEditVariantDialogContextValue | null>(null);

export function StockEditVariantDialogProvider({ children }: { children: React.ReactNode }) {
  const value = useStockEditVariantDialogInternal();
  return (
    <StockEditVariantDialogContext.Provider value={value}>
      {children}
    </StockEditVariantDialogContext.Provider>
  );
}

export function useStockEditVariantDialog() {
  const ctx = useContext(StockEditVariantDialogContext);
  if (!ctx) throw new Error("useStockEditVariantDialog must be used within StockEditVariantDialogProvider");
  return ctx;
}
