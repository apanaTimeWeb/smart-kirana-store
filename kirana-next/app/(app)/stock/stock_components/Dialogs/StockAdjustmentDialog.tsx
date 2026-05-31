"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStock } from "../../stock_context/StockContext";
import { PackageMinus, AlertTriangle, Clock, User, HelpCircle } from "lucide-react";
import { formatBaseUnits } from "../../stock_utils/StockUtils";

const REASONS = [
  { id: "Damage", label: "Kharab / Damage", icon: AlertTriangle },
  { id: "Expired", label: "Expire ho gaya", icon: Clock },
  { id: "Personal", label: "Ghar ke liye", icon: User },
  { id: "Missing", label: "Kho gaya", icon: HelpCircle },
];

export function StockAdjustmentDialog() {
  const { adjustingProduct: product, setAdjustingProduct, adjustStock, isAdjusting } = useStock();
  const open = Boolean(product);
  
  const [reduceQty, setReduceQty] = useState<number | "">("");
  const [reason, setReason] = useState<string>("Damage");

  useEffect(() => {
    if (open) {
      setReduceQty("");
      setReason("Damage");
    }
  }, [open]);

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) setAdjustingProduct(null);
  };

  if (!product) return null;

  const current = product.currentStock;
  const reduction = reduceQty !== "" ? Number(reduceQty) : 0;
  const newStock = Math.max(0, current - reduction);
  
  const handleSave = () => {
    if (reduction > 0 && reduction <= current) {
      adjustStock(product, reduction, reason);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[var(--stock-creator-body-bg)] border-[var(--stock-creator-input-border)] p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-5 pt-5 pb-4 border-b bg-[var(--stock-creator-header-bg)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <PackageMinus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[var(--stock-creator-header-title)]">
                Stock Minus Karein
              </DialogTitle>
              <p className="text-xs text-[var(--stock-creator-header-subtitle)] mt-0.5">
                {product.productName} ({product.variantName})
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 p-3 rounded-xl border bg-[var(--stock-card-bg)]">
              <p className="text-[10px] uppercase font-bold text-[var(--stock-muted-text)]">Current Stock</p>
              <p className="font-bold text-lg">{current} <span className="text-sm font-normal">{product.unit}</span></p>
            </div>
            <div className="space-y-1.5 p-3 rounded-xl border bg-orange-50 border-orange-200 text-orange-800">
              <p className="text-[10px] uppercase font-bold opacity-70">Naya Stock Hoga</p>
              <p className="font-bold text-lg">{newStock} <span className="text-sm font-normal">{product.unit}</span></p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--stock-creator-label-text)]">
              Kitna kam karna hai? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="number"
                value={reduceQty}
                onChange={(e) => setReduceQty(e.target.value !== "" ? Number(e.target.value) : "")}
                placeholder="0"
                className="h-12 pr-16 bg-[var(--stock-creator-input-bg)] border-[var(--stock-creator-input-border)] text-lg font-bold"
                autoFocus
              />
              <span className="absolute right-4 top-3.5 text-sm font-semibold text-[var(--stock-muted-text)]">
                {product.unit}
              </span>
            </div>
            {reduction > current && (
              <p className="text-xs text-red-500 mt-1">Current stock se zyada nahi hata sakte</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--stock-creator-label-text)]">
              Kyu kam kar rahe hain?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REASONS.map((r) => {
                const Icon = r.icon;
                const active = reason === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setReason(r.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                      active 
                        ? "bg-orange-100 border-orange-500 text-orange-900" 
                        : "bg-[var(--stock-card-bg)] border-[var(--stock-border)] text-[var(--stock-muted-text)] hover:bg-[var(--stock-muted-bg)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-semibold">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <Button
            className="w-full h-12 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base"
            onClick={handleSave}
            disabled={isAdjusting || reduction <= 0 || reduction > current}
          >
            {isAdjusting ? "Updating..." : "Stock Minus Karo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
