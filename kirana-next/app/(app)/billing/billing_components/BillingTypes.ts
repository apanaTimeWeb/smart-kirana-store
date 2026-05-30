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

export type BillingFilter = "all" | "khula" | "fixed" | "variant" | "wholesale" | "in" | "low";

export const MODE_LABEL: Record<string, string> = {
  khula: "Khula",
  fixed: "Fixed",
  variant: "Variant",
  wholesale: "Wholesale",
};
