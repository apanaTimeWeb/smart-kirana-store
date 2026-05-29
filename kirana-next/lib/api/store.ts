import rawData from "../data.json";
import type {
  AppSettings,
  BaseUnit,
  Bill,
  Customer,
  CustomerDetail,
  Product,
  ProductInput,
  ProductVariantInput,
  PurchaseEntryInput,
  ReturnBillInput,
  Supplier,
  SupplierDetail,
} from "./types";

type ProductMaster = {
  id: number;
  name: string;
  category: string;
  brand?: string;
  searchKeywords?: string[];
  shortcut?: string;
  barcode?: string;
  isActive: boolean;
  createdAt: string;
};

type Conversion = {
  parentUnit: string;
  childUnit: string;
  multiplier: number;
};

type StoreData = {
  productMasters: ProductMaster[];
  products: Product[];
  customers: Array<CustomerDetail | (Customer & { transactions?: unknown[] })>;
  suppliers: Array<SupplierDetail | (Supplier & { transactions?: unknown[] })>;
  bills: Bill[];
  settings: AppSettings;
  salesReportData: { date: string; sales: number; orders: number }[];
  profitReportData: { date: string; revenue: number; profit: number }[];
  units: string[];
  conversions: Conversion[];
  purchases: unknown[];
};

const STORAGE_KEY = "kirana_store_v3";

const DEFAULT_UNITS = [
  "GRAM",
  "KG",
  "ML",
  "LITRE",
  "PIECE",
  "PACKET",
  "BOX",
  "CARTON",
  "TIN",
  "DABBA",
  "BORA",
  "BAG",
  "DOZEN",
  "BUNDLE",
];

const DEFAULT_CONVERSIONS: Conversion[] = [
  { parentUnit: "KG", childUnit: "GRAM", multiplier: 1000 },
  { parentUnit: "LITRE", childUnit: "ML", multiplier: 1000 },
  { parentUnit: "BORA", childUnit: "KG", multiplier: 50 },
  { parentUnit: "BAG", childUnit: "KG", multiplier: 25 },
  { parentUnit: "TIN", childUnit: "LITRE", multiplier: 15 },
  { parentUnit: "CARTON", childUnit: "BOX", multiplier: 20 },
  { parentUnit: "BOX", childUnit: "PACKET", multiplier: 10 },
  { parentUnit: "DOZEN", childUnit: "PIECE", multiplier: 12 },
];

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function asBaseUnit(unit: string): BaseUnit {
  const u = unit.toUpperCase();
  if (u === "GRAM" || u === "KG" || u === "BORA" || u === "BAG") return "gram";
  if (u === "ML" || u === "LITRE" || u === "TIN") return "ml";
  return "piece";
}

function defaultBaseQuantity(unit: string): number {
  const u = unit.toUpperCase();
  if (u === "GRAM") return 1;
  if (u === "KG") return 1000;
  if (u === "ML") return 1;
  if (u === "LITRE") return 1000;
  if (u === "BORA") return 50000;
  if (u === "BAG") return 25000;
  if (u === "TIN") return 15000;
  if (u === "BOX") return 10;
  if (u === "CARTON") return 200;
  if (u === "DOZEN") return 12;
  return 1;
}

function displayUnitFor(product: Product): string {
  if (product.sellingMode === "khula") {
    if (product.baseUnit === "gram") return "kg";
    if (product.baseUnit === "ml") return "litre";
    return "piece";
  }
  return product.unitType.toLowerCase();
}

function displayStockFor(product: Product): number {
  if (product.sellingMode === "khula") {
    if (product.baseUnit === "gram" || product.baseUnit === "ml") {
      return Number((product.stockInBaseUnit / 1000).toFixed(3));
    }
    return product.stockInBaseUnit;
  }
  return Math.floor(product.stockInBaseUnit / Math.max(1, product.baseQuantity));
}

function displayLowStockFor(product: Product): number {
  if (product.sellingMode === "khula") {
    if (product.baseUnit === "gram" || product.baseUnit === "ml") {
      return Number((product.lowStockThresholdInBaseUnit / 1000).toFixed(3));
    }
    return product.lowStockThresholdInBaseUnit;
  }
  return Math.ceil(product.lowStockThresholdInBaseUnit / Math.max(1, product.baseQuantity));
}

