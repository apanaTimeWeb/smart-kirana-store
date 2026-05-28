import { BaseUnit, ProductInput, SellingMode, UnitType } from "@/lib/api";
import { ProductDraft, SellingTypeKey, VariantDraft } from "./types";

export const UNITS: UnitType[] = [
  "GRAM", "KG", "ML", "LITRE", "PIECE", "POUCH", "BOTTLE", "PACKET",
  "BOX", "CARTON", "TIN", "DABBA", "BORA", "BAG", "DOZEN", "BUNDLE",
];

export const BASE_UNITS: BaseUnit[] = ["gram", "ml", "piece"];

export const MODE_LABEL: Record<SellingMode, string> = {
  khula: "Khula",
  fixed: "Fixed",
  variant: "Variant",
  wholesale: "Wholesale",
};

export const MODE_CLASS: Record<SellingMode, string> = {
  khula: "bg-[var(--products-mode-khula-bg)] text-[var(--products-mode-khula-text)] border-[var(--products-mode-khula-border)]",
  fixed: "bg-[var(--products-mode-fixed-bg)] text-[var(--products-mode-fixed-text)] border-[var(--products-mode-fixed-border)]",
  variant: "bg-[var(--products-mode-variant-bg)] text-[var(--products-mode-variant-text)] border-[var(--products-mode-variant-border)]",
  wholesale: "bg-[var(--products-mode-wholesale-bg)] text-[var(--products-mode-wholesale-text)] border-[var(--products-mode-wholesale-border)]",
};

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function numberValue(value: string | number | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function defaultBaseUnit(unitType: UnitType): BaseUnit {
  const unit = String(unitType).toUpperCase();
  if (["GRAM", "KG", "BORA", "BAG"].includes(unit)) return "gram";
  if (["ML", "LITRE", "TIN"].includes(unit)) return "ml";
  return "piece";
}

export function defaultBaseQuantity(unitType: UnitType) {
  const unit = String(unitType).toUpperCase();
  if (unit === "GRAM") return 1;
  if (unit === "KG") return 1000;
  if (unit === "ML") return 1;
  if (unit === "LITRE") return 1000;
  if (unit === "BORA") return 50000;
  if (unit === "BAG") return 25000;
  if (unit === "TIN") return 15000;
  if (unit === "BOX") return 10;
  if (unit === "CARTON") return 200;
  if (unit === "DOZEN") return 12;
  return 1;
}

export function defaultPresetsFor(baseUnit: BaseUnit) {
  if (baseUnit === "gram") return [100, 250, 500, 1000, 2000, 5000, 10000];
  if (baseUnit === "ml") return [100, 250, 500, 1000, 5000, 15000];
  return [];
}

export function formatBaseUnits(quantity: number, baseUnit: BaseUnit) {
  if (baseUnit === "gram") {
    return quantity >= 1000 ? `${Number((quantity / 1000).toFixed(3))} kg` : `${quantity} g`;
  }
  if (baseUnit === "ml") {
    return quantity >= 1000 ? `${Number((quantity / 1000).toFixed(3))} litre` : `${quantity} ml`;
  }
  return `${quantity} pcs`;
}

export function variantDraft(overrides: Partial<VariantDraft> = {}): VariantDraft {
  const unitType = overrides.unitType ?? "KG";
  const baseUnit = overrides.baseUnit ?? defaultBaseUnit(unitType);
  return {
    rowId: uid(),
    variantName: overrides.variantName ?? "Khula",
    unitType,
    baseUnit,
    baseQuantity: overrides.baseQuantity ?? defaultBaseQuantity(unitType),
    sellingMode: overrides.sellingMode ?? "khula",
    mrp: overrides.mrp ?? 0,
    purchasePrice: overrides.purchasePrice ?? 0,
    sellingPrice: overrides.sellingPrice ?? 0,
    quickSelect: overrides.quickSelect ?? false,
    expiryDate: overrides.expiryDate ?? "",
    stockInBaseUnit: overrides.stockInBaseUnit ?? 0,
    lowStockThresholdInBaseUnit: overrides.lowStockThresholdInBaseUnit ?? defaultBaseQuantity(unitType) * 5,
    presetBaseQuantities: overrides.presetBaseQuantities ?? defaultPresetsFor(baseUnit),
  };
}

export function emptyDraft(): ProductDraft {
  return {
    name: "",
    category: "General",
    brand: "",
    keywords: "",
    shortcut: "",
    sellingTypes: { khula: true, fixed: false, multiple: false },
    variants: [variantDraft({ variantName: "Khula", sellingMode: "khula", unitType: "KG", quickSelect: true })],
  };
}

export function buildTemplate(types: Record<SellingTypeKey, boolean>) {
  const rows: VariantDraft[] = [];
  if (types.khula) {
    rows.push(variantDraft({ variantName: "Khula", sellingMode: "khula", unitType: "KG", quickSelect: true }));
  }
  if (types.fixed) {
    rows.push(variantDraft({ variantName: "1kg Packet", sellingMode: "fixed", unitType: "PACKET", baseUnit: "gram", baseQuantity: 1000 }));
  }
  if (types.multiple) {
    rows.push(
      variantDraft({ variantName: "2kg Packet", sellingMode: "variant", unitType: "PACKET", baseUnit: "gram", baseQuantity: 2000 }),
      variantDraft({ variantName: "5kg Packet", sellingMode: "variant", unitType: "PACKET", baseUnit: "gram", baseQuantity: 5000, quickSelect: true }),
      variantDraft({ variantName: "10kg Bora", sellingMode: "wholesale", unitType: "BORA", baseUnit: "gram", baseQuantity: 10000 }),
      variantDraft({ variantName: "50kg Bora", sellingMode: "wholesale", unitType: "BORA", baseUnit: "gram", baseQuantity: 50000 })
    );
  }
  return rows.length ? rows : [variantDraft()];
}

export function toInput(draft: ProductDraft): ProductInput {
  return {
    name: draft.name.trim(),
    category: draft.category.trim() || "General",
    brand: draft.brand.trim() || undefined,
    shortcut: draft.shortcut.trim() || undefined,
    searchKeywords: draft.keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    variants: draft.variants.map((variant) => ({
      variantName: variant.variantName.trim() || "Default",
      unitType: variant.unitType,
      baseUnit: variant.baseUnit,
      baseQuantity: numberValue(variant.baseQuantity, 1),
      sellingMode: variant.sellingMode,
      mrp: numberValue(variant.mrp, 0),
      purchasePrice: numberValue(variant.purchasePrice, 0),
      sellingPrice: Number(variant.sellingPrice),
      quickSelect: Boolean(variant.quickSelect),
      expiryDate: variant.expiryDate || null,
      stockInBaseUnit: numberValue(variant.stockInBaseUnit, 0),
      lowStockThresholdInBaseUnit: numberValue(variant.lowStockThresholdInBaseUnit, 0),
      presetBaseQuantities: variant.presetBaseQuantities ?? [],
    })),
  };
}
