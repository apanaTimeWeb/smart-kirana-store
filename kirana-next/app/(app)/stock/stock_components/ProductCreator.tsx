"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  IndianRupee,
  Info,
  Package,
  Plus,
  Scale,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductDraft, VariantDraft } from "./types";
import {
  BASE_UNITS,
  UNITS,
  MODE_LABEL,
  defaultBaseQuantity,
  defaultBaseUnit,
  defaultPresetsFor,
  emptyDraft,
  formatBaseUnits,
  numberValue,
  uid,
  variantDraft,
  buildTemplate,
  toInput,
  UNIT_CONFIG,
  UNIT_GROUPS
} from "./utils";
import { BaseUnit, SellingMode, UnitType } from "@/lib/api";

// ─── Sub-component: Live Preview Card ───────────────────────────────────────
function LivePreview({
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

// ─── Sub-component: Additional Variant Row ───────────────────────────────────
function ExtraVariantRow({
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
          <Select value={variant.unitType} onValueChange={handleUnitChange}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {UNIT_GROUPS.map((g) => (
                <React.Fragment key={g.group}>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {g.label}
                  </div>
                  {g.units.map((u) => (
                    <SelectItem key={u} value={u} className="text-sm pl-4">
                      {UNIT_CONFIG[u]?.label ?? u}
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
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

// ─── Main Component ──────────────────────────────────────────────────────────
export function ProductCreator({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: ProductDraft) => void;
  isPending: boolean;
}) {
  // ── Core quick fields ────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [unitType, setUnitType] = useState<string>("KG");
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");

  // ── Advanced fields ──────────────────────────────────────────────────────
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [category, setCategory] = useState("General");
  const [brand, setBrand] = useState("");
  const [keywords, setKeywords] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [mrp, setMrp] = useState<number | "">("");
  const [initialStock, setInitialStock] = useState<number | "">("");
  const [lowStockAlert, setLowStockAlert] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quickSelect, setQuickSelect] = useState(false);

  // ── Extra variants (advanced) ────────────────────────────────────────────
  const [extraVariants, setExtraVariants] = useState<VariantDraft[]>([]);

  // ── Derived from unitType ────────────────────────────────────────────────
  const cfg = UNIT_CONFIG[unitType];

  // Suggested variant name auto-updates when unit changes
  const [variantNameOverride, setVariantNameOverride] = useState<string | null>(null);
  const variantName = variantNameOverride ?? cfg?.variantNameSuggestion ?? unitType;

  const handleUnitChange = (newUnit: string) => {
    setUnitType(newUnit);
    setVariantNameOverride(null); // reset override so suggestion updates
    // Auto-reset low stock alert to sensible default for new unit
    setLowStockAlert("");
  };

  // Computed: smart default for low stock alert based on unit
  const defaultLowStockAlert = useMemo(() => {
    if (!cfg) return 5;
    // For khula items: 5 units in display (e.g. 5 kg = 5000g)
    // For fixed/wholesale: 5 units
    return 5;
  }, [cfg]);

  // Computed: low stock threshold in base units
  const lowStockInBase = useMemo(() => {
    const threshold = lowStockAlert !== "" ? Number(lowStockAlert) : defaultLowStockAlert;
    return threshold * (cfg?.baseQuantity ?? 1);
  }, [lowStockAlert, defaultLowStockAlert, cfg]);

  // Computed: initial stock in base units
  const stockInBase = useMemo(() => {
    const qty = initialStock !== "" ? Number(initialStock) : 0;
    return qty * (cfg?.baseQuantity ?? 1);
  }, [initialStock, cfg]);

  // ── Validation ───────────────────────────────────────────────────────────
  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Product name required");
    if (sellPrice === "" || Number(sellPrice) <= 0) errs.push("Sell price must be > 0");
    return errs;
  }, [name, sellPrice]);

  const isValid = errors.length === 0;

  // ── Extra variant handlers ────────────────────────────────────────────────
  const addExtraVariant = () => {
    const newV = variantDraft({ variantName: "New Pack", sellingMode: "fixed", unitType: "PACKET" });
    setExtraVariants((prev) => [...prev, newV]);
    setShowAdvanced(true);
  };

  const updateExtraVariant = (rowId: string, patch: Partial<VariantDraft>) => {
    setExtraVariants((prev) =>
      prev.map((v) => (v.rowId === rowId ? { ...v, ...patch } : v))
    );
  };

  const removeExtraVariant = (rowId: string) => {
    setExtraVariants((prev) => prev.filter((v) => v.rowId !== rowId));
  };

  // ── Reset ────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setName("");
    setUnitType("KG");
    setBuyPrice("");
    setSellPrice("");
    setShowAdvanced(false);
    setCategory("General");
    setBrand("");
    setKeywords("");
    setShortcut("");
    setMrp("");
    setInitialStock("");
    setLowStockAlert("");
    setExpiryDate("");
    setQuickSelect(false);
    setExtraVariants([]);
    setVariantNameOverride(null);
  }, []);

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!isValid || !cfg) return;

    const primaryVariant: VariantDraft = {
      rowId: uid(),
      variantName: variantName.trim() || cfg.variantNameSuggestion,
      unitType: unitType as UnitType,
      baseUnit: cfg.baseUnit,
      baseQuantity: cfg.baseQuantity,
      sellingMode: cfg.sellingMode,
      mrp: mrp !== "" ? Number(mrp) : 0,
      purchasePrice: buyPrice !== "" ? Number(buyPrice) : 0,
      sellingPrice: Number(sellPrice),
      quickSelect,
      expiryDate: expiryDate || "",
      stockInBaseUnit: stockInBase,
      lowStockThresholdInBaseUnit: lowStockInBase,
      presetBaseQuantities: defaultPresetsFor(cfg.baseUnit),
    };

    const draft: ProductDraft = {
      name: name.trim(),
      category: category.trim() || "General",
      brand: brand.trim(),
      keywords: keywords.trim(),
      shortcut: shortcut.trim(),
      sellingTypes: {
        khula: cfg.sellingMode === "khula",
        fixed: cfg.sellingMode === "fixed" || cfg.sellingMode === "variant",
        multiple: cfg.sellingMode === "wholesale",
      },
      variants: [primaryVariant, ...extraVariants],
    };

    onSubmit(draft);
    reset();
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) reset();
    onOpenChange(val);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-card px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Quick Add Product</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                5 fields · Unit auto-wires everything · Live preview before save
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">

            {/* ── Field 1: Product Name ─────────────────────────────────── */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                Product Name
                <span className="text-destructive">*</span>
              </label>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tata Salt, Fortune Mustard Oil, Parle-G..."
                className="h-12 text-base font-medium"
                onKeyDown={(e) => e.key === "Enter" && isValid && handleSubmit()}
              />
              {name.trim().length > 0 && name.trim().length < 2 && (
                <p className="text-xs text-destructive">Name too short</p>
              )}
            </div>

            {/* ── Field 2: Unit (the most important field) ─────────────── */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                How is it measured / sold?
                <span className="text-destructive">*</span>
              </label>
              <p className="text-xs text-muted-foreground">
                ⚡ Select unit → selling mode, base unit, and conversions are auto-set. No manual math.
              </p>

              <Select value={unitType} onValueChange={handleUnitChange}>
                <SelectTrigger className="h-12 text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {UNIT_GROUPS.map((g) => (
                    <React.Fragment key={g.group}>
                      <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b">
                        {g.label}
                      </div>
                      {g.units.map((u) => {
                        const c = UNIT_CONFIG[u];
                        return (
                          <SelectItem key={u} value={u} className="py-2.5">
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{c?.label ?? u}</span>
                              <span className="text-[11px] text-muted-foreground">{c?.description}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>

              {/* What-got-auto-set pill row */}
              {cfg && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
                    <CircleCheck className="h-3 w-3" />
                    Base: {cfg.baseUnit}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
                    <CircleCheck className="h-3 w-3" />
                    1 {unitType.toLowerCase()} = {formatBaseUnits(cfg.baseQuantity, cfg.baseUnit)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--stock-preview-neutral-bg)] border border-[var(--stock-preview-neutral-border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--stock-preview-neutral-text)]">
                    <CircleCheck className="h-3 w-3" />
                    Mode: {MODE_LABEL[cfg.sellingMode]}
                  </span>
                </div>
              )}
            </div>

            {/* ── Fields 3 & 4: Buy Price + Sell Price ─────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                  Buy Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">₹</span>
                  <Input
                    type="number"
                    min={0}
                    value={buyPrice === "" ? "" : buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value === "" ? "" : numberValue(e.target.value))}
                    placeholder="0"
                    className="h-12 pl-7 text-base font-semibold text-[var(--stock-purchase-rate)]"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Cost you pay to supplier</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                  Sell Price (₹)
                  <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">₹</span>
                  <Input
                    type="number"
                    min={0}
                    value={sellPrice === "" ? "" : sellPrice}
                    onChange={(e) => setSellPrice(e.target.value === "" ? "" : numberValue(e.target.value))}
                    placeholder="0"
                    className="h-12 pl-7 text-base font-semibold text-[var(--stock-selling-price)]"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Price customer pays</p>
              </div>
            </div>

            {/* ── Live Preview ──────────────────────────────────────────── */}
            {(name.trim() || sellPrice !== "") && (
              <LivePreview
                unitType={unitType}
                buyPrice={buyPrice !== "" ? Number(buyPrice) : 0}
                sellPrice={sellPrice !== "" ? Number(sellPrice) : 0}
                variantName={variantName}
              />
            )}

            {/* ── Advanced Options Toggle ───────────────────────────────── */}
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="w-full flex items-center justify-between rounded-xl border border-dashed px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Advanced Options
                <span className="text-[11px] font-normal">
                  (Brand, Category, Keywords, Stock, MRP, Expiry, Extra Variants)
                </span>
              </span>
              {showAdvanced
                ? <ChevronUp className="h-4 w-4 shrink-0" />
                : <ChevronDown className="h-4 w-4 shrink-0" />
              }
            </button>

            {/* ── Advanced Section ──────────────────────────────────────── */}
            {showAdvanced && (
              <div className="space-y-5 animate-in fade-in-0 slide-in-from-top-2 duration-200">

                {/* Variant name override */}
                <div className="rounded-xl border bg-card p-4 space-y-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Variant Name
                  </h4>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Name (auto-suggested: "{cfg?.variantNameSuggestion ?? unitType}")
                    </label>
                    <Input
                      value={variantName}
                      onChange={(e) => setVariantNameOverride(e.target.value)}
                      placeholder={cfg?.variantNameSuggestion ?? unitType}
                      className="h-9 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      This is the size/pack name shown in the product table and billing screen.
                    </p>
                  </div>
                </div>

                {/* Product identity */}
                <div className="rounded-xl border bg-card p-4 space-y-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    Product Identity
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Category</label>
                      <Input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Oil, Dal, Snacks"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Brand</label>
                      <Input
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g. Fortune, Tata, Amul"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        Search Keywords (comma-separated)
                      </label>
                      <Input
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g. sarso tel, mustard oil"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        Shortcut Key (for fast billing search)
                      </label>
                      <Input
                        value={shortcut}
                        onChange={(e) => setShortcut(e.target.value)}
                        placeholder="e.g. oil, att, chi"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock & Pricing extras */}
                <div className="rounded-xl border bg-card p-4 space-y-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Stock & Pricing Extras
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        MRP ₹ (printed on pack)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={mrp === "" ? "" : mrp}
                        onChange={(e) => setMrp(e.target.value === "" ? "" : numberValue(e.target.value))}
                        placeholder="e.g. 55"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        Opening Stock (units)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={initialStock === "" ? "" : initialStock}
                        onChange={(e) => setInitialStock(e.target.value === "" ? "" : numberValue(e.target.value))}
                        placeholder="0"
                        className="h-9 text-sm"
                      />
                      {initialStock !== "" && cfg && (
                        <p className="text-[11px] text-muted-foreground">
                          = {formatBaseUnits(Number(initialStock) * cfg.baseQuantity, cfg.baseUnit)} stored
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        Low Stock Alert (units)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={lowStockAlert === "" ? "" : lowStockAlert}
                        onChange={(e) => setLowStockAlert(e.target.value === "" ? "" : numberValue(e.target.value))}
                        placeholder={String(defaultLowStockAlert)}
                        className="h-9 text-sm"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Default: {defaultLowStockAlert} units. Alert shows when stock drops below this.
                      </p>
                    </div>
                  </div>

                  {/* Expiry + Quick Select */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expiry Date
                      </label>
                      <Input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/40 p-3 rounded-lg border border-transparent hover:border-border transition-all w-full">
                        <Checkbox
                          checked={quickSelect}
                          onCheckedChange={(v) => setQuickSelect(Boolean(v))}
                          className="mt-0.5"
                        />
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 text-warning" />
                            Fast Billing Me Dikhaye
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Billing screen ke quick-select panel me show hoga
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Extra variants */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      Extra Variants / Packs
                      <span className="text-[11px] font-normal text-muted-foreground">
                        (Same product, different sizes)
                      </span>
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs border-dashed border-2"
                      onClick={addExtraVariant}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Pack
                    </Button>
                  </div>

                  {extraVariants.length === 0 && (
                    <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-4 py-3 border border-dashed">
                      e.g. Add "500g Packet" and "1kg Packet" as extra packs for the same product.
                      They will share stock if they use the same base unit.
                    </p>
                  )}

                  {extraVariants.map((v, i) => (
                    <ExtraVariantRow
                      key={v.rowId}
                      variant={v}
                      index={i}
                      onUpdate={(patch) => updateExtraVariant(v.rowId, patch)}
                      onRemove={() => removeExtraVariant(v.rowId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="border-t bg-card px-5 py-4 shrink-0">
          {/* Validation errors */}
          {!isValid && (name.trim() !== "" || sellPrice !== "") && (
            <div className="mb-3 flex items-start gap-2 rounded-lg bg-[var(--stock-stock-out-bg)] border border-[var(--stock-stock-out-border)] px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-[var(--stock-stock-out-text)] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {errors.map((e, i) => (
                  <p key={i} className="text-xs text-[var(--stock-stock-out-text)]">{e}</p>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground hidden md:block">
              {extraVariants.length > 0
                ? `1 primary + ${extraVariants.length} extra variant${extraVariants.length > 1 ? "s" : ""}`
                : "1 variant will be created"}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                className="flex-1 md:flex-none"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending || !isValid}
                className="flex-1 md:flex-none h-11 px-8 font-bold shadow-sm"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CircleCheck className="h-4 w-4" />
                    Save Product
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