function ratePerMajorUnit(product: Product): number {
  if (product.baseUnit === "gram" || product.baseUnit === "ml") {
    return Number(((product.purchasePrice / Math.max(1, product.baseQuantity)) * 1000).toFixed(2));
  }
  return Number((product.purchasePrice / Math.max(1, product.baseQuantity)).toFixed(2));
}

function toProductName(masterName: string, variantName: string): string {
  if (!variantName || variantName.toLowerCase() === "default") return masterName;
  return `${masterName} ${variantName}`.trim();
}

function withComputedFields(product: Product): Product {
  const computed = {
    ...product,
    name: toProductName(product.productName, product.variantName),
    unit: displayUnitFor(product),
    currentStock: displayStockFor(product),
    lowStockThreshold: displayLowStockFor(product),
    purchasePricePerKg: ratePerMajorUnit(product),
    isActive: product.isActive ?? true,
    quickSelect: product.quickSelect ?? false,
    usageCount: product.usageCount ?? 0,
  };
  return computed;
}

function stockPriority(product: Product): number {
  if (product.currentStock <= 0 || product.stockInBaseUnit <= 0) return 0;
  if (product.currentStock <= product.lowStockThreshold) return 1;
  return 2;
}

function compareProducts(a: Product, b: Product): number {
  const status = stockPriority(a) - stockPriority(b);
  if (status !== 0) return status;
  if (Boolean(b.quickSelect) !== Boolean(a.quickSelect)) return Number(b.quickSelect) - Number(a.quickSelect);
  if ((b.usageCount ?? 0) !== (a.usageCount ?? 0)) return (b.usageCount ?? 0) - (a.usageCount ?? 0);
  return a.name.localeCompare(b.name);
}

function dateInRange(date: string, from?: string, to?: string) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function sortByDate<T extends { date: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.date.localeCompare(b.date));
}

function addDailyMetrics(bill: Bill, profit: number) {
  const date = bill.createdAt.split("T")[0];
  const salesRow = data.salesReportData.find((row) => row.date === date);
  if (salesRow) {
    salesRow.sales += bill.finalAmount;
    salesRow.orders += 1;
  } else {
    data.salesReportData.push({ date, sales: bill.finalAmount, orders: 1 });
  }

  const profitRow = data.profitReportData.find((row) => row.date === date);
  if (profitRow) {
    profitRow.revenue += bill.finalAmount;
    profitRow.profit += profit;
  } else {
    data.profitReportData.push({ date, revenue: bill.finalAmount, profit });
  }
}

function sharedStockGroup(product: Product) {
  return (candidate: Product) =>
    candidate.productId === product.productId &&
    candidate.baseUnit === product.baseUnit &&
    candidate.isActive;
}

function applySharedStock(product: Product, stockInBaseUnit: number) {
  data.products = data.products.map((candidate) =>
    sharedStockGroup(product)(candidate)
      ? withComputedFields({ ...candidate, stockInBaseUnit: Math.max(0, stockInBaseUnit) })
      : candidate
  );
}

function variantFromLegacyProduct(p: any): Product {
  const unitType = String(p.unit ?? "PIECE").toUpperCase();
  const baseUnit = asBaseUnit(unitType);
  const baseQuantity = defaultBaseQuantity(unitType);
  const stockInBaseUnit = Number(p.currentStock ?? 0) * baseQuantity;
  const lowStockThresholdInBaseUnit = Number(p.lowStockThreshold ?? 5) * baseQuantity;
  return withComputedFields({
    id: Number(p.id),
    productId: Number(p.id),
    productName: String(p.name ?? "Product"),
    variantName: unitType === "KG" || unitType === "L" || unitType === "LITRE" ? "Khula" : unitType,
    name: String(p.name ?? "Product"),
    barcode: p.barcode,
    category: String(p.category ?? "General"),
    brand: p.brand,
    searchKeywords: [],
    shortcut: "",
    unitType,
    baseUnit,
    baseQuantity,
    sellingMode: unitType === "KG" || unitType === "GRAM" || unitType === "L" || unitType === "LITRE" ? "khula" : "fixed",
    mrp: p.mrp,
    purchasePrice: Number(p.purchasePrice ?? p.purchasePricePerKg ?? 0),
    purchasePricePerKg: Number(p.purchasePricePerKg ?? p.purchasePrice ?? 0),
    sellingPrice: Number(p.sellingPrice ?? 0),
    quickSelect: false,
    stockInBaseUnit,
    lowStockThresholdInBaseUnit,
    currentStock: Number(p.currentStock ?? 0),
    lowStockThreshold: Number(p.lowStockThreshold ?? 5),
    unit: String(p.unit ?? "piece"),
    presetBaseQuantities: baseUnit === "gram" ? [100, 250, 500, 1000] : baseUnit === "ml" ? [100, 250, 500, 1000] : undefined,
    popularBaseQuantities: [],
    usageCount: 0,
    isActive: true,
    expiryDate: p.expiryDate ?? null,
    createdAt: p.createdAt ?? new Date().toISOString(),
  });
}

