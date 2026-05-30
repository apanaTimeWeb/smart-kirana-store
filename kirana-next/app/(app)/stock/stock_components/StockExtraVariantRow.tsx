"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { UnitType } from "@/lib/api";
import { VariantDraft } from "./StockTypes";
import { StockUnitSelector } from "./StockUnitSelector";
import { UNIT_CONFIG, MODE_LABEL } from "./StockConstants";
import { formatBaseUnits, numberValue, defaultPresetsFor } from "./StockUtils";

export function StockExtraVariantRow({
  variant,
  index,
  onUpdate,
  onRemove,
}: {
  variant: VariantDraft;
  index: number;
  onUpdate: (patch: Partial<VariantDraft>) => void;
  onRemove: () => void;
}) {
  const cfg = UNIT_CONFIG[variant.unitType] ?? null;

  const handleUnitChange = (unitType: string) => {
    const c = UNIT_CONFIG[unitType];
    if (!c) return;
    onUpdate({
      unitType: unitType as UnitType,
      baseUnit: c.baseUnit,
      baseQuantity: c.baseQuantity,
      sellingMode: c.sellingMode,
      variantName: c.variantNameSuggestion,
      presetBaseQuantities: defaultPresetsFor(c.baseUnit),
    });
  };

  return (
    <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">Extra Pack {index + 1}</Badge>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-destructive hover:bg-destructive/10"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Variant Name
          </label>
          <Input
            value={variant.variantName}
            onChange={(e) => onUpdate({ variantName: e.target.value })}
            placeholder="e.g. 500g Packet"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Unit
          </label>
          <StockUnitSelector
            value={variant.unitType}
            onChange={handleUnitChange}
            triggerClassName="h-9 text-sm px-3"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Buy Price ₹
          </label>
          <Input
            type="number"
            min={0}
            value={variant.purchasePrice || ""}
            onChange={(e) => onUpdate({ purchasePrice: numberValue(e.target.value) })}
            placeholder="0"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Sell Price ₹
          </label>
          <Input
            type="number"
            min={0}
            value={variant.sellingPrice || ""}
            onChange={(e) => onUpdate({ sellingPrice: numberValue(e.target.value) })}
            placeholder="0"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Stock
          </label>
          <Input
            type="number"
            value={variant.stockInBaseUnit / (cfg?.baseQuantity || 1)}
            onChange={(e) => onUpdate({ stockInBaseUnit: numberValue(e.target.value) * (cfg?.baseQuantity || 1) })}
            placeholder="0"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Low Stock Alert
          </label>
          <Input
            type="number"
            value={variant.lowStockThresholdInBaseUnit / (cfg?.baseQuantity || 1)}
            onChange={(e) => onUpdate({ lowStockThresholdInBaseUnit: numberValue(e.target.value) * (cfg?.baseQuantity || 1) })}
            placeholder="5"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            MRP ₹
          </label>
          <Input
            type="number"
            min={0}
            value={variant.mrp || ""}
            onChange={(e) => onUpdate({ mrp: numberValue(e.target.value) })}
            placeholder="0"
            className="h-9 text-sm"
          />
        </div>
      </div>

      {cfg && (
        <p className="text-[11px] text-muted-foreground bg-background rounded px-2 py-1 border">
          📐 1 {variant.unitType.toLowerCase()} = {formatBaseUnits(cfg.baseQuantity, cfg.baseUnit)} · Mode: {MODE_LABEL[cfg.sellingMode]}
        </p>
      )}
    </div>
  );
}
