"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CircleCheck,
  IndianRupee,
  Info,
  Package,
  Plus,
  Scale,
  Star,
  Tag,
  Zap,
} from "lucide-react";
import { ProductDraft, VariantDraft } from "./StockTypes";
import { UNIT_CONFIG } from "./StockConstants";
import {
  defaultBaseQuantity,
  defaultPresetsFor,
  formatBaseUnits,
  numberValue,
  uid,
  variantDraft,
} from "./StockUtils";
import { UnitType } from "@/lib/api";
import { StockUnitSelector } from "./StockUnitSelector";
import { StockLivePreview } from "./StockLivePreview";
import { StockExtraVariantRow } from "./StockExtraVariantRow";
import { useStock } from "./StockContext";
import { MODE_LABEL } from "./StockConstants";

export function StockProductCreator() {
  const { isAddOpen, setIsAddOpen, create, isCreating } = useStock();

  // ── Core quick fields ────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [unitType, setUnitType] = useState<string>("KG");
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");

  // ── Advanced fields ──────────────────────────────────────────────────────
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

    create(draft);
    reset();
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) reset();
    setIsAddOpen(val);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Dialog open={isAddOpen} onOpenChange={handleOpenChange}>
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

              <StockUnitSelector
                value={unitType}
                onChange={handleUnitChange}
                triggerClassName="h-12 text-sm font-medium px-3"
              />

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
              <StockLivePreview
                unitType={unitType}
                buyPrice={buyPrice !== "" ? Number(buyPrice) : 0}
                sellPrice={sellPrice !== "" ? Number(sellPrice) : 0}
                variantName={variantName}
              />
            )}

            {/* ── Additional Details Section ──────────────────────────────────────── */}
            <div className="space-y-5">
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
                  <StockExtraVariantRow
                    key={v.rowId}
                    variant={v}
                    index={i}
                    onUpdate={(patch) => updateExtraVariant(v.rowId, patch)}
                    onRemove={() => removeExtraVariant(v.rowId)}
                  />
                ))}
              </div>
            </div>
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
                disabled={isCreating || !isValid}
                className="flex-1 md:flex-none h-11 px-8 font-bold shadow-sm"
              >
                {isCreating ? (
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