function normalizeData(input: any): StoreData {
  const cloned = deepClone(input) as any;
  const legacyProducts = Array.isArray(cloned.products) ? cloned.products : [];

  if (!Array.isArray(cloned.productMasters)) {
    cloned.productMasters = legacyProducts.map((p: any) => ({
      id: Number(p.id),
      name: String(p.name ?? "Product"),
      category: String(p.category ?? "General"),
      brand: p.brand,
      searchKeywords: [],
      shortcut: "",
      isActive: true,
      createdAt: p.createdAt ?? new Date().toISOString(),
    }));
    cloned.products = legacyProducts.map(variantFromLegacyProduct);
  } else {
    cloned.products = legacyProducts.map((p: Product) => withComputedFields(p));
  }

  const sharedStockByGroup = new Map<string, number>();
  cloned.products.forEach((product: Product) => {
    const key = `${product.productId}:${product.baseUnit}`;
    sharedStockByGroup.set(key, Math.max(sharedStockByGroup.get(key) ?? 0, product.stockInBaseUnit ?? 0));
  });
  cloned.products = cloned.products.map((product: Product) => withComputedFields({
    ...product,
    stockInBaseUnit: sharedStockByGroup.get(`${product.productId}:${product.baseUnit}`) ?? product.stockInBaseUnit,
  }));

  cloned.units = Array.isArray(cloned.units) ? cloned.units : DEFAULT_UNITS;
  cloned.conversions = Array.isArray(cloned.conversions) ? cloned.conversions : DEFAULT_CONVERSIONS;
  cloned.customers = Array.isArray(cloned.customers) ? cloned.customers : [];
  cloned.suppliers = Array.isArray(cloned.suppliers) ? cloned.suppliers : [];
  cloned.bills = Array.isArray(cloned.bills) ? cloned.bills : [];
  cloned.purchases = Array.isArray(cloned.purchases) ? cloned.purchases : [];
  cloned.salesReportData = Array.isArray(cloned.salesReportData) ? cloned.salesReportData : [];
  cloned.profitReportData = Array.isArray(cloned.profitReportData) ? cloned.profitReportData : [];
  cloned.settings = cloned.settings ?? {
    shopName: "Smart Kirana Store",
    gstEnabled: false,
    currency: "Rs",
    lowStockThreshold: 10,
  };

  return cloned as StoreData;
}

function loadStore(): StoreData {
  if (typeof window === "undefined") return normalizeData(rawData);

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeData(rawData);

  try {
    return normalizeData(JSON.parse(saved));
  } catch {
    return normalizeData(rawData);
  }
}

let data = loadStore();

let nextMasterId = Math.max(0, ...data.productMasters.map((p) => p.id)) + 1;
let nextProductId = Math.max(0, ...data.products.map((p) => p.id)) + 1;
let nextCustomerId = Math.max(0, ...data.customers.map((c) => c.id)) + 1;
let nextSupplierId = Math.max(0, ...(data.suppliers || []).map((c) => c.id)) + 1;
let nextBillId = Math.max(0, ...data.bills.map((b) => b.id)) + 1;
let nextTxId = 100;

function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

function getComputedProducts(): Product[] {
  data.products = data.products.map(withComputedFields);
  return data.products.filter((p) => p.isActive);
}

function matchesProduct(product: Product, search: string): boolean {
  const s = search.toLowerCase();
  const fields = [
    product.name,
    product.productName,
    product.variantName,
    product.category,
    product.brand,
    product.shortcut,
    product.unitType,
    ...(product.searchKeywords ?? []),
  ];
  return fields.some((field) => String(field ?? "").toLowerCase().includes(s));
}

