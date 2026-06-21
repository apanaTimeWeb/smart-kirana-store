import { ProductVariantInput } from "@/lib/api";
import { STOCK_STAT_ITEMS } from "../stock_constants/StockSharedConstants";

export type SellingTypeKey = "khula" | "fixed" | "multiple";
export type ProductFilter = "all" | "in" | "low" | "out" | "khula" | "wholesale" | "quick" | "expiring";

/** Controls how the expiry field behaves in the product creator. */
export type ExpiryRule = "required" | "never";

/** First-step discriminator in the Add Product dialog. */
export type ItemKind = "branded" | "loose";

export type VariantDraft = ProductVariantInput & {
  rowId: string;
  expiryDate?: string;
  shortcut?: string;
};

export type ProductDraft = {
  name: string;
  category: string;
  brand: string;
  keywords: string;
  shortcut: string;
  sellingTypes: Record<SellingTypeKey, boolean>;
  variants: VariantDraft[];
};

// Derived from STOCK_STAT_ITEMS — type-safe stat card definition
export type StockStatItem = (typeof STOCK_STAT_ITEMS)[number];

// Shape of the Product Creator dialog's local form state
// Used by StockProductCreatorContext.tsx
export type StockProductCreatorFormState = {
  name: string;
  itemKind: ItemKind;       // "branded" or "loose" — first step in creator
  categoryId: string;       // Selected category id from CategoryMaster
  unitType: string;
  buyPrice: number | "";
  sellPrice: number | "";
  brand: string;
  keywords: string;
  shortcut: string;
  mrp: number | "";
  initialStock: number | "";
  lowStockAlert: number | "";
  expiryDate: string;
  quickSelect: boolean;
  extraVariants: VariantDraft[];
  variantNameOverride: string | null;
};
