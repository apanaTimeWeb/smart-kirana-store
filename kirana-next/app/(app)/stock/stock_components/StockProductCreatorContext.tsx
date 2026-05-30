"use client";

// StockProductCreatorContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Isolated React Context for the "Naya Product" creator dialog's local form state.
// This is SEPARATE from StockContext (module-level state).
//
// WHY a second context?
//   The creator dialog is broken into 8+ micro-components (name field, unit field,
//   price fields, etc.). Without a context, we'd need to prop-drill 15+ state
//   values through every component layer. This context provides perfect isolation:
//   each field component reads ONLY the values it needs.
//
// TOMORROW: If the form needs server-side defaults, replace the useState
//   initialisers here. Zero UI component changes needed.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { UnitType } from "@/lib/api";
import { VariantDraft } from "./StockTypes";
import { UNIT_CONFIG, STOCK_DEFAULT_CATEGORY, STOCK_DEFAULT_LOW_STOCK_ALERT } from "./StockConstants";
import { defaultPresetsFor, uid, variantDraft } from "./StockUtils";
import { useStock } from "./StockContext";
import { toInput } from "./StockUtils";

// ── Internal hook that owns all creator form state ───────────────────────────

function useStockProductCreatorInternal() {
  const { isAddOpen, setIsAddOpen, create, isCreating } = useStock();

  // Core quick fields
  const [name, setName] = useState("");
  const [unitType, setUnitType] = useState<string>("KG");
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");

  // Advanced fields
  const [category, setCategory] = useState(STOCK_DEFAULT_CATEGORY);
  const [brand, setBrand] = useState("");
  const [keywords, setKeywords] = useState("");
  const [shortcut, setShortcut] = useState("");
  const [mrp, setMrp] = useState<number | "">("");
  const [initialStock, setInitialStock] = useState<number | "">("");
  const [lowStockAlert, setLowStockAlert] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quickSelect, setQuickSelect] = useState(false);
  const [extraVariants, setExtraVariants] = useState<VariantDraft[]>([]);
  const [variantNameOverride, setVariantNameOverride] = useState<string | null>(null);

  // Derived from unitType
  const cfg = UNIT_CONFIG[unitType];
  const variantName = variantNameOverride ?? cfg?.variantNameSuggestion ?? unitType;

  const handleUnitChange = (newUnit: string) => {
    setUnitType(newUnit);
    setVariantNameOverride(null); // reset so suggestion auto-updates
    setLowStockAlert("");
  };

  const defaultLowStockAlert = STOCK_DEFAULT_LOW_STOCK_ALERT;

  // Computed base unit values
  const lowStockInBase = useMemo(() => {
    const threshold = lowStockAlert !== "" ? Number(lowStockAlert) : defaultLowStockAlert;
    return threshold * (cfg?.baseQuantity ?? 1);
  }, [lowStockAlert, defaultLowStockAlert, cfg]);

  const stockInBase = useMemo(() => {
    const qty = initialStock !== "" ? Number(initialStock) : 0;
    return qty * (cfg?.baseQuantity ?? 1);
  }, [initialStock, cfg]);

  // Validation
  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Product name required");
    if (sellPrice === "" || Number(sellPrice) <= 0) errs.push("Sell price must be > 0");
    return errs;
  }, [name, sellPrice]);

  const isValid = errors.length === 0;

  // Extra variant handlers
  const addExtraVariant = () => {
    const newV = variantDraft({ variantName: "New Pack", sellingMode: "fixed", unitType: "PACKET" });
    setExtraVariants((prev) => [...prev, newV]);
  };

  const updateExtraVariant = (rowId: string, patch: Partial<VariantDraft>) => {
    setExtraVariants((prev) => prev.map((v) => (v.rowId === rowId ? { ...v, ...patch } : v)));
  };

  const removeExtraVariant = (rowId: string) => {
    setExtraVariants((prev) => prev.filter((v) => v.rowId !== rowId));
  };

  // Reset all fields to blank
  const reset = useCallback(() => {
    setName("");
    setUnitType("KG");
    setBuyPrice("");
    setSellPrice("");
    setCategory(STOCK_DEFAULT_CATEGORY);
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

  // Submit
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
    create({
      name: name.trim(),
      category: category.trim() || STOCK_DEFAULT_CATEGORY,
      brand: brand.trim(),
      keywords: keywords.trim(),
      shortcut: shortcut.trim(),
      sellingTypes: {
        khula: cfg.sellingMode === "khula",
        fixed: cfg.sellingMode === "fixed" || cfg.sellingMode === "variant",
        multiple: cfg.sellingMode === "wholesale",
      },
      variants: [primaryVariant, ...extraVariants],
    });
    reset();
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) reset();
    setIsAddOpen(val);
  };

  return {
    // Dialog state
    isAddOpen,
    handleOpenChange,
    isCreating,
    // Form fields
    name, setName,
    unitType,
    handleUnitChange,
    buyPrice, setBuyPrice,
    sellPrice, setSellPrice,
    category, setCategory,
    brand, setBrand,
    keywords, setKeywords,
    shortcut, setShortcut,
    mrp, setMrp,
    initialStock, setInitialStock,
    lowStockAlert, setLowStockAlert,
    expiryDate, setExpiryDate,
    quickSelect, setQuickSelect,
    variantNameOverride, setVariantNameOverride,
    // Derived
    cfg,
    variantName,
    defaultLowStockAlert,
    stockInBase,
    errors,
    isValid,
    // Extra variants
    extraVariants,
    addExtraVariant,
    updateExtraVariant,
    removeExtraVariant,
    // Actions
    handleSubmit,
    reset,
  };
}

// ── Context setup ─────────────────────────────────────────────────────────────

export type StockProductCreatorContextValue = ReturnType<typeof useStockProductCreatorInternal>;
const StockProductCreatorContext = createContext<StockProductCreatorContextValue | null>(null);

export function StockProductCreatorProvider({ children }: { children: React.ReactNode }) {
  const value = useStockProductCreatorInternal();
  return (
    <StockProductCreatorContext.Provider value={value}>
      {children}
    </StockProductCreatorContext.Provider>
  );
}

export function useStockProductCreator() {
  const ctx = useContext(StockProductCreatorContext);
  if (!ctx) throw new Error("useStockProductCreator must be used within StockProductCreatorProvider");
  return ctx;
}