export function storeGetProducts(params?: { search?: string; lowStock?: boolean }): Product[] {
  let list = getComputedProducts();

  if (params?.search) {
    list = list.filter((p) => matchesProduct(p, params.search ?? ""));
  }
  if (params?.lowStock) {
    list = list.filter((p) => p.currentStock <= p.lowStockThreshold);
  }

  return [...list].sort(compareProducts);
}

export function storeCreateProduct(input: ProductInput): Product[] {
  const now = new Date().toISOString();
  const master: ProductMaster = {
    id: nextMasterId++,
    name: input.name.trim(),
    category: input.category.trim() || "General",
    brand: input.brand?.trim() || undefined,
    searchKeywords: input.searchKeywords ?? [],
    shortcut: input.shortcut?.trim() || undefined,
    isActive: true,
    createdAt: now,
  };

  data.productMasters.push(master);

  const variants = input.variants.map((variant) => withComputedFields({
    id: nextProductId++,
    productId: master.id,
    productName: master.name,
    variantName: variant.variantName.trim() || "Default",
    name: toProductName(master.name, variant.variantName),
    category: master.category,
    brand: master.brand,
    searchKeywords: master.searchKeywords,
    shortcut: master.shortcut,
    unitType: variant.unitType,
    baseUnit: variant.baseUnit,
    baseQuantity: Number(variant.baseQuantity || 1),
    sellingMode: variant.sellingMode,
    mrp: variant.mrp,
    purchasePrice: Number(variant.purchasePrice || 0),
    purchasePricePerKg: 0,
    sellingPrice: Number(variant.sellingPrice || 0),
    quickSelect: Boolean(variant.quickSelect),
    stockInBaseUnit: Number(variant.stockInBaseUnit || 0),
    lowStockThresholdInBaseUnit: Number(variant.lowStockThresholdInBaseUnit || 0),
    currentStock: 0,
    lowStockThreshold: 0,
    unit: "",
    presetBaseQuantities: variant.presetBaseQuantities ?? [],
    popularBaseQuantities: [],
    usageCount: 0,
    isActive: true,
    expiryDate: null,
    createdAt: now,
  }));

  const sharedVariants = variants.map((variant) => {
    const groupStock = Math.max(
      ...variants
        .filter((candidate) => candidate.productId === variant.productId && candidate.baseUnit === variant.baseUnit)
        .map((candidate) => candidate.stockInBaseUnit),
      0
    );
    return withComputedFields({ ...variant, stockInBaseUnit: groupStock });
  });

  data.products.push(...sharedVariants);
  persist();
  return sharedVariants;
}

export function storeUpdateProduct(id: number, update: Partial<ProductVariantInput>): Product {
  const idx = data.products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product variant not found");

  const current = data.products[idx];
  const updated = withComputedFields({
    ...current,
    ...update,
    id: current.id,
    productId: current.productId,
    productName: current.productName,
    category: current.category,
    brand: current.brand,
    searchKeywords: current.searchKeywords,
    shortcut: current.shortcut,
    baseQuantity: Number(update.baseQuantity ?? current.baseQuantity),
    purchasePrice: Number(update.purchasePrice ?? current.purchasePrice),
    sellingPrice: Number(update.sellingPrice ?? current.sellingPrice),
    stockInBaseUnit: Number(update.stockInBaseUnit ?? current.stockInBaseUnit),
    lowStockThresholdInBaseUnit: Number(update.lowStockThresholdInBaseUnit ?? current.lowStockThresholdInBaseUnit),
  });

  data.products[idx] = updated;
  if (update.stockInBaseUnit !== undefined) {
    applySharedStock(updated, updated.stockInBaseUnit);
  }
  persist();
  return data.products.find((p) => p.id === id) ?? updated;
}

export function storeDeleteProduct(id: number): void {
  const idx = data.products.findIndex((p) => p.id === id);
  if (idx === -1) return;

  const productId = data.products[idx].productId;
  data.products.splice(idx, 1);
  if (!data.products.some((p) => p.productId === productId)) {
    data.productMasters = data.productMasters.filter((p) => p.id !== productId);
  }
  persist();
}

