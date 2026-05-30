import { BaseUnit, SellingMode, UnitType } from "@/lib/api";

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
  khula: "bg-[var(--stock-mode-khula-bg)] text-[var(--stock-mode-khula-text)] border-[var(--stock-mode-khula-border)]",
  fixed: "bg-[var(--stock-mode-fixed-bg)] text-[var(--stock-mode-fixed-text)] border-[var(--stock-mode-fixed-border)]",
  variant: "bg-[var(--stock-mode-variant-bg)] text-[var(--stock-mode-variant-text)] border-[var(--stock-mode-variant-border)]",
  wholesale: "bg-[var(--stock-mode-wholesale-bg)] text-[var(--stock-mode-wholesale-text)] border-[var(--stock-mode-wholesale-border)]",
};

export type UnitConfig = {
  label: string;
  baseUnit: BaseUnit;
  baseQuantity: number;
  sellingMode: SellingMode;
  variantNameSuggestion: string;
  group: "weight" | "liquid" | "piece" | "wholesale";
  description: string;
};

export const UNIT_CONFIG: Record<string, UnitConfig> = {
  GRAM: { label: "Gram (g)", baseUnit: "gram", baseQuantity: 1, sellingMode: "khula", variantNameSuggestion: "Khula", group: "weight", description: "Sold loose by gram" },
  KG: { label: "Kilogram (kg)", baseUnit: "gram", baseQuantity: 1000, sellingMode: "khula", variantNameSuggestion: "Khula", group: "weight", description: "Sold loose by kg (stored as grams)" },
  ML: { label: "Millilitre (ml)", baseUnit: "ml", baseQuantity: 1, sellingMode: "khula", variantNameSuggestion: "Khula", group: "liquid", description: "Sold loose by ml" },
  LITRE: { label: "Litre (L)", baseUnit: "ml", baseQuantity: 1000, sellingMode: "khula", variantNameSuggestion: "Khula", group: "liquid", description: "Sold loose by litre (stored as ml)" },
  PIECE: { label: "Piece (pc)", baseUnit: "piece", baseQuantity: 1, sellingMode: "fixed", variantNameSuggestion: "Default", group: "piece", description: "1 piece = 1 unit sold" },
  PACKET: { label: "Packet", baseUnit: "piece", baseQuantity: 1, sellingMode: "fixed", variantNameSuggestion: "Packet", group: "piece", description: "Fixed packet — 1 packet sold as whole" },
  POUCH: { label: "Pouch", baseUnit: "piece", baseQuantity: 1, sellingMode: "fixed", variantNameSuggestion: "Pouch", group: "piece", description: "Fixed pouch — 1 pouch sold as whole" },
  BOTTLE: { label: "Bottle", baseUnit: "piece", baseQuantity: 1, sellingMode: "fixed", variantNameSuggestion: "Bottle", group: "piece", description: "Fixed bottle — 1 bottle sold as whole" },
  DOZEN: { label: "Dozen (12 pcs)", baseUnit: "piece", baseQuantity: 12, sellingMode: "variant", variantNameSuggestion: "Dozen", group: "piece", description: "1 dozen = 12 pieces" },
  BOX: { label: "Box", baseUnit: "piece", baseQuantity: 10, sellingMode: "variant", variantNameSuggestion: "Box", group: "piece", description: "1 box = 10 pieces" },
  TIN: { label: "Tin", baseUnit: "ml", baseQuantity: 15000, sellingMode: "wholesale", variantNameSuggestion: "Tin", group: "wholesale", description: "1 tin = 15 litres (stored as ml)" },
  DABBA: { label: "Dabba", baseUnit: "piece", baseQuantity: 1, sellingMode: "wholesale", variantNameSuggestion: "Dabba", group: "wholesale", description: "1 dabba sold as whole unit" },
  CARTON: { label: "Carton", baseUnit: "piece", baseQuantity: 200, sellingMode: "wholesale", variantNameSuggestion: "Carton", group: "wholesale", description: "1 carton = 200 pieces" },
  BORA: { label: "Bora (50 kg)", baseUnit: "gram", baseQuantity: 50000, sellingMode: "wholesale", variantNameSuggestion: "Bora", group: "wholesale", description: "1 bora = 50 kg (stored as grams)" },
  BAG: { label: "Bag (25 kg)", baseUnit: "gram", baseQuantity: 25000, sellingMode: "wholesale", variantNameSuggestion: "Bag", group: "wholesale", description: "1 bag = 25 kg (stored as grams)" },
  BUNDLE: { label: "Bundle", baseUnit: "piece", baseQuantity: 1, sellingMode: "wholesale", variantNameSuggestion: "Bundle", group: "wholesale", description: "1 bundle sold as whole" },
};

export const UNIT_GROUPS: { group: string; label: string; units: string[] }[] = [
  { group: "weight", label: "⚖️ Weight", units: ["GRAM", "KG"] },
  { group: "liquid", label: "🫙 Liquid", units: ["ML", "LITRE"] },
  { group: "piece", label: "📦 Piece / Pack", units: ["PIECE", "PACKET", "POUCH", "BOTTLE", "DOZEN", "BOX"] },
  { group: "wholesale", label: "🏭 Wholesale / Bulk", units: ["TIN", "DABBA", "CARTON", "BORA", "BAG", "BUNDLE"] },
];

export const STOCK_FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "out", label: "Out" },
  { id: "low", label: "Low" },
  { id: "in", label: "In Stock" },
  { id: "khula", label: "Khula" },
  { id: "wholesale", label: "Bora/Wholesale" },
  { id: "quick", label: "Quick" },
  { id: "expiring", label: "Expiring" },
] as const;
