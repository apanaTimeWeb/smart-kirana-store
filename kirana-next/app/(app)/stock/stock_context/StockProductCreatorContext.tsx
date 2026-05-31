"use client";

// StockProductCreatorContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Refactored for Simple "2-Click" Mobile-First UI (Based on Final Plan)
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { UnitType } from "@/lib/api";
import { VariantDraft } from "../stock_types/StockTypes";
import { UNIT_CONFIG, STOCK_DEFAULT_CATEGORY, STOCK_DEFAULT_LOW_STOCK_ALERT } from "../stock_constants/StockSharedConstants";
import { defaultPresetsFor, uid } from "../stock_utils/StockUtils";
import { useStock } from "./StockContext";

function useStockProductCreatorInternal() {
  const { isAddOpen, setIsAddOpen, create, isCreating } = useStock();

  // Core required fields
  const [name, setName] = useState("");
  const [unitType, setUnitType] = useState<string>("PACKET"); // Default to Packet
  const [bulkConversionRate, setBulkConversionRate] = useState<number | "">(""); // For Bora/Bulk
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");
  const [initialStock, setInitialStock] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");

  // Optional fields
  const [brand, setBrand] = useState("");
  const [barcode, setBarcode] = useState("");
  const [location, setLocation] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState<number | "">(STOCK_DEFAULT_LOW_STOCK_ALERT);

  // Hardcoded/Hidden advanced fields for API compatibility
  const category = STOCK_DEFAULT_CATEGORY;
  const quickSelect = false;

  const handleUnitChange = (newUnit: string) => {
    setUnitType(newUnit);
    if (newUnit !== "BORA" && newUnit !== "BOX" && newUnit !== "CARTON" && newUnit !== "TIN") {
      setBulkConversionRate("");
    }
  };

  const cfg = UNIT_CONFIG[unitType];

  // Calculate actual base quantity
  // If bulk (e.g. Bora), use the user's conversion rate (assuming they enter KG for weight, Piece for piece)
  const actualBaseQuantity = useMemo(() => {
    if (!cfg) return 1;
    if (cfg.group === "wholesale" && bulkConversionRate !== "") {
      // If base unit is gram (e.g. Bora), user enters KG -> multiply by 1000
      if (cfg.baseUnit === "gram") return Number(bulkConversionRate) * 1000;
      // If base unit is ml, user enters Litre -> multiply by 1000
      if (cfg.baseUnit === "ml") return Number(bulkConversionRate) * 1000;
      // If base unit is piece, user enters Pieces -> multiply by 1
      return Number(bulkConversionRate);
    }
    return cfg.baseQuantity;
  }, [cfg, bulkConversionRate]);

  // Computed base unit values
  const stockInBase = useMemo(() => {
    const qty = initialStock !== "" ? Number(initialStock) : 0;
    return qty * actualBaseQuantity;
  }, [initialStock, actualBaseQuantity]);

  const lowStockInBase = (lowStockAlert !== "" ? Number(lowStockAlert) : STOCK_DEFAULT_LOW_STOCK_ALERT) * actualBaseQuantity;

  // Validation
  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Saman ka naam zaroori hai");
    if (sellPrice === "" || Number(sellPrice) <= 0) errs.push("Bikri (Sell) rate 0 se zyada hona chahiye");
    if (initialStock === "" || Number(initialStock) < 0) errs.push("Current stock dalna zaroori hai");
    // Expiry date is OPTIONAL — non-consumables (batteries, pens, buckets etc.) have no expiry

    if (cfg?.group === "wholesale" && (bulkConversionRate === "" || Number(bulkConversionRate) <= 0)) {
      errs.push("Bora me kitna KG/Piece hai, ye batana zaroori hai");
    }

    return errs;
  }, [name, sellPrice, initialStock, cfg, bulkConversionRate]);

  const isValid = errors.length === 0;

  const reset = useCallback(() => {
    setName("");
    setBrand("");
    setBarcode("");
    setUnitType("PACKET");
    setBulkConversionRate("");
    setBuyPrice("");
    setSellPrice("");
    setInitialStock("");
    setExpiryDate("");
    setLocation("");
    setLowStockAlert(STOCK_DEFAULT_LOW_STOCK_ALERT);
  }, []);

  // Submit
  const handleSubmit = () => {
    if (!isValid || !cfg) return;

    const primaryVariant: VariantDraft = {
      rowId: uid(),
      variantName: unitType, // Simply use unit type as variant name
      unitType: unitType as UnitType,
      baseUnit: cfg.baseUnit,
      baseQuantity: actualBaseQuantity,
      sellingMode: cfg.sellingMode,
      mrp: Number(sellPrice), // Default MRP to Sell Price in simple UI
      purchasePrice: buyPrice !== "" ? Number(buyPrice) : 0,
      sellingPrice: Number(sellPrice),
      quickSelect,
      expiryDate: expiryDate,
      stockInBaseUnit: stockInBase,
      lowStockThresholdInBaseUnit: lowStockInBase,
      presetBaseQuantities: defaultPresetsFor(cfg.baseUnit),
    };

    create({
      name: name.trim(),
      category: category,
      brand: brand.trim(), // Use the brand from state
      keywords: location.trim(), // Storing location in keywords for now to avoid changing the DB schema
      shortcut: barcode.trim(), // Storing barcode in shortcut for now to avoid changing the DB schema
      sellingTypes: {
        khula: cfg.sellingMode === "khula",
        fixed: cfg.sellingMode === "fixed" || cfg.sellingMode === "variant",
        multiple: cfg.sellingMode === "wholesale",
      },
      variants: [primaryVariant],
    });
    
    reset();
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) reset();
    setIsAddOpen(val);
  };

  return {
    isAddOpen,
    handleOpenChange,
    isCreating,
    name, setName,
    brand, setBrand,
    barcode, setBarcode,
    unitType, handleUnitChange,
    bulkConversionRate, setBulkConversionRate,
    buyPrice, setBuyPrice,
    sellPrice, setSellPrice,
    initialStock, setInitialStock,
    expiryDate, setExpiryDate,
    location, setLocation,
    lowStockAlert, setLowStockAlert,
    errors,
    isValid,
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
