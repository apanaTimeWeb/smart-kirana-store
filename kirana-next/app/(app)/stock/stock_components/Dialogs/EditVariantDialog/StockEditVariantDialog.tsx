"use client";

// StockEditVariantDialog.tsx — Mobile-First Premium Dialog
// Matches the exact design of StockProductCreator.tsx.
// All colors come from var(--stock-creator-*) defined in stock.css.

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Plus, Package, Scale, Factory, CalendarDays,
  Bell, IndianRupee, Boxes, Zap, ChevronDown, ChevronUp, Star, Tag
} from "lucide-react";
import { StockEditVariantDialogProvider, useStockEditVariantDialog } from "../../../stock_context/StockEditVariantDialogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// ── Shared Field Label ────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1"
      style={{ color: "var(--stock-creator-label-text)" }}
    >
      {children}
      {required && (
        <span style={{ color: "var(--stock-creator-error-text)" }}>*</span>
      )}
    </label>
  );
}

// ── Shared Text Input ─────────────────────────────────────────────────────────

function FieldInput({ className, style, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn("h-12 text-base rounded-xl shadow-sm transition-all duration-150", className)}
      style={{
        backgroundColor: "var(--stock-creator-input-bg)",
        borderColor: "var(--stock-creator-input-border)",
        color: "var(--stock-foreground, var(--foreground))",
        ...style,
      }}
      {...props}
    />
  );
}

// ── Unit Tap Button ───────────────────────────────────────────────────────────

type UnitKey = "packet" | "khula" | "bora";

const UNIT_VARS: Record<UnitKey, Record<string, string>> = {
  packet: {
    activeBg:     "var(--stock-creator-unit-packet-active-bg)",
    activeBorder: "var(--stock-creator-unit-packet-active-border)",
    activeText:   "var(--stock-creator-unit-packet-active-text)",
    activeIcon:   "var(--stock-creator-unit-packet-active-icon)",
    dot:          "var(--stock-creator-unit-packet-dot)",
    inactiveBg:   "var(--stock-creator-unit-packet-inactive-bg)",
    inactiveBorder: "var(--stock-creator-unit-packet-inactive-border)",
    inactiveText: "var(--stock-creator-unit-packet-inactive-text)",
  },
  khula: {
    activeBg:     "var(--stock-creator-unit-khula-active-bg)",
    activeBorder: "var(--stock-creator-unit-khula-active-border)",
    activeText:   "var(--stock-creator-unit-khula-active-text)",
    activeIcon:   "var(--stock-creator-unit-khula-active-icon)",
    dot:          "var(--stock-creator-unit-khula-dot)",
    inactiveBg:   "var(--stock-creator-unit-packet-inactive-bg)",
    inactiveBorder: "var(--stock-creator-unit-packet-inactive-border)",
    inactiveText: "var(--stock-creator-unit-packet-inactive-text)",
  },
  bora: {
    activeBg:     "var(--stock-creator-unit-bora-active-bg)",
    activeBorder: "var(--stock-creator-unit-bora-active-border)",
    activeText:   "var(--stock-creator-unit-bora-active-text)",
    activeIcon:   "var(--stock-creator-unit-bora-active-icon)",
    dot:          "var(--stock-creator-unit-bora-dot)",
    inactiveBg:   "var(--stock-creator-unit-packet-inactive-bg)",
    inactiveBorder: "var(--stock-creator-unit-packet-inactive-border)",
    inactiveText: "var(--stock-creator-unit-packet-inactive-text)",
  },
};

function UnitButton({
  active, onClick, icon, label, sublabel, unitKey,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  unitKey: UnitKey;
}) {
  const v = UNIT_VARS[unitKey];
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-1.5 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 w-full shadow-sm hover:shadow-md active:scale-[0.97]"
      style={{
        backgroundColor: active ? v.activeBg : v.inactiveBg,
        borderColor:     active ? v.activeBorder : v.inactiveBorder,
        color:           active ? v.activeText : v.inactiveText,
      }}
    >
      {/* Selection dot */}
      {active && (
        <div
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: v.dot }}
        />
      )}
      {/* Icon */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
        style={{ backgroundColor: active ? v.activeIcon : "transparent" }}
      >
        {icon}
      </div>
      <span className="text-xs font-bold leading-tight">{label}</span>
      <span className="text-[10px] leading-none opacity-60">{sublabel}</span>
    </button>
  );
}

