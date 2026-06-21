"use client";

// StockProductCreator.tsx — V2 Category-First Premium UI
// ─────────────────────────────────────────────────────────────────────────────
// 3-step flow:
//   Step 0 → Category Grid
//   Step 1 → Product Search (filtered by category, from ProductCatalog)
//   Step 2 → Price / Stock / Expiry Form
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft, Search, Plus, IndianRupee, CalendarDays,
  Boxes, Bell, Barcode, MapPin, Star, ChevronRight,
  Sparkles, Package, Droplets
} from "lucide-react";
import { StockProductCreatorProvider, useStockProductCreator } from "../../../stock_context/StockProductCreatorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CATEGORY_MASTER } from "../../../stock_constants/CategoryMaster";
import { getProductsByCategory, searchCatalog, CatalogProduct } from "../../../stock_constants/ProductCatalog";

// ── Shared primitives ─────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1"
      style={{ color: "var(--stock-creator-label-text)" }}>
      {children}
      {required && <span style={{ color: "var(--stock-creator-error-text)" }}>*</span>}
    </label>
  );
}

function FieldInput({ className, style, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn("h-11 text-base rounded-xl shadow-sm transition-all duration-150", className)}
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

// ── Progress dots ─────────────────────────────────────────────────────────────

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === step ? 20 : 6,
            height: 6,
            backgroundColor: i <= step
              ? "var(--stock-creator-save-btn-bg)"
              : "var(--stock-creator-input-border)",
          }}
        />
      ))}
    </div>
  );
}

// ── Dialog Header ─────────────────────────────────────────────────────────────

