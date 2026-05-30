"use client";

// StockProductCreator.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Entry point for the "Naya Product" creator dialog.
// This file is INTENTIONALLY thin (~30 lines) — it only:
//   1. Wraps children in StockProductCreatorProvider (local form state context)
//   2. Renders the Dialog shell with fixed header and scrollable body
//
// ALL form logic lives in StockProductCreatorContext.tsx
// ALL field UI lives in StockProductCreator*.tsx sub-components
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Zap } from "lucide-react";
import { StockProductCreatorProvider, useStockProductCreator } from "../../../stock_context/StockProductCreatorContext";
import { StockProductCreatorNameField } from "./StockProductCreatorNameField";
import { StockProductCreatorUnitField } from "./StockProductCreatorUnitField";
import { StockProductCreatorPriceFields } from "./StockProductCreatorPriceFields";
import { StockProductCreatorIdentitySection } from "./StockProductCreatorIdentitySection";
import { StockProductCreatorStockPricingSection } from "./StockProductCreatorStockPricingSection";
import { StockProductCreatorExtraVariantsSection } from "./StockProductCreatorExtraVariantsSection";
import { StockProductCreatorFooter } from "./StockProductCreatorFooter";
import { StockLivePreview } from "./StockLivePreview";

// Inner component — reads from context to control the Dialog open state
function StockProductCreatorInner() {
  const { isAddOpen, handleOpenChange, buyPrice, sellPrice, variantName, unitType } = useStockProductCreator();

  return (
    <Dialog open={isAddOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-[var(--stock-card-bg)] px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--stock-primary-bg)] text-[var(--stock-primary-text)] shadow-sm">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Quick Add Product</DialogTitle>
              <p className="text-xs text-[var(--stock-muted-text)] mt-0.5">
                5 fields · Unit auto-wires everything · Live preview before save
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            <StockProductCreatorNameField />
            <StockProductCreatorUnitField />
            <StockProductCreatorPriceFields />

            {/* Live preview — shown only when user has entered name or price */}
            {(buyPrice !== "" || sellPrice !== "") && (
              <StockLivePreview
                unitType={unitType}
                buyPrice={buyPrice !== "" ? Number(buyPrice) : 0}
                sellPrice={sellPrice !== "" ? Number(sellPrice) : 0}
                variantName={variantName}
              />
            )}

            <div className="space-y-5">
              <StockProductCreatorIdentitySection />
              <StockProductCreatorStockPricingSection />
              <StockProductCreatorExtraVariantsSection />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <StockProductCreatorFooter />
      </DialogContent>
    </Dialog>
  );
}

// Exported component — wraps inner with the creator context provider
export function StockProductCreator() {
  return (
    <StockProductCreatorProvider>
      <StockProductCreatorInner />
    </StockProductCreatorProvider>
  );
}