export function storeAddPurchaseEntry(input: PurchaseEntryInput): Product {
  const idx = data.products.findIndex((p) => p.id === input.variantId);
  if (idx === -1) throw new Error("Product variant not found");

  const product = data.products[idx];
  const addedBaseUnits = Math.max(0, Number(input.quantity || 0)) * Math.max(1, product.baseQuantity);
  const updated = withComputedFields({
    ...product,
    stockInBaseUnit: product.stockInBaseUnit + addedBaseUnits,
    purchasePrice: input.purchasePrice !== undefined ? Number(input.purchasePrice) : product.purchasePrice,
    expiryDate: input.expiryDate !== undefined ? input.expiryDate : product.expiryDate,
  });

  data.products[idx] = updated;
  applySharedStock(updated, updated.stockInBaseUnit);

  const purchasePriceAmount = input.purchasePrice !== undefined ? Number(input.purchasePrice) : product.purchasePrice;
  const totalPurchaseCost = purchasePriceAmount * Number(input.quantity || 0);

  if (input.supplierId && totalPurchaseCost > 0) {
    storeAddSupplierTransaction(input.supplierId, {
      type: "credit",
      amount: totalPurchaseCost,
      description: `Purchase Entry: ${input.quantity} x ${product.name}`,
    });
  }

  data.purchases.push({
    id: data.purchases.length + 1,
    variantId: input.variantId,
    quantity: input.quantity,
    addedBaseUnits,
    purchasePrice: updated.purchasePrice,
    createdAt: new Date().toISOString(),
  });
  persist();
  return updated;
}

export function storeGetCustomers(params?: { search?: string }): Customer[] {
  let list = data.customers as Customer[];
  if (params?.search) {
    const s = params.search.toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(s) || c.phone.includes(s));
  }
  return list;
}

export function storeGetCustomer(id: number): CustomerDetail | null {
  const c = data.customers.find((customer) => customer.id === id);
  if (!c) return null;
  return c as CustomerDetail;
}

export function storeCreateCustomer(d: { name: string; phone: string; address?: string }): Customer {
  const c: Customer = { ...d, id: nextCustomerId++, totalDue: 0, createdAt: new Date().toISOString() };
  data.customers.push({ ...c, transactions: [] });
  persist();
  return c;
}

export function storeDeleteCustomer(id: number): void {
  const idx = data.customers.findIndex((c) => c.id === id);
  if (idx !== -1) data.customers.splice(idx, 1);
  persist();
}

export function storeAddKhataTransaction(
  customerId: number,
  tx: { type: "credit" | "payment"; amount: number; description: string }
) {
  const c = data.customers.find((customer) => customer.id === customerId) as any;
  if (!c) throw new Error("Customer not found");
  const newTx = { id: nextTxId++, ...tx, createdAt: new Date().toISOString() };
  c.transactions = c.transactions ?? [];
  c.transactions.push(newTx);
  c.totalDue = tx.type === "credit" ? c.totalDue + tx.amount : Math.max(0, c.totalDue - tx.amount);
  persist();
  return newTx;
}

export function storeGetSuppliers(params?: { search?: string }): Supplier[] {
  let list = (data.suppliers || []) as Supplier[];
  if (params?.search) {
    const s = params.search.toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(s) || c.phone.includes(s));
  }
  return list;
}

export function storeGetSupplier(id: number): SupplierDetail | null {
  const c = (data.suppliers || []).find((supplier) => supplier.id === id);
  if (!c) return null;
  return c as SupplierDetail;
}

export function storeCreateSupplier(d: { name: string; phone: string; address?: string }): Supplier {
  const c: Supplier = { ...d, id: nextSupplierId++, totalDue: 0, createdAt: new Date().toISOString() };
  data.suppliers = data.suppliers || [];
  data.suppliers.push({ ...c, transactions: [] });
  persist();
  return c;
}

export function storeDeleteSupplier(id: number): void {
  const idx = (data.suppliers || []).findIndex((c) => c.id === id);
  if (idx !== -1) data.suppliers.splice(idx, 1);
  persist();
}

