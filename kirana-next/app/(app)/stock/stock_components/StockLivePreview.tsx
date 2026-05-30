"use client";

import React from "react";
import { CircleCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UNIT_CONFIG, MODE_LABEL } from "./StockConstants";
import { formatBaseUnits } from "./StockUtils";

export function StockLivePreview({
  unitType,
  buyPrice,
  sellPrice,
  variantName,
}: {
  unitType: string;
  buyPrice: number;
  sellPrice: number;
  variantName: string;
}) {
  const cfg = UNIT_CONFIG[unitType];
  if (!cfg) return null;

  const margin = buyPrice > 0 ? (((sellPrice - buyPrice) / buyPrice) * 100).toFixed(1) : null;
  const isLoss = sellPrice > 0 && buyPrice > 0 && sellPrice < buyPrice;
  const unit = unitType.toLowerCase();

  return (
    <div className={cn(
      "rounded-xl border p-4 space-y-3 transition-all",
      isLoss
        ? "bg-[var(--stock-preview-loss-bg)] border-[var(--stock-preview-loss-border)]"
        : "bg-[var(--stock-preview-neutral-bg)] border-[var(--stock-preview-neutral-border)]"
    )}>
      <div className="flex items-center gap-2">
        <CircleCheck className={cn("h-4 w-4 shrink-0", isLoss ? "text-[var(--stock-preview-loss-text)]" : "text-[var(--stock-preview-neutral-text)]")} />
        <p className={cn("text-xs font-bold uppercase tracking-wider", isLoss ? "text-[var(--stock-preview-loss-text)]" : "text-[var(--stock-preview-neutral-text)]")}>
          Live Preview — Jo save hoga
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Variant Name</p>
          <p className="font-semibold">{variantName || "—"}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Selling Mode</p>
          <p className="font-semibold">{MODE_LABEL[cfg.sellingMode]}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Conversion</p>
          <p className="font-semibold text-primary">
            1 {unit} = {formatBaseUnits(cfg.baseQuantity, cfg.baseUnit)}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Base Unit</p>
          <p className="font-semibold">{cfg.baseUnit}</p>
        </div>
      </div>

      {sellPrice > 0 && (
        <div className={cn(
          "flex items-center justify-between rounded-lg px-3 py-2 border",
          isLoss
            ? "bg-[var(--stock-preview-loss-bg)] border-[var(--stock-preview-loss-border)]"
            : "bg-[var(--stock-preview-ok-bg)] border-[var(--stock-preview-ok-border)]"
        )}>
          <span className="text-xs text-muted-foreground">
            Buy ₹{buyPrice} → Sell ₹{sellPrice}
          </span>
          {margin !== null && (
            <span className={cn(
              "text-xs font-bold",
              isLoss ? "text-[var(--stock-preview-loss-text)]" : "text-[var(--stock-preview-ok-text)]"
            )}>
              {isLoss ? "⚠️ Loss " : "↑ "}{margin}% margin
            </span>
          )}
        </div>
      )}

      {isLoss && (
        <div className="flex items-start gap-2 rounded-lg bg-[var(--stock-preview-loss-bg)] border border-[var(--stock-preview-loss-border)] px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 text-[var(--stock-preview-loss-text)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--stock-preview-loss-text)]">
            Sell price is less than buy price — you will make a loss on every sale.
          </p>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground italic">{cfg.description}</p>
    </div>
  );
}
