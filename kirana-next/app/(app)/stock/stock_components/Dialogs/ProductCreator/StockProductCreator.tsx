"use client";

// StockProductCreator.tsx — Premium Mobile-First Redesign
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Plus, Package, Scale, Factory, Barcode, CalendarDays,
  MapPin, Bell, IndianRupee, Boxes, Zap, ChevronDown, ChevronUp
} from "lucide-react";
import { StockProductCreatorProvider, useStockProductCreator } from "../../../stock_context/StockProductCreatorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ── Reusable sub-components ───────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1">
      {children}
      {required && <span className="text-rose-500 text-sm leading-none">*</span>}
    </Label>
  );
}

function FieldInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-12 text-base rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
        "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 focus-visible:border-indigo-400",
        "transition-all duration-150 placeholder:text-slate-300 dark:placeholder:text-slate-600",
        "shadow-sm",
        className
      )}
      {...props}
    />
  );
}

type UnitBtnProps = {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: "indigo" | "amber" | "purple";
};

const colorMap = {
  indigo: {
    active: "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-indigo-100 dark:shadow-indigo-900/20",
    inactive: "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50",
    icon: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
    check: "bg-indigo-500",
  },
  amber: {
    active: "border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-amber-100 dark:shadow-amber-900/20",
    inactive: "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-amber-300 hover:bg-amber-50/50",
    icon: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
    check: "bg-amber-500",
  },
  purple: {
    active: "border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 shadow-purple-100 dark:shadow-purple-900/20",
    inactive: "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-purple-300 hover:bg-purple-50/50",
    icon: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
    check: "bg-purple-500",
  },
};

function UnitButton({ active, onClick, icon, label, sublabel, color }: UnitBtnProps) {
  const c = colorMap[color];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1.5 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 w-full",
        "shadow-sm hover:shadow-md active:scale-[0.97]",
        active ? `${c.active} shadow-md` : c.inactive
      )}
    >
      {active && (
        <div className={cn("absolute top-2 right-2 w-2 h-2 rounded-full", c.check)} />
      )}
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-colors", c.icon)}>
        {icon}
      </div>
      <span className="text-xs font-bold leading-tight">{label}</span>
      <span className="text-[10px] leading-none opacity-60">{sublabel}</span>
    </button>
  );
}

// ── Main inner component ──────────────────────────────────────────────────────