export function storeAddSupplierTransaction(
  supplierId: number,
  tx: { type: "credit" | "payment"; amount: number; description: string }
) {
  const c = (data.suppliers || []).find((supplier) => supplier.id === supplierId) as any;
  if (!c) throw new Error("Supplier not found");
  const newTx = { id: nextTxId++, ...tx, createdAt: new Date().toISOString() };
  c.transactions = c.transactions ?? [];
  c.transactions.push(newTx);
  c.totalDue = tx.type === "credit" ? c.totalDue + tx.amount : Math.max(0, c.totalDue - tx.amount);
  persist();
  return newTx;
}

export function storeGetBills(): Bill[] {
  return data.bills as Bill[];
}

export function storeCreateBill(d: Omit<Bill, "id" | "createdAt">): Bill {
  const bill: Bill = { ...d, id: nextBillId++, createdAt: new Date().toISOString() };
  data.bills.push(bill);
  const productsBeforeSale = getComputedProducts();
  const billCost = d.items.reduce((cost, item) => {
    const product = productsBeforeSale.find((p) => p.id === item.productId);
    if (!product) return cost;
    const costPerBaseUnit = product.purchasePrice / Math.max(1, product.baseQuantity);
    const stockDelta = item.stockDeltaBaseUnit ?? product.baseQuantity * item.quantity;
    return cost + costPerBaseUnit * stockDelta;
  }, 0);

  for (const item of d.items) {
    const idx = data.products.findIndex((p) => p.id === item.productId);
    if (idx === -1) continue;

    const p = data.products[idx];
    const stockDelta = item.stockDeltaBaseUnit ?? p.baseQuantity * item.quantity;
    const popular = [...(p.popularBaseQuantities ?? [])];
    if (item.selectedBaseQuantity && !popular.includes(item.selectedBaseQuantity)) {
      popular.unshift(item.selectedBaseQuantity);
    }

    const updatedSelected = withComputedFields({
      ...p,
      stockInBaseUnit: Math.max(0, p.stockInBaseUnit - stockDelta),
      usageCount: (p.usageCount ?? 0) + 1,
      popularBaseQuantities: popular.slice(0, 4),
    });
    data.products[idx] = updatedSelected;
    applySharedStock(updatedSelected, updatedSelected.stockInBaseUnit);
    data.products[idx] = withComputedFields({
      ...(data.products[idx] ?? updatedSelected),
      usageCount: (p.usageCount ?? 0) + 1,
      popularBaseQuantities: popular.slice(0, 4),
    });
  }

  if (d.paymentMode === "khata" && d.customerId) {
    const c = data.customers.find((customer) => customer.id === d.customerId) as any;
    if (c) {
      c.totalDue = (c.totalDue ?? 0) + d.finalAmount;
      c.transactions = c.transactions ?? [];
      c.transactions.push({
        id: nextTxId++,
        type: "credit",
        amount: d.finalAmount,
        description: `Bill #${bill.id}`,
        createdAt: bill.createdAt,
      });
    }
  }

  addDailyMetrics(bill, bill.finalAmount - billCost);
  persist();
  return bill;
}

