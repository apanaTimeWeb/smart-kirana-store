import { ProductVariantInput } from "@/lib/api";

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
