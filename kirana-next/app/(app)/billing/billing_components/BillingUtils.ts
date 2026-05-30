import type { Product } from "@/lib/api";
import type { CartItem } from "./BillingTypes";

// ─── Stock / Unit Formatting ───────────────────────────────────────────────────

export function formatBaseUnits(quantity: number, baseUnit: Product["baseUnit"]) {
  if (baseUnit === "gram") {
    return quantity >= 1000 ? `${Number((quantity / 1000).toFixed(3))} kg` : `${quantity} g`;
  }
  if (baseUnit === "ml") {
    return quantity >= 1000 ? `${Number((quantity / 1000).toFixed(3))} litre` : `${quantity} ml`;
  }
  return `${quantity} pcs`;
}

export function rateUnit(product: Product) {
  if (product.sellingMode === "khula") {
    if (product.baseUnit === "gram") return "kg";
    if (product.baseUnit === "ml") return "litre";
    return "piece";
  }
  return product.unitType.toLowerCase();
}

// ─── Price Calculation ─────────────────────────────────────────────────────────

export function priceForBaseQuantity(product: Product, baseQuantity: number) {
  return Number(
    ((product.sellingPrice / Math.max(1, product.baseQuantity)) * baseQuantity).toFixed(2)
  );
}

// ─── Preset Helpers ────────────────────────────────────────────────────────────

export function uniqueNumbers(values: Array<number | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is number => Number.isFinite(value) && Number(value) > 0))
  );
}

export function defaultPresetsFor(product: Product) {
  if (product.baseUnit === "gram") return [100, 250, 500, 1000, 2000, 5000, 10000];
  if (product.baseUnit === "ml") return [100, 250, 500, 1000, 5000, 15000];
  return [1, 2, 5, 10];
}

// ─── Cart Helpers ──────────────────────────────────────────────────────────────

export function lineLabel(item: CartItem) {
  return item.quantity > 1 ? `${item.quantity} x ${item.displayQuantity}` : item.displayQuantity;
}