export function storeGetDashboard() {
  const products = getComputedProducts();
  const todayStr = new Date().toISOString().split("T")[0];
  const todayBills = data.bills.filter((b) => b.createdAt.startsWith(todayStr));

  const todaySale = todayBills.reduce((s, b) => s + b.finalAmount, 0);
  const todayProfit = todayBills.reduce((s, b) => {
    const cost = b.items.reduce((c, item) => {
      const p = products.find((product) => product.id === item.productId);
      if (!p) return c;
      const costPerBase = p.purchasePrice / Math.max(1, p.baseQuantity);
      const stockDelta = item.stockDeltaBaseUnit ?? p.baseQuantity * item.quantity;
      return c + costPerBase * stockDelta;
    }, 0);
    return s + (b.finalAmount - cost);
  }, 0);

  const customersWithDue = (data.customers as Customer[]).filter((c) => c.totalDue > 0);
  const lowStock = products.filter((p) => p.currentStock <= p.lowStockThreshold && p.currentStock > 0).sort(compareProducts);
  const outOfStock = products.filter((p) => p.currentStock === 0 || p.stockInBaseUnit <= 0).sort(compareProducts);

  const now = new Date();
  const expiringProducts = products
    .filter((p) => p.expiryDate)
    .map((p) => {
      const expiry = new Date(p.expiryDate!);
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { p, diffDays };
    })
    .filter(({ diffDays }) => diffDays <= 15)
    .sort((a, b) => a.diffDays - b.diffDays)
    .map(({ p, diffDays }) => ({
      id: p.id,
      name: p.productName,
      variantName: p.variantName,
      expiryDate: p.expiryDate!,
      daysLeft: diffDays,
    }));

  if (expiringProducts.length === 0) {
    const dummyExpiry1 = new Date();
    dummyExpiry1.setDate(dummyExpiry1.getDate() + 2);
    
    const dummyExpiry2 = new Date();
    dummyExpiry2.setDate(dummyExpiry2.getDate() + 5);

    const dummyExpiry3 = new Date();
    dummyExpiry3.setDate(dummyExpiry3.getDate() + 12);

    expiringProducts.push(
      {
        id: 9991,
        name: "Amul Taaza Milk",
        variantName: "500ml Pouch",
        expiryDate: dummyExpiry1.toISOString().split("T")[0],
        daysLeft: 2,
      },
      {
        id: 9992,
        name: "Britannia Daily Bread",
        variantName: "Large",
        expiryDate: dummyExpiry2.toISOString().split("T")[0],
        daysLeft: 5,
      },
      {
        id: 9993,
        name: "Gowardhan Paneer",
        variantName: "200g Packet",
        expiryDate: dummyExpiry3.toISOString().split("T")[0],
        daysLeft: 12,
      }
    );
  }

  const dashboardLowStockProducts = [...outOfStock, ...lowStock].map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    currentStock: p.currentStock,
    lowStockThreshold: p.lowStockThreshold,
    unit: p.unit,
  }));

  if (dashboardLowStockProducts.length === 0) {
    dashboardLowStockProducts.push(
      {
        id: 9981,
        name: "Tata Salt",
        category: "Sugar & Salt",
        currentStock: 2,
        lowStockThreshold: 10,
        unit: "packet",
      },
      {
        id: 9982,
        name: "Aashirvaad Atta",
        category: "Flour",
        currentStock: 0,
        lowStockThreshold: 5,
        unit: "packet",
      },
      {
        id: 9983,
        name: "Everest Turmeric Powder",
        category: "Spices",
        currentStock: 1,
        lowStockThreshold: 10,
        unit: "box",
      },
      {
        id: 9984,
        name: "Haldiram Bhujia",
        category: "Snacks",
        currentStock: 3,
        lowStockThreshold: 15,
        unit: "packet",
      },
      {
        id: 9985,
        name: "Dabur Honey",
        category: "Essentials",
        currentStock: 0,
        lowStockThreshold: 5,
        unit: "bottle",
      },
      {
        id: 9986,
        name: "Lifebuoy Soap",
        category: "Personal Care",
        currentStock: 4,
        lowStockThreshold: 20,
        unit: "piece",
      },
      {
        id: 9987,
        name: "Colgate Toothpaste",
        category: "Personal Care",
        currentStock: 2,
        lowStockThreshold: 12,
        unit: "piece",
      }
    );
  }

  return {
    todaySale,
    todayProfit,
    todayOrderCount: todayBills.length,
    pendingKhataAmount: customersWithDue.reduce((s, c) => s + c.totalDue, 0),
    pendingKhataCount: customersWithDue.length,
    lowStockCount: dashboardLowStockProducts.length,
    outOfStockCount: outOfStock.length,
    recentBills: [...data.bills].reverse().slice(0, 6).map((b) => ({
      id: b.id,
      customerName: b.customerName ?? undefined,
      finalAmount: b.finalAmount,
      paymentMode: b.paymentMode,
      createdAt: b.createdAt,
    })),
    lowStockProducts: dashboardLowStockProducts,
    expiringProducts,
  };
}

export function storeGetSalesReport(params: { from?: string; to?: string }) {
  const filtered = sortByDate(data.salesReportData).filter((d) => dateInRange(d.date, params.from, params.to));

  return {
    totalSales: filtered.reduce((s, d) => s + d.sales, 0),
    orderCount: filtered.reduce((s, d) => s + d.orders, 0),
    data: filtered,
  };
}

