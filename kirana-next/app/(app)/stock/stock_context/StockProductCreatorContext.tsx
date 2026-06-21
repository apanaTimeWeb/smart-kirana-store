"use client";

// StockProductCreatorContext.tsx — V2 Category-First Flow
// ─────────────────────────────────────────────────────────────────────────────
// State for the new 3-step product creator:
//   Step 0: Pick a category (category grid)
//   Step 1: Pick/search product from catalog (or enter custom)
//   Step 2: Enter price, stock, expiry
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { UnitType } from "@/lib/api";
import { VariantDraft } from "../stock_types/StockTypes";
import { STOCK_DEFAULT_LOW_STOCK_ALERT } from "../stock_constants/StockSharedConstants";
import { defaultPresetsFor, uid } from "../stock_utils/StockUtils";
import { useStock } from "./StockContext";
import { getCategoryById, CategoryConfig } from "../stock_constants/CategoryMaster";
import { CatalogProduct } from "../stock_constants/ProductCatalog";

export type CreatorStep = 0 | 1 | 2;

function useStockProductCreatorInternal() {
  const { isAddOpen, setIsAddOpen, create, isCreating, prefillData } = useStock();

  // ── Step navigation ───────────────────────────────────────────────────────
  const [step, setStep] = useState<CreatorStep>(0);

  // ── Step 0: Category selection ────────────────────────────────────────────
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // ── Step 1: Product selection ─────────────────────────────────────────────
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState<CatalogProduct | null>(null);
  const [isCustomProduct, setIsCustomProduct] = useState(false); // true = manual entry
  const [isLoose, setIsLoose] = useState(false); // true = khula/loose item

  // ── Step 2: Form fields ───────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");
  const [initialStock, setInitialStock] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState<number | "">(STOCK_DEFAULT_LOW_STOCK_ALERT);
  const [mrp, setMrp] = useState<number | "">("");
  const [quickSelect, setQuickSelect] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [location, setLocation] = useState("");

  // Sync prefillData when dialog opens (e.g. "Add another variant" flow)
  React.useEffect(() => {
    if (isAddOpen && prefillData) {
      setName(prefillData.name);
      setBrand(prefillData.brand);
      setStep(2); // Skip to form directly when prefilled
    }
  }, [isAddOpen, prefillData]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const categoryConfig: CategoryConfig | undefined = getCategoryById(selectedCategoryId);

  // Expiry is only shown when:
  // 1. category.expiryRule === "required"  AND
  // 2. item is NOT loose (loose items never have expiry)
  const showExpiry = useMemo(() => {
    if (!categoryConfig) return false;
    if (isLoose) return false;
    return categoryConfig.expiryRule === "required";
  }, [categoryConfig, isLoose]);

  // Unit label shown in the form (per packet / per KG / per Litre etc.)
  const sellingUnitLabel = useMemo(() => {
    if (!categoryConfig) return "Piece";
    if (isLoose) return categoryConfig.looseUnitLabel;
    return categoryConfig.sellingUnitLabel;
  }, [categoryConfig, isLoose]);

  // The UnitType used for the API variant
  const resolvedUnitType = useMemo((): UnitType => {
    if (!categoryConfig) return "PACKET";
    if (isLoose) return categoryConfig.looseUnitType as UnitType;
    return categoryConfig.defaultUnitType as UnitType;
  }, [categoryConfig, isLoose]);

  // baseQuantity for the variant (how many base units per 1 selling unit)
  const resolvedBaseQuantity = useMemo(() => {
    if (!categoryConfig) return 1;
    if (isLoose) return categoryConfig.defaultUnitType === "KG" ? 1000 : 1000; // KG→gram or L→ml
    return categoryConfig.defaultBaseQuantity;
  }, [categoryConfig, isLoose]);

  const stockInBase = useMemo(() => {
    const qty = initialStock !== "" ? Number(initialStock) : 0;
    return qty * resolvedBaseQuantity;
  }, [initialStock, resolvedBaseQuantity]);

  const lowStockInBase = (lowStockAlert !== "" ? Number(lowStockAlert) : STOCK_DEFAULT_LOW_STOCK_ALERT) * resolvedBaseQuantity;

  // ── Margin ────────────────────────────────────────────────────────────────
  const margin = useMemo(() => {
    if (buyPrice !== "" && sellPrice !== "" && Number(sellPrice) > 0) {
      return (((Number(sellPrice) - Number(buyPrice)) / Number(sellPrice)) * 100).toFixed(1);
    }
    return null;
  }, [buyPrice, sellPrice]);

  // ── Validation ────────────────────────────────────────────────────────────
  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Saman ka naam zaroori hai");
    if (sellPrice === "" || Number(sellPrice) <= 0) errs.push("Bikri rate 0 se zyada hona chahiye");
    if (initialStock === "" || Number(initialStock) < 0) errs.push("Stock dalna zaroori hai");
    if (showExpiry && !expiryDate) errs.push("Is category mein expiry date zaroori hai");
    return errs;
  }, [name, sellPrice, initialStock, showExpiry, expiryDate]);

  const isValid = errors.length === 0;

  // ── Actions ───────────────────────────────────────────────────────────────

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setStep(1);
    setIsLoose(false);
    setCatalogSearch("");
    setSelectedCatalogProduct(null);
    setIsCustomProduct(false);
  };

  const selectCatalogProduct = (product: CatalogProduct) => {
    setSelectedCatalogProduct(product);
    setName(product.name);
    setBrand(product.brand);
    setMrp(product.mrp ?? "");
    setIsCustomProduct(false);
    // Detect loose from catalog (empty brand)
    setIsLoose(product.brand === "");
    setStep(2);
  };

  const startCustomProduct = (loose = false) => {
    setSelectedCatalogProduct(null);
    setIsCustomProduct(true);
    setIsLoose(loose);
    setName(loose ? "" : "");
    setBrand("");
    setMrp("");
    setStep(2);
  };

  const goBack = () => {
    if (step === 1) {
      setStep(0);
      setSelectedCategoryId("");
    } else if (step === 2) {
      setStep(1);
      setName("");
      setBrand("");
      setSellPrice("");
      setBuyPrice("");
      setInitialStock("");
      setExpiryDate("");
      setMrp("");
    }
  };

  const reset = useCallback(() => {
    setStep(0);
    setSelectedCategoryId("");
    setCatalogSearch("");
    setSelectedCatalogProduct(null);
    setIsCustomProduct(false);
    setIsLoose(false);
    setName("");
    setBrand("");
    setBuyPrice("");
    setSellPrice("");
    setInitialStock("");
    setExpiryDate("");
    setLowStockAlert(STOCK_DEFAULT_LOW_STOCK_ALERT);
    setMrp("");
    setQuickSelect(false);
    setBarcode("");
    setLocation("");
  }, []);

  const handleSubmit = () => {
    if (!isValid || !categoryConfig) return;

    const primaryVariant: VariantDraft = {
      rowId: uid(),
      variantName: isLoose ? categoryConfig.looseUnitLabel : categoryConfig.sellingUnitLabel,
      unitType: resolvedUnitType,
      baseUnit: categoryConfig.defaultBaseUnit,
      baseQuantity: resolvedBaseQuantity,
      sellingMode: isLoose ? "khula" : categoryConfig.defaultSellingMode,
      mrp: mrp !== "" ? Number(mrp) : Number(sellPrice),
      purchasePrice: buyPrice !== "" ? Number(buyPrice) : 0,
      sellingPrice: Number(sellPrice),
      quickSelect,
      expiryDate: showExpiry ? expiryDate : "",
      stockInBaseUnit: stockInBase,
      lowStockThresholdInBaseUnit: lowStockInBase,
      presetBaseQuantities: defaultPresetsFor(categoryConfig.defaultBaseUnit),
    };

    create({
      name: name.trim(),
      category: selectedCategoryId,
      brand: brand.trim(),
      keywords: location.trim(),
      shortcut: barcode.trim(),
      sellingTypes: {
        khula: isLoose,
        fixed: !isLoose,
        multiple: false,
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
    // Dialog state
    isAddOpen,
    handleOpenChange,
    isCreating,

    // Step navigation
    step,
    setStep,
    goBack,

    // Step 0
    selectedCategoryId,
    selectCategory,
    categoryConfig,

    // Step 1
    catalogSearch, setCatalogSearch,
    selectedCatalogProduct,
    selectCatalogProduct,
    isCustomProduct,
    startCustomProduct,

    // Step 2 fields
    name, setName,
    brand, setBrand,
    isLoose, setIsLoose,
    buyPrice, setBuyPrice,
    sellPrice, setSellPrice,
    initialStock, setInitialStock,
    expiryDate, setExpiryDate,
    lowStockAlert, setLowStockAlert,
    mrp, setMrp,
    quickSelect, setQuickSelect,
    barcode, setBarcode,
    location, setLocation,

    // Derived
    showExpiry,
    sellingUnitLabel,
    margin,
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
