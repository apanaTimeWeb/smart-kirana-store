// StockDraftTemplates.ts
// ─────────────────────────────────────────────────────────────────────────────
// Business logic for constructing default ProductDraft and VariantDraft shapes.
// Extracted from StockUtils.ts to keep utility functions pure and separate
// template-builder logic that may evolve independently.
//
// FUTURE: emptyDraft and buildTemplate will be replaced by API calls that
// return server-defined product templates. Only THIS file needs to change.
// ─────────────────────────────────────────────────────────────────────────────

import { SellingTypeKey, VariantDraft, ProductDraft } from "../stock_types/StockTypes";
import { variantDraft } from "./StockUtils";

/** Returns a blank ProductDraft with a single Khula variant — used as the
 *  initial state when the user opens the "Naya Product" creator. */
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

/** Builds a set of VariantDraft rows from a selling type selection.
 *  Used by the legacy multi-step creator flow (if re-enabled). */
export function buildTemplate(types: Record<SellingTypeKey, boolean>): VariantDraft[] {
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