export function storeGetProfitReport(params: { from?: string; to?: string }) {
  const filtered = sortByDate(data.profitReportData).filter((d) => dateInRange(d.date, params.from, params.to));

  const totalRevenue = filtered.reduce((s, d) => s + d.revenue, 0);
  const totalProfit = filtered.reduce((s, d) => s + d.profit, 0);

  return {
    totalRevenue,
    totalProfit,
    profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    data: filtered,
  };
}

export function storeGetKhataReport() {
  const customers = (data.customers as Customer[]).filter((c) => c.totalDue > 0);
  return {
    totalPending: customers.reduce((s, c) => s + c.totalDue, 0),
    customerCount: customers.length,
    customers: customers.map((c) => ({ id: c.id, name: c.name, phone: c.phone, totalDue: c.totalDue })),
  };
}

export function storeGetLowStockReport(): Product[] {
  return getComputedProducts()
    .filter((p) => p.currentStock <= p.lowStockThreshold || p.stockInBaseUnit <= 0)
    .sort(compareProducts);
}

export function storeGetSettings(): AppSettings {
  return data.settings as AppSettings;
}

export function storeUpdateSettings(d: Partial<AppSettings>): AppSettings {
  Object.assign(data.settings, d);
  persist();
  return data.settings as AppSettings;
}

export function storeReturnBillItems(input: ReturnBillInput): Bill {
  const billIndex = data.bills.findIndex(b => b.id === input.billId);
  if (billIndex === -1) throw new Error("Bill not found");

  const bill = data.bills[billIndex] as Bill;
  let totalRefundAmount = 0;
  let totalRefundProfit = 0;

  // Process each returned item
  for (const returned of input.items) {
    if (returned.quantityToReturn <= 0) continue;

    const billItem = bill.items.find(i => i.productId === returned.productId);
    if (!billItem) continue;

    const previousReturnQty = billItem.returnedQuantity ?? 0;
    const maxReturnable = billItem.quantity - previousReturnQty;
    const actualReturnQty = Math.min(returned.quantityToReturn, maxReturnable);

    if (actualReturnQty <= 0) continue;

    billItem.returnedQuantity = previousReturnQty + actualReturnQty;

    const productIdx = data.products.findIndex(p => p.id === billItem.productId);
    if (productIdx !== -1) {
      const p = data.products[productIdx];
      // Stock delta for the returned quantity
      const stockDelta = billItem.stockDeltaBaseUnit
        ? (billItem.stockDeltaBaseUnit / billItem.quantity) * actualReturnQty
        : p.baseQuantity * actualReturnQty;

      // Add stock back
      const updatedProduct = withComputedFields({
        ...p,
        stockInBaseUnit: p.stockInBaseUnit + stockDelta,
      });
      data.products[productIdx] = updatedProduct;
      applySharedStock(updatedProduct, updatedProduct.stockInBaseUnit);

      // Calculate profit to revert
      const costPerBaseUnit = p.purchasePrice / Math.max(1, p.baseQuantity);
      const costForReturn = costPerBaseUnit * stockDelta;
      const refundRevenue = billItem.unitPrice * actualReturnQty;
      
      totalRefundAmount += refundRevenue;
      totalRefundProfit += (refundRevenue - costForReturn);
    }
  }

  // Adjust khata if needed
  if (bill.paymentMode === "khata" && bill.customerId && totalRefundAmount > 0) {
    const c = data.customers.find(customer => customer.id === bill.customerId) as any;
    if (c) {
      c.totalDue = Math.max(0, (c.totalDue ?? 0) - totalRefundAmount);
      c.transactions = c.transactions ?? [];
      c.transactions.push({
        id: nextTxId++,
        type: "payment",
        amount: totalRefundAmount,
        description: `Refund for returned items in Bill #${bill.id}`,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Adjust Daily Metrics for the date of the original bill
  if (totalRefundAmount > 0) {
    const date = bill.createdAt.split("T")[0];
    const salesRow = data.salesReportData.find((row) => row.date === date);
    if (salesRow) {
      salesRow.sales = Math.max(0, salesRow.sales - totalRefundAmount);
    }
    const profitRow = data.profitReportData.find((row) => row.date === date);
    if (profitRow) {
      profitRow.revenue = Math.max(0, profitRow.revenue - totalRefundAmount);
      profitRow.profit -= totalRefundProfit; // Profit can be negative
    }
  }

  persist();
  return bill;
}
