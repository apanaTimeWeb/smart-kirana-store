// ─── Shared Types ─────────────────────────────────────────────────────────────

export type BaseUnit = "gram" | "ml" | "piece";

export type SellingMode = "khula" | "fixed" | "variant" | "wholesale";

export type UnitType =
  | "GRAM"
  | "KG"
  | "ML"
  | "LITRE"
  | "PIECE"
  | "PACKET"
  | "BOX"
  | "CARTON"
  | "TIN"
  | "DABBA"
  | "BORA"
  | "BAG"
  | "DOZEN"
  | "BUNDLE"
  | string;

export type Product = {
  id: number;
  productId: number;
  productName: string;
  variantName: string;
  name: string;
  barcode?: string;
  category: string;
  brand?: string;
  searchKeywords?: string[];
  shortcut?: string;
  unitType: UnitType;
  baseUnit: BaseUnit;
  baseQuantity: number;
  sellingMode: SellingMode;
  mrp?: number;
  purchasePrice: number;
  purchasePricePerKg: number;
  sellingPrice: number;
  quickSelect: boolean;
  stockInBaseUnit: number;
  lowStockThresholdInBaseUnit: number;
  currentStock: number;
  lowStockThreshold: number;
  unit: string;
  presetBaseQuantities?: number[];
  popularBaseQuantities?: number[];
  usageCount?: number;
  isActive: boolean;
  expiryDate?: string | null;
  createdAt: string;
};

export type ProductVariantInput = {
  id?: number;
  variantName: string;
  unitType: UnitType;
  baseUnit: BaseUnit;
  baseQuantity: number;
  sellingMode: SellingMode;
  mrp?: number;
  purchasePrice: number;
  sellingPrice: number;
  quickSelect: boolean;
  barcode?: string;
  stockInBaseUnit: number;
  lowStockThresholdInBaseUnit: number;
  presetBaseQuantities?: number[];
};

export type ProductInput = {
  name: string;
  category: string;
  brand?: string;
  searchKeywords?: string[];
  shortcut?: string;
  barcode?: string;
  variants: ProductVariantInput[];
};

export type PurchaseEntryInput = {
  variantId: number;
  quantity: number;
  purchasePrice?: number;
};

export type Customer = {
  id: number;
  name: string;
  phone: string;
  address?: string;
  totalDue: number;
  createdAt: string;
};

export type CustomerDetail = Customer & {
  transactions: KhataTransaction[];
};

export type KhataTransaction = {
  id: number;
  type: "credit" | "payment";
  amount: number;
  description: string;
  createdAt: string;
};

export type BillInputPaymentMode = "cash" | "upi" | "khata";

export type BillItem = {
  productId: number;
  productName?: string;
  variantName?: string;
  quantity: number;
  unit?: string;
  displayQuantity?: string;
  stockDeltaBaseUnit?: number;
  selectedBaseQuantity?: number;
  unitPrice: number;
  totalPrice: number;
  returnedQuantity?: number;
};

export type BillInput = {
  customerId?: number;
  items: BillItem[];
  totalAmount: number;
  discountAmount: number;
  taxableValue: number;
  gstAmount: number;
  finalAmount: number;
  paymentMode: BillInputPaymentMode;
  enableGST: boolean;
  gstRate: number;
};

export type Bill = {
  id: number;
  customerId?: number;
  customerName?: string;
  items: BillItem[];
  totalAmount: number;
  discountAmount: number;
  taxableValue: number;
  gstAmount: number;
  finalAmount: number;
  paymentMode: BillInputPaymentMode;
  enableGST: boolean;
  gstRate: number;
  createdAt: string;
};

export type ReturnBillItemInput = {
  productId: number;
  quantityToReturn: number;
};

export type ReturnBillInput = {
  billId: number;
  items: ReturnBillItemInput[];
};

export type DashboardSummary = {
  todaySale: number;
  todayProfit: number;
  todayOrderCount: number;
  pendingKhataAmount: number;
  pendingKhataCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentBills: {
    id: number;
    customerName?: string;
    finalAmount: number;
    paymentMode: BillInputPaymentMode;
    createdAt: string;
  }[];
  lowStockProducts: {
    id: number;
    name: string;
    category: string;
    currentStock: number;
    lowStockThreshold: number;
    unit: string;
  }[];
};

export type SalesReport = {
  totalSales: number;
  orderCount: number;
  data: { date: string; sales: number; orders: number }[];
};

export type ProfitReport = {
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  data: { date: string; revenue: number; profit: number }[];
};

export type KhataReport = {
  totalPending: number;
  customerCount: number;
  customers: { id: number; name: string; phone: string; totalDue: number }[];
};

export type AppSettings = {
  shopName: string;
  shopAddress?: string;
  shopPhone?: string;
  ownerName?: string;
  gstNumber?: string;
  gstEnabled: boolean;
  currency: string;
  lowStockThreshold: number;
  whatsappNumber?: string;
  printerName?: string;
};