// ── Main Inner Form ───────────────────────────────────────────────────────────

function StockEditVariantDialogInner() {
  const {
    product, draft, patchDraft, handleUnitChange,
    bulkConversionRate, handleBulkConversionChange,
    buyPrice, sellPrice, isLoss, margin, errors, isValid,
    isUpdating, handleSave: submitChanges, closeDialog
  } = useStockEditVariantDialog();

  const [showOptional, setShowOptional] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  if (!product || !draft) return null;

  const onSaveClick = () => {
    setHasAttempted(true);
    if (isValid) submitChanges();
  };

  const name = draft.productName ?? "";
  const setName = (val: string) => patchDraft({ productName: val });

  const unitType = draft.unitType;
  const setBuyPrice = (val: number | "") => patchDraft({ purchasePrice: val === "" ? 0 : val });
  const setSellPrice = (val: number | "") => patchDraft({ sellingPrice: val === "" ? 0 : val });

  const initialStock = draft.stockInBaseUnit / draft.baseQuantity;
  const setInitialStock = (val: number | "") => patchDraft({ stockInBaseUnit: (val === "" ? 0 : val) * draft.baseQuantity });

  const expiryDate = draft.expiryDate;
  const setExpiryDate = (val: string) => patchDraft({ expiryDate: val });

  const lowStockAlert = draft.lowStockThresholdInBaseUnit / draft.baseQuantity;
  const setLowStockAlert = (val: number | "") => patchDraft({ lowStockThresholdInBaseUnit: (val === "" ? 0 : val) * draft.baseQuantity });

  const mrp = draft.mrp === 0 && !draft.mrp ? "" : draft.mrp;
  const setMrp = (val: number | "") => patchDraft({ mrp: val === "" ? 0 : val });

  const fastBilling = draft.quickSelect;
  const setFastBilling = (val: boolean) => patchDraft({ quickSelect: val });

  const isProfit = margin !== null && Number(margin) > 0;
  const stockLabel = unitType === "BORA" ? "Bora" : unitType === "KG" ? "KG" : "Pcs";

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => { if (!open) closeDialog(); }}>
      <DialogContent
        className="w-full max-w-lg p-0 gap-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border max-h-[92dvh] sm:max-h-[88vh] flex flex-col"
        style={{
          backgroundColor: "var(--stock-creator-body-bg)",
          borderColor: "var(--stock-creator-input-border)",
        }}
      >
        {/* ── Drag Handle (mobile only) ── */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "var(--stock-creator-input-border)" }}
          />
        </div>

        {/* ── Header ── */}
        <DialogHeader
          className="px-5 sm:px-6 pt-2 sm:pt-5 pb-4 shrink-0 border-b"
          style={{
            backgroundColor: "var(--stock-creator-header-bg)",
            borderColor: "var(--stock-creator-footer-border)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Gradient icon — teal brand */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-md"
              style={{
                background: `linear-gradient(135deg, var(--stock-creator-header-icon-from), var(--stock-creator-header-icon-to))`,
              }}
            >
              <Package className="h-5 w-5" style={{ color: "var(--stock-creator-save-btn-text)" }} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <DialogTitle
                className="text-lg font-bold"
                style={{ color: "var(--stock-creator-header-title)" }}
              >
                Edit Pack / Size
              </DialogTitle>
              <p className="text-xs mt-0.5 truncate" style={{ color: "var(--stock-creator-header-subtitle)" }}>
                {product.productName} ki details update karein
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-5 sm:p-6 space-y-5">

            {/* 1. Size Name */}
            <div className="space-y-2">
              <FieldLabel required>Saman Ka Naam</FieldLabel>
              <FieldInput
                placeholder="e.g. Maggi 70g, Aashirvaad Atta 5kg…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            {/* 2. Unit Type — 3 Tap Buttons */}
            <div className="space-y-2">
              <FieldLabel required>Kaisa Bikta Hai?</FieldLabel>
              <div className="grid grid-cols-3 gap-2.5">
                <UnitButton
                  active={unitType === "PACKET"}
                  onClick={() => handleUnitChange("PACKET")}
                  icon={<Package className="h-5 w-5" />}
                  label="Packet"
                  sublabel="Piece / Fixed"
                  unitKey="packet"
                />
                <UnitButton
                  active={unitType === "KG"}
                  onClick={() => handleUnitChange("KG")}
                  icon={<Scale className="h-5 w-5" />}
                  label="Khula"
                  sublabel="KG / Litre"
                  unitKey="khula"
                />
                <UnitButton
                  active={unitType === "BORA"}
                  onClick={() => handleUnitChange("BORA")}
                  icon={<Factory className="h-5 w-5" />}
                  label="Bora / Bulk"
                  sublabel="Wholesale"
                  unitKey="bora"
                />
              </div>
            </div>

            {/* 2b. Bora Conversion Box (conditional) */}
            {unitType === "BORA" && (
              <div
                className="rounded-2xl border p-4 space-y-3 animate-in slide-in-from-top-2 duration-200"
                style={{
                  backgroundColor: "var(--stock-creator-bora-box-bg)",
                  borderColor:     "var(--stock-creator-bora-box-border)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5"
                    style={{
                      backgroundColor: "var(--stock-creator-bora-icon-bg)",
                      color:           "var(--stock-creator-bora-icon-text)",
                    }}
                  >
                    <Factory className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--stock-creator-bora-box-title)" }}>
                      Bora me kitna maal hai?
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--stock-creator-bora-box-text)" }}>
                      System isko grams me convert karke exact stock track karega
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FieldInput
                    type="number"
                    placeholder="50"
                    value={bulkConversionRate}
                    onChange={(e) => handleBulkConversionChange(e.target.value !== "" ? Number(e.target.value) : "")}
                    style={{
                      borderColor:     "var(--stock-creator-bora-box-border)",
                      backgroundColor: "var(--stock-creator-input-bg)",
                    }}
                  />
                  <div
                    className="shrink-0 px-3 py-2.5 rounded-xl text-sm font-bold"
                    style={{
                      backgroundColor: "var(--stock-creator-bora-unit-bg)",
                      color:           "var(--stock-creator-bora-unit-text)",
                    }}
                  >
                     KG / Piece
                  </div>
                </div>
              </div>
            )}

            {/* 3. Buy & Sell Rate */}
            <div className="space-y-2">
              <FieldLabel>Rate (Buy &amp; Sell)</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                {/* Buy Price */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--stock-creator-label-text)" }}>
                    Kharid (Buy)
                  </p>
                  <div className="relative">
                    <IndianRupee
                      className="absolute left-3 top-3.5 h-4 w-4 pointer-events-none"
                      style={{ color: "var(--stock-creator-label-text)" }}
                    />
                    <FieldInput
                      type="number"
                      placeholder="0"
                      value={buyPrice === 0 ? "" : buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                      className="pl-8"
                    />
                  </div>
                </div>
                {/* Sell Price — highlighted */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1" style={{ color: "var(--stock-creator-label-text)" }}>
                    Bikri (Sell) <span style={{ color: "var(--stock-creator-error-text)" }}>*</span>
                  </p>
                  <div className="relative">
                    <IndianRupee
                      className="absolute left-3 top-3.5 h-4 w-4 pointer-events-none"
                      style={{ color: "var(--stock-creator-label-text)" }}
                    />
                    <FieldInput
                      type="number"
                      placeholder="0"
                      value={sellPrice === 0 ? "" : sellPrice}
                      onChange={(e) => setSellPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                      className="pl-8"
                      style={{
                        borderColor:     "var(--stock-creator-sell-input-border)",
                        backgroundColor: "var(--stock-creator-sell-input-bg)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Live Margin Badge */}
              {margin !== null && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border animate-in fade-in duration-300"
                  style={{
                    backgroundColor: isProfit
                      ? "var(--stock-creator-margin-profit-bg)"
                      : isLoss
                        ? "var(--stock-creator-margin-loss-bg)"
                        : "var(--stock-creator-body-bg)",
                    borderColor: isProfit
                      ? "var(--stock-creator-margin-profit-border)"
                      : isLoss
                        ? "var(--stock-creator-margin-loss-border)"
                        : "var(--stock-creator-input-border)",
                    color: isProfit
                      ? "var(--stock-creator-margin-profit-text)"
                      : isLoss
                        ? "var(--stock-creator-margin-loss-text)"
                        : "var(--stock-creator-label-text)",
                  }}
                >
                  <span>{isProfit ? "📈" : isLoss ? "📉" : "—"}</span>
                  <span>Margin: {margin}%</span>
                  {isProfit && (
                    <span className="ml-auto">
                      Profit ₹{(Number(sellPrice) - Number(buyPrice)).toFixed(0)}/unit
                    </span>
                  )}
                  {isLoss && <span className="ml-auto">Loss! Buy price zyada hai</span>}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed" style={{ borderColor: "var(--stock-creator-input-border)" }} />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-3 text-[11px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: "var(--stock-creator-body-bg)",
                    color: "var(--stock-creator-divider-text)",
                  }}
                >
                  Stock &amp; Expiry
                </span>
              </div>
            </div>

            {/* 4. Stock & Expiry */}
            <div className="grid grid-cols-2 gap-3">
              {/* Current Stock */}
              <div className="space-y-1.5">
                <p
                  className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1"
                  style={{ color: "var(--stock-creator-label-text)" }}
                >
                  <Boxes className="h-3 w-3" /> Stock
                  <span style={{ color: "var(--stock-creator-error-text)" }}>*</span>
                </p>
                <div className="relative">
                  <FieldInput
                    type="number"
                    placeholder="0"
                    value={initialStock}
                    onChange={(e) => setInitialStock(e.target.value !== "" ? Number(e.target.value) : "")}
                    className="pr-14 font-bold"
                  />
                  <span
                    className="absolute right-3 top-3.5 text-xs font-semibold"
                    style={{ color: "var(--stock-creator-label-text)" }}
                  >
                    {stockLabel}
                  </span>
                </div>
              </div>
              {/* Expiry Date */}
              <div className="space-y-1.5">
                <p
                  className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1"
                  style={{ color: "var(--stock-creator-label-text)" }}
                >
                  <CalendarDays className="h-3 w-3" /> Expiry
                  <span className="normal-case font-normal ml-1" style={{ color: "var(--stock-creator-divider-text)" }}>(optional)</span>
                </p>
                <div className="relative">
                  <FieldInput
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="pl-9 text-sm [color-scheme:light] dark:[color-scheme:dark]"
                  />
                  <CalendarDays
                    className="absolute left-3 top-3.5 h-4 w-4 pointer-events-none"
                    style={{ color: "var(--stock-creator-label-text)" }}
                  />
                </div>
                <p className="text-[10px]" style={{ color: "var(--stock-creator-divider-text)" }}>
                  Food items ke liye zaroori • Pen, Bucket pe skip
                </p>
              </div>
            </div>

            {/* 5. Optional Collapsible Section */}
            <div
              className="rounded-2xl border border-dashed overflow-hidden"
              style={{ borderColor: "var(--stock-creator-optional-border)" }}
            >
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                style={{ color: "var(--stock-creator-optional-header-text)" }}
              >
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Plus className="h-3 w-3" />
                  Extra Jankari (Optional)
                </span>
                {showOptional
                  ? <ChevronUp className="h-4 w-4" />
                  : <ChevronDown className="h-4 w-4" />
                }
              </button>

              {showOptional && (
                <div
                  className="px-4 pb-4 pt-1 space-y-4 animate-in slide-in-from-top-2 duration-200"
                  style={{ backgroundColor: "var(--stock-creator-optional-body-bg)" }}
                >
                  {/* Low Stock Alert */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: "var(--stock-creator-label-text)" }}>
                      <Bell className="h-3 w-3" /> Low Stock Alert
                    </p>
                    <div className="flex items-center gap-3">
                      <FieldInput
                        type="number"
                        placeholder="5"
                        value={lowStockAlert}
                        onChange={(e) => setLowStockAlert(e.target.value !== "" ? Number(e.target.value) : "")}
                        className="w-28"
                      />
                      <p className="text-xs leading-snug" style={{ color: "var(--stock-creator-label-text)" }}>
                        Jab stock is limit se<br />neeche aaye, alert milega.
                      </p>
                    </div>
                  </div>

                  {/* MRP */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: "var(--stock-creator-label-text)" }}>
                      <Tag className="h-3 w-3" /> MRP ₹
                    </p>
                    <div className="relative">
                      <IndianRupee
                        className="absolute left-3 top-3.5 h-4 w-4 pointer-events-none"
                        style={{ color: "var(--stock-creator-label-text)" }}
                      />
                      <FieldInput
                        type="number"
                        placeholder="0"
                        value={mrp}
                        onChange={(e) => setMrp(e.target.value !== "" ? Number(e.target.value) : "")}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {/* Quick Select Checkbox */}
                  <div className="space-y-1.5 pt-1">
                    <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl border border-dashed hover:bg-[var(--stock-creator-input-bg)] transition-colors">
                      <Checkbox
                        checked={fastBilling}
                        onCheckedChange={(checked) => setFastBilling(Boolean(checked))}
                        className="mt-0.5"
                      />
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:text-primary transition-colors">
                          <Star className="h-3 w-3 text-amber-500" />
                          Fast Billing Me Dikhaye
                        </p>
                        <p className="text-[10px] leading-snug" style={{ color: "var(--stock-creator-label-text)" }}>
                          Pin this variant to the Quick-Select panel on the billing screen for 2-click checkout.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="h-1" />
          </div>
        </div>

        {/* ── Sticky Footer ── */}
        <div
          className="shrink-0 border-t px-5 sm:px-6 py-4 space-y-3"
          style={{
            backgroundColor: "var(--stock-creator-footer-bg)",
            borderColor:     "var(--stock-creator-footer-border)",
          }}
        >
          {/* Validation errors — only shown after first save attempt */}
          {hasAttempted && !isValid && errors.length > 0 && (
            <div
              className="rounded-xl border px-3.5 py-2.5 space-y-1.5 animate-in fade-in slide-in-from-bottom-1 duration-200"
              style={{
                backgroundColor: "var(--stock-creator-error-bg)",
                borderColor:     "var(--stock-creator-error-border)",
              }}
            >
              {errors.map((err, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--stock-creator-error-text)" }}>
                  <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--stock-creator-error-dot)" }} />
                  {err}
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <Button
            className="w-full h-12 rounded-2xl text-base font-bold shadow-lg transition-all duration-200 active:scale-[0.98] border-0"
            style={{
              backgroundColor: isUpdating
                ? "var(--stock-creator-save-btn-disabled-bg)"
                : "var(--stock-creator-save-btn-bg)",
              color: isUpdating
                ? "var(--stock-creator-save-btn-disabled-text)"
                : "var(--stock-creator-save-btn-text)",
            }}
            disabled={isUpdating}
            onClick={onSaveClick}
          >
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "var(--stock-creator-save-btn-disabled-text)", borderTopColor: "transparent" }}
                />
                Updating…
              </span>
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Exported component — wraps inner with the edit dialog context provider
export function StockEditVariantDialog() {
  return (
    <StockEditVariantDialogProvider>
      <StockEditVariantDialogInner />
    </StockEditVariantDialogProvider>
  );
}