function CreatorHeader({ onBack, showBack }: { onBack: () => void; showBack: boolean }) {
  const { step, categoryConfig } = useStockProductCreator();

  const titles = ["Category Chuniye", "Product Chuniye", "Daam & Stock"];
  const subtitles = [
    "Aapka saman kaunsi category mein hai?",
    categoryConfig ? `${categoryConfig.icon} ${categoryConfig.name} ke products` : "Catalog se select karein",
    "Price aur stock daaliye",
  ];

  return (
    <div
      className="shrink-0 px-5 pt-4 pb-3 border-b flex items-start justify-between gap-3"
      style={{
        backgroundColor: "var(--stock-creator-header-bg)",
        borderColor: "var(--stock-creator-footer-border)",
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        {showBack && (
          <button
            onClick={onBack}
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-colors hover:bg-[var(--stock-creator-input-bg)] active:scale-95"
            style={{ borderColor: "var(--stock-creator-input-border)" }}
          >
            <ArrowLeft className="h-4 w-4" style={{ color: "var(--stock-creator-label-text)" }} />
          </button>
        )}
        <div className="min-w-0">
          <DialogTitle
            className="text-lg font-bold leading-tight"
            style={{ color: "var(--stock-creator-header-title)" }}
          >
            {titles[step]}
          </DialogTitle>
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--stock-creator-header-subtitle)" }}>
            {subtitles[step]}
          </p>
        </div>
      </div>
      <StepDots step={step} />
    </div>
  );
}

// ── STEP 0: Category Grid ─────────────────────────────────────────────────────

function CategoryGrid() {
  const { selectCategory } = useStockProductCreator();

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain p-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {CATEGORY_MASTER.map((cat) => (
          <button
            key={cat.id}
            onClick={() => selectCategory(cat.id)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-center transition-all duration-150 active:scale-95 hover:shadow-md group"
            style={{
              backgroundColor: cat.color,
              borderColor: "transparent",
              color: cat.colorText,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = cat.colorText;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
            }}
          >
            <span className="text-2xl leading-none">{cat.icon}</span>
            <span
              className="text-[10px] font-bold leading-tight"
              style={{ color: cat.colorText }}
            >
              {cat.nameHindi}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── STEP 1: Product Search ─────────────────────────────────────────────────────

function ProductSearchStep() {
  const {
    selectedCategoryId, catalogSearch, setCatalogSearch,
    selectCatalogProduct, startCustomProduct, categoryConfig,
  } = useStockProductCreator();

  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { searchRef.current?.focus(); }, []);

  const results = searchCatalog(catalogSearch, selectedCategoryId);
  const allInCategory = getProductsByCategory(selectedCategoryId);

  // Split catalog results into branded and loose
  const branded = results.filter((p) => p.brand !== "");
  const loose = results.filter((p) => p.brand === "");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search box */}
      <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: "var(--stock-creator-input-border)" }}>
        <div className="relative">
          <Search
            className="absolute left-3 top-3 h-4 w-4 pointer-events-none"
            style={{ color: "var(--stock-creator-label-text)" }}
          />
          <FieldInput
            ref={searchRef}
            placeholder={`${categoryConfig?.icon ?? ""} Search product...`}
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Branded products */}
        {branded.length > 0 && (
          <div className="px-4 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--stock-creator-divider-text)" }}>
              Branded Products
            </p>
            <div className="space-y-1.5">
              {branded.map((product) => (
                <CatalogProductRow key={product.id} product={product} onSelect={selectCatalogProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Loose / khula products */}
        {loose.length > 0 && (
          <div className="px-4 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--stock-creator-divider-text)" }}>
              Khula / Loose Items
            </p>
            <div className="space-y-1.5">
              {loose.map((product) => (
                <CatalogProductRow key={product.id} product={product} onSelect={selectCatalogProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Not found / custom entry */}
        <div className="px-4 py-4 space-y-2">
          {branded.length === 0 && loose.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: "var(--stock-creator-divider-text)" }}>
              {catalogSearch ? `"${catalogSearch}" catalog mein nahi mila` : "Search karein..."}
            </p>
          )}
          {/* Custom add buttons */}
          <div className="pt-2 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "var(--stock-creator-divider-text)" }}>
              Khud Jodein
            </p>
            <button
              onClick={() => startCustomProduct(false)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all duration-150 active:scale-[0.98] hover:shadow-sm"
              style={{
                borderColor: "var(--stock-creator-save-btn-bg)",
                backgroundColor: "var(--stock-creator-input-bg)",
              }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--stock-creator-save-btn-bg)" }}>
                <Package className="h-4 w-4" style={{ color: "var(--stock-creator-save-btn-text)" }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ color: "var(--stock-creator-header-title)" }}>
                  Naya Branded Product
                </p>
                <p className="text-[10px]" style={{ color: "var(--stock-creator-header-subtitle)" }}>
                  Naam, brand, price aur stock daaliye
                </p>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto shrink-0" style={{ color: "var(--stock-creator-divider-text)" }} />
            </button>

            {categoryConfig?.allowLoose && (
              <button
                onClick={() => startCustomProduct(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all duration-150 active:scale-[0.98] hover:shadow-sm"
                style={{
                  borderColor: "var(--stock-creator-unit-khula-active-border)",
                  backgroundColor: "var(--stock-creator-input-bg)",
                }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--stock-creator-unit-khula-active-bg)" }}>
                  <Droplets className="h-4 w-4" style={{ color: "var(--stock-creator-unit-khula-active-text)" }} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold" style={{ color: "var(--stock-creator-header-title)" }}>
                    Khula / Loose Item
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--stock-creator-header-subtitle)" }}>
                    KG ya Litre mein bikata hai
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto shrink-0" style={{ color: "var(--stock-creator-divider-text)" }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogProductRow({ product, onSelect }: { product: CatalogProduct; onSelect: (p: CatalogProduct) => void }) {
  const isLoose = product.brand === "";
  return (
    <button
      onClick={() => onSelect(product)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 active:scale-[0.99] hover:shadow-sm text-left"
      style={{
        backgroundColor: isLoose ? "var(--stock-creator-unit-khula-active-bg)" : "var(--stock-creator-input-bg)",
        borderColor: isLoose ? "var(--stock-creator-unit-khula-active-border)" : "var(--stock-creator-input-border)",
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight truncate"
          style={{ color: "var(--stock-creator-header-title)" }}>
          {product.name}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--stock-creator-header-subtitle)" }}>
          {product.brand || "Khula"} {product.mrp ? `• MRP ₹${product.mrp}` : "• Loose Item"}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--stock-creator-divider-text)" }} />
    </button>
  );
}

// ── STEP 2: Price & Stock Form ─────────────────────────────────────────────────

function PriceStockForm() {
  const {
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
    showExpiry,
    sellingUnitLabel,
    margin,
    errors, isValid,
    handleSubmit,
    isCreating,
    categoryConfig,
    isCustomProduct,
  } = useStockProductCreator();

  const [showOptional, setShowOptional] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const isProfit = margin !== null && Number(margin) > 0;
  const isLoss = margin !== null && Number(margin) < 0;

  const handleSave = () => {
    setHasAttempted(true);
    if (isValid) handleSubmit();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 space-y-4">

          {/* Product name + brand  — editable only for custom products */}
          {isCustomProduct ? (
            <>
              <div className="space-y-1.5">
                <FieldLabel required>Saman Ka Naam</FieldLabel>
                <FieldInput
                  autoFocus
                  placeholder="e.g. Aashirvaad Atta 5kg..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Brand <span className="normal-case font-normal ml-1" style={{ color: "var(--stock-creator-divider-text)" }}>(optional)</span></FieldLabel>
                <FieldInput
                  placeholder={isLoose ? "Khula item — brand nahi hota" : "e.g. Nestle, Parle..."}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  disabled={isLoose}
                />
              </div>
            </>
          ) : (
            /* Read-only product card when picked from catalog */
            <div
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{
                backgroundColor: "var(--stock-creator-optional-body-bg)",
                borderColor: "var(--stock-creator-input-border)",
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: categoryConfig?.color }}>
                {categoryConfig?.icon}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight truncate"
                  style={{ color: "var(--stock-creator-header-title)" }}>
                  {name}
                </p>
                <p className="text-[10px]" style={{ color: "var(--stock-creator-header-subtitle)" }}>
                  {brand || "Khula"} {mrp ? `• MRP ₹${mrp}` : ""}
                </p>
              </div>
              {isLoose && (
                <span
                  className="ml-auto shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--stock-creator-unit-khula-active-bg)",
                    color: "var(--stock-creator-unit-khula-active-text)",
                  }}
                >
                  KHULA
                </span>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="relative py-0.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed" style={{ borderColor: "var(--stock-creator-input-border)" }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[10px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: "var(--stock-creator-body-bg)", color: "var(--stock-creator-divider-text)" }}>
                Daam (Rate)
              </span>
            </div>
          </div>

          {/* Buy + Sell Price */}
          <div className="grid grid-cols-2 gap-3">
            {/* Buy */}
            <div className="space-y-1.5">
              <FieldLabel>
                <IndianRupee className="h-3 w-3" />
                Khareed Rate
                <span className="normal-case font-normal" style={{ color: "var(--stock-creator-divider-text)" }}>(opt.)</span>
              </FieldLabel>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 pointer-events-none"
                  style={{ color: "var(--stock-creator-label-text)" }} />
                <FieldInput
                  type="number"
                  placeholder="0"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                  className="pl-8"
                />
              </div>
              <p className="text-[9px]" style={{ color: "var(--stock-creator-divider-text)" }}>
                per {sellingUnitLabel}
              </p>
            </div>
            {/* Sell */}
            <div className="space-y-1.5">
              <FieldLabel required>
                <IndianRupee className="h-3 w-3" />
                Bikri Rate
              </FieldLabel>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 pointer-events-none"
                  style={{ color: "var(--stock-creator-label-text)" }} />
                <FieldInput
                  type="number"
                  placeholder="0"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                  className="pl-8"
                  style={{
                    borderColor: "var(--stock-creator-sell-input-border)",
                    backgroundColor: "var(--stock-creator-sell-input-bg)",
                  }}
                />
              </div>
              <p className="text-[9px]" style={{ color: "var(--stock-creator-divider-text)" }}>
                per {sellingUnitLabel}
              </p>
            </div>
          </div>

          {/* Live Margin Badge */}
          {margin !== null && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border animate-in fade-in duration-300"
              style={{
                backgroundColor: isProfit
                  ? "var(--stock-creator-margin-profit-bg)"
                  : isLoss ? "var(--stock-creator-margin-loss-bg)" : "var(--stock-creator-body-bg)",
                borderColor: isProfit
                  ? "var(--stock-creator-margin-profit-border)"
                  : isLoss ? "var(--stock-creator-margin-loss-border)" : "var(--stock-creator-input-border)",
                color: isProfit
                  ? "var(--stock-creator-margin-profit-text)"
                  : isLoss ? "var(--stock-creator-margin-loss-text)" : "var(--stock-creator-label-text)",
              }}
            >
              <span>{isProfit ? "📈" : isLoss ? "📉" : "—"}</span>
              <span>Margin: {margin}%</span>
              {isProfit && (
                <span className="ml-auto">
                  Profit ₹{(Number(sellPrice) - Number(buyPrice)).toFixed(0)}/{sellingUnitLabel.toLowerCase()}
                </span>
              )}
              {isLoss && <span className="ml-auto">Loss! Khareed zyada hai</span>}
            </div>
          )}

          {/* Divider */}
          <div className="relative py-0.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed" style={{ borderColor: "var(--stock-creator-input-border)" }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[10px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: "var(--stock-creator-body-bg)", color: "var(--stock-creator-divider-text)" }}>
                Maal (Stock)
              </span>
            </div>
          </div>

          {/* Stock + Expiry */}
          <div className={cn("grid gap-3", showExpiry ? "grid-cols-2" : "grid-cols-1")}>
            {/* Stock */}
            <div className="space-y-1.5">
              <FieldLabel required>
                <Boxes className="h-3 w-3" />
                Abhi kitna stock hai?
              </FieldLabel>
              <div className="relative">
                <FieldInput
                  type="number"
                  placeholder="0"
                  value={initialStock}
                  onChange={(e) => setInitialStock(e.target.value !== "" ? Number(e.target.value) : "")}
                  className="pr-16 font-bold"
                />
                <span
                  className="absolute right-3 top-3 text-xs font-semibold"
                  style={{ color: "var(--stock-creator-label-text)" }}
                >
                  {sellingUnitLabel.split(" ")[0]}
                </span>
              </div>
            </div>

            {/* Expiry — shown only if category requires it */}
            {showExpiry && (
              <div className="space-y-1.5">
                <FieldLabel required={categoryConfig?.expiryRule === "required"}>
                  <CalendarDays className="h-3 w-3" />
                  Expiry Date
                </FieldLabel>
                <div className="relative">
                  <FieldInput
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="pl-9 text-sm [color-scheme:light] dark:[color-scheme:dark]"
                  />
                  <CalendarDays
                    className="absolute left-3 top-3 h-4 w-4 pointer-events-none"
                    style={{ color: "var(--stock-creator-label-text)" }}
                  />
                </div>
                <p className="text-[9px]" style={{ color: "var(--stock-creator-divider-text)" }}>
                  Pack pe likha hua date daaliye
                </p>
              </div>
            )}
          </div>

          {/* Optional collapsible */}
          <div
            className="rounded-2xl border border-dashed overflow-hidden"
            style={{ borderColor: "var(--stock-creator-optional-border)" }}
          >
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors"
              style={{ color: "var(--stock-creator-optional-header-text)" }}
            >
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Extra Settings (Optional)
              </span>
              <span className="text-lg">{showOptional ? "−" : "+"}</span>
            </button>

            {showOptional && (
              <div
                className="px-4 pb-4 pt-1 space-y-3.5 animate-in slide-in-from-top-2 duration-200"
                style={{ backgroundColor: "var(--stock-creator-optional-body-bg)" }}
              >
                {/* Low Stock Alert */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                    style={{ color: "var(--stock-creator-label-text)" }}>
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
                      {sellingUnitLabel.split(" ")[0]} se kam ho toh alert
                    </p>
                  </div>
                </div>

                {/* MRP */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                    style={{ color: "var(--stock-creator-label-text)" }}>
                    <IndianRupee className="h-3 w-3" /> MRP (Pack pe likha hua)
                  </p>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 pointer-events-none"
                      style={{ color: "var(--stock-creator-label-text)" }} />
                    <FieldInput
                      type="number"
                      placeholder="0"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value !== "" ? Number(e.target.value) : "")}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Barcode */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                    style={{ color: "var(--stock-creator-label-text)" }}>
                    <Barcode className="h-3 w-3" /> Barcode
                  </p>
                  <div className="relative">
                    <FieldInput
                      placeholder="Scan karein ya type karein"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="pl-9"
                    />
                    <Barcode className="absolute left-3 top-3 h-4 w-4 pointer-events-none"
                      style={{ color: "var(--stock-creator-label-text)" }} />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"
                    style={{ color: "var(--stock-creator-label-text)" }}>
                    <MapPin className="h-3 w-3" /> Kahan Rakha Hai?
                  </p>
                  <div className="relative">
                    <FieldInput
                      placeholder="e.g. Rack 3, Godown, Fridge..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-9"
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 pointer-events-none"
                      style={{ color: "var(--stock-creator-label-text)" }} />
                  </div>
                </div>

                {/* Quick Select */}
                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl border border-dashed hover:bg-[var(--stock-creator-input-bg)] transition-colors">
                  <Checkbox
                    checked={quickSelect}
                    onCheckedChange={(checked) => setQuickSelect(Boolean(checked))}
                    className="mt-0.5"
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:text-primary transition-colors">
                      <Star className="h-3 w-3 text-amber-500" />
                      Fast Billing Me Dikhao
                    </p>
                    <p className="text-[10px] leading-snug" style={{ color: "var(--stock-creator-label-text)" }}>
                      Billing screen pe quick-tap ke liye pin karein
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="h-1" />
        </div>
      </div>

      {/* Sticky Footer */}
      <div
        className="shrink-0 border-t px-4 py-3 space-y-2.5"
        style={{ backgroundColor: "var(--stock-creator-footer-bg)", borderColor: "var(--stock-creator-footer-border)" }}
      >
        {hasAttempted && !isValid && errors.length > 0 && (
          <div
            className="rounded-xl border px-3.5 py-2.5 space-y-1 animate-in fade-in slide-in-from-bottom-1 duration-200"
            style={{ backgroundColor: "var(--stock-creator-error-bg)", borderColor: "var(--stock-creator-error-border)" }}
          >
            {errors.map((err, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "var(--stock-creator-error-text)" }}>
                <div className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--stock-creator-error-dot)" }} />
                {err}
              </div>
            ))}
          </div>
        )}
        <Button
          className="w-full h-11 rounded-2xl text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.98] border-0"
          style={{
            backgroundColor: isCreating ? "var(--stock-creator-save-btn-disabled-bg)" : "var(--stock-creator-save-btn-bg)",
            color: isCreating ? "var(--stock-creator-save-btn-disabled-text)" : "var(--stock-creator-save-btn-text)",
          }}
          disabled={isCreating}
          onClick={handleSave}
        >
          {isCreating ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--stock-creator-save-btn-disabled-text)", borderTopColor: "transparent" }} />
              Saving…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Product Save Karo
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Main inner form ────────────────────────────────────────────────────────────

function StockProductCreatorInner() {
  const { isAddOpen, handleOpenChange, step, goBack } = useStockProductCreator();

  return (
    <Dialog open={isAddOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-full max-w-md p-0 gap-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border max-h-[92dvh] sm:max-h-[86vh] flex flex-col"
        style={{
          backgroundColor: "var(--stock-creator-body-bg)",
          borderColor: "var(--stock-creator-input-border)",
        }}
      >
        {/* Drag handle — mobile */}
        <div className="flex justify-center pt-2.5 pb-0 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--stock-creator-input-border)" }} />
        </div>

        {/* Header */}
        <CreatorHeader onBack={goBack} showBack={step > 0} />

        {/* Step content */}
        {step === 0 && <CategoryGrid />}
        {step === 1 && <ProductSearchStep />}
        {step === 2 && <PriceStockForm />}
      </DialogContent>
    </Dialog>
  );
}

// ── Exported wrapper ──────────────────────────────────────────────────────────

export function StockProductCreator() {
  return (
    <StockProductCreatorProvider>
      <StockProductCreatorInner />
    </StockProductCreatorProvider>
  );
}