function StockProductCreatorInner() {
  const {
    isAddOpen, handleOpenChange, isCreating,
    name, setName,
    barcode, setBarcode,
    unitType, handleUnitChange,
    bulkConversionRate, setBulkConversionRate,
    buyPrice, setBuyPrice,
    sellPrice, setSellPrice,
    initialStock, setInitialStock,
    expiryDate, setExpiryDate,
    location, setLocation,
    lowStockAlert, setLowStockAlert,
    errors, isValid, handleSubmit
  } = useStockProductCreator();

  const [showOptional, setShowOptional] = useState(false);

  const margin = buyPrice !== "" && sellPrice !== "" && Number(sellPrice) > 0
    ? (((Number(sellPrice) - Number(buyPrice)) / Number(sellPrice)) * 100).toFixed(1)
    : null;

  const isProfit = margin !== null && Number(margin) > 0;
  const isLoss   = margin !== null && Number(margin) < 0;

  return (
    <Dialog open={isAddOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "w-full max-w-lg p-0 gap-0 overflow-hidden",
          "rounded-2xl sm:rounded-3xl",
          "bg-slate-50 dark:bg-slate-900",
          "border-0 sm:border border-slate-200 dark:border-slate-700",
          "shadow-2xl shadow-black/20 dark:shadow-black/60",
          "max-h-[92dvh] sm:max-h-[88vh] flex flex-col",
        )}
      >
        {/* ── Drag Handle (mobile) ── */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* ── Header ── */}
        <DialogHeader className="px-5 sm:px-6 pt-2 sm:pt-5 pb-4 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">Naya Product</DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Naam, daam, maal — done in seconds</p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-5 sm:p-6 space-y-5">

            {/* 1. Product Name */}
            <div className="space-y-2">
              <FieldLabel required>Product Ka Naam</FieldLabel>
              <FieldInput
                placeholder="e.g. Maggi 70g, Aashirvaad Atta 5kg…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            {/* 2. Unit Type — Tap Buttons */}
            <div className="space-y-2">
              <FieldLabel required>Kaisa Bikta Hai?</FieldLabel>
              <div className="grid grid-cols-3 gap-2.5">
                <UnitButton
                  active={unitType === "PACKET"}
                  onClick={() => handleUnitChange("PACKET")}
                  icon={<Package className="h-5 w-5" />}
                  label="Packet"
                  sublabel="Piece / Fixed"
                  color="indigo"
                />
                <UnitButton
                  active={unitType === "KG"}
                  onClick={() => handleUnitChange("KG")}
                  icon={<Scale className="h-5 w-5" />}
                  label="Khula"
                  sublabel="KG / Litre"
                  color="amber"
                />
                <UnitButton
                  active={unitType === "BORA"}
                  onClick={() => handleUnitChange("BORA")}
                  icon={<Factory className="h-5 w-5" />}
                  label="Bora / Bulk"
                  sublabel="Wholesale"
                  color="purple"
                />
              </div>
            </div>

            {/* 2b. Bulk Conversion (conditional) */}
            {unitType === "BORA" && (
              <div className="rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mt-0.5">
                    <Factory className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-purple-800 dark:text-purple-200">Bora me kitna maal hai?</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">System isko grams me convert karke exact stock track karega</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FieldInput
                    type="number"
                    placeholder="50"
                    value={bulkConversionRate}
                    onChange={(e) => setBulkConversionRate(e.target.value !== "" ? Number(e.target.value) : "")}
                    className="border-purple-200 dark:border-purple-700 focus-visible:ring-purple-500 bg-white dark:bg-slate-900"
                  />
                  <div className="shrink-0 px-3 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-sm font-bold text-purple-700 dark:text-purple-300">
                    KG / Piece
                  </div>
                </div>
              </div>
            )}

            {/* 3. Rates */}
            <div className="space-y-2">
              <FieldLabel>Rate (Buy & Sell)</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                {/* Buy */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Kharid (Buy)</p>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <FieldInput
                      type="number"
                      placeholder="0"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                      className="pl-8"
                    />
                  </div>
                </div>
                {/* Sell */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    Bikri (Sell) <span className="text-rose-400">*</span>
                  </p>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <FieldInput
                      type="number"
                      placeholder="0"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                      className="pl-8 border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
              {/* Live Margin Badge */}
              {margin !== null && (
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all animate-in fade-in duration-300",
                  isLoss  && "bg-rose-50  dark:bg-rose-950/40  text-rose-600  dark:text-rose-400  border border-rose-200  dark:border-rose-800",
                  isProfit && "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
                )}>
                  <span>{isProfit ? "📈" : isLoss ? "📉" : "—"}</span>
                  <span>Margin: {margin}%</span>
                  {isProfit && <span className="ml-auto text-emerald-600 dark:text-emerald-400">Profit ₹{(Number(sellPrice) - Number(buyPrice)).toFixed(0)}/unit</span>}
                  {isLoss  && <span className="ml-auto text-rose-500">Loss! Buy price zyada hai</span>}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-slate-50 dark:bg-slate-900 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Stock & Expiry</span>
              </div>
            </div>

            {/* 4. Stock & Expiry */}
            <div className="grid grid-cols-2 gap-3">
              {/* Current Stock */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Boxes className="h-3 w-3" /> Stock <span className="text-rose-400">*</span>
                </p>
                <div className="relative">
                  <FieldInput
                    type="number"
                    placeholder="0"
                    value={initialStock}
                    onChange={(e) => setInitialStock(e.target.value !== "" ? Number(e.target.value) : "")}
                    className="pr-16 font-bold text-slate-800 dark:text-slate-100"
                  />
                  <span className="absolute right-3 top-3.5 text-xs font-semibold text-slate-400">
                    {unitType === "BORA" ? "Bora" : unitType === "KG" ? "KG" : "Pcs"}
                  </span>
                </div>
              </div>
              {/* Expiry */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> Expiry <span className="text-rose-400">*</span>
                </p>
                <div className="relative">
                  <FieldInput
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="pl-9 text-sm [color-scheme:light] dark:[color-scheme:dark]"
                  />
                  <CalendarDays className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 5. Optional Section — Collapsible */}
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Plus className="h-3 w-3" />
                  Extra Jankari (Optional)
                </span>
                {showOptional ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {showOptional && (
                <div className="px-4 pb-4 pt-1 space-y-4 bg-white dark:bg-slate-800/30 animate-in slide-in-from-top-2 duration-200">
                  {/* Barcode */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Barcode className="h-3 w-3" /> Barcode
                    </p>
                    <div className="relative">
                      <FieldInput
                        placeholder="Scan karein ya manually type karein…"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="pl-9"
                      />
                      <Barcode className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> Dukan me Kahan Hai?
                    </p>
                    <div className="relative">
                      <FieldInput
                        placeholder="e.g. Fridge ke paas, Rack 3, Godown…"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-9"
                      />
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Low Stock Alert */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
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
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                        Jab stock is limit se<br />neeche aaye, alert milega.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom breathing room */}
            <div className="h-1" />
          </div>
        </div>

        {/* ── Sticky Footer ── */}
        <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 sm:px-6 py-4 space-y-3">
          {/* Validation errors */}
          {!isValid && errors.length > 0 && (
            <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 space-y-1">
              {errors.map((err, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                  {err}
                </div>
              ))}
            </div>
          )}

          <Button
            className={cn(
              "w-full h-12 rounded-2xl text-base font-bold shadow-lg transition-all duration-200",
              isValid
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-200 dark:shadow-indigo-900/50 text-white active:scale-[0.98]"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 shadow-none cursor-not-allowed"
            )}
            disabled={!isValid || isCreating}
            onClick={handleSubmit}
          >
            {isCreating ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Product Save Karo
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function StockProductCreator() {
  return (
    <StockProductCreatorProvider>
      <StockProductCreatorInner />
    </StockProductCreatorProvider>
  );
}
