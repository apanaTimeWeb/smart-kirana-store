// ─── Billing Feature Types ────────────────────────────────────────────────────

export type CartItem = {
  lineId: string;
  productId: number;
  productName: string;
  variantName: string;
  displayName: string;
  displayQuantity: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  stockDeltaBaseUnit: number;
  selectedBaseQuantity?: number;
};

export type BillData = {
  items: CartItem[];
  customerName?: string;
  customerPhone?: string;
  subtotal: number;
  discount: number;
  taxableValue: number;
  gstAmount: number;
  finalAmount: number;
  paymentMode: string;
  enableGST: boolean;
  gstRate: number;
};

export const BILLING_FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "khula", label: "Khula" },
  { id: "fixed", label: "Fixed" },
  { id: "variant", label: "Variant" },
  { id: "wholesale", label: "Bulk" },
  { id: "low", label: "Low" },
  { id: "in", label: "In Stock" },
] as const;

export type BillingFilter = typeof BILLING_FILTER_OPTIONS[number]["id"];

export const MODE_LABEL: Record<string, string> = {
  khula: "Khula",
  fixed: "Fixed",
  variant: "Variant",
  wholesale: "Wholesale",
};

export const GST_RATES = [5, 12, 18, 28] as const;

export const PAYMENT_MODES = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "khata", label: "Khata" },
] as const;

export const PRESETS_GRAM = [100, 250, 500, 1000, 2000, 5000, 10000] as const;
export const PRESETS_ML = [100, 250, 500, 1000, 5000, 15000] as const;
export const PRESETS_PCS = [1, 2, 5, 10] as const;
