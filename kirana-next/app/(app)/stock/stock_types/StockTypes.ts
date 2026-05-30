import { ProductVariantInput } from "@/lib/api";
import { STOCK_STAT_ITEMS } from "../stock_constants/StockSharedConstants";

export type SellingTypeKey = "khula" | "fixed" | "multiple";
export type ProductFilter = "all" | "in" | "low" | "out" | "khula" | "wholesale" | "quick" | "expiring";

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
  unitType: string;
  buyPrice: number | "";
  sellPrice: number | "";
  category: string;
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
