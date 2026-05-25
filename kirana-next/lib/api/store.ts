// ─── In-Memory Store (replaces backend API) ───────────────────────────────────
import rawData from "../data.json";
import type { Product, Customer, CustomerDetail, Bill, AppSettings } from "./types";

// Deep-clone so mutations don't affect the original import
const data = JSON.parse(JSON.stringify(rawData)) as typeof rawData;

let nextProductId = Math.max(...data.products.map((p) => p.id)) + 1;
let nextCustomerId = Math.max(...data.customers.map((c) => c.id)) + 1;
let nextBillId = Math.max(...data.bills.map((b) => b.id)) + 1;
let nextTxId = 100;

// ─── Products ─────────────────────────────────────────────────────────────────

export function storeGetProducts(params?: { search?: string; lowStock?: boolean }): Product[] {
  let list = data.products as Product[];
  if (params?.search) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(s) || p.barcode?.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)
    );
  }
  if (params?.lowStock) {
    list = list.filter((p) => p.currentStock <= p.lowStockThreshold);
  }
  return list;
}

export function storeCreateProduct(d: Omit<Product, "id" | "createdAt">): Product {
  const p: Product = { ...d, id: nextProductId++, createdAt: new Date().toISOString() };
  (data.products as Product[]).push(p);
  return p;
}

export function storeUpdateProduct(id: number, d: Partial<Omit<Product, "id" | "createdAt">>): Product {
  const idx = data.products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  const updated = { ...(data.products[idx] as Product), ...d };
  (data.products as Product[])[idx] = updated;
  return updated;
}

export function storeDeleteProduct(id: number): void {
  const idx = data.products.findIndex((p) => p.id === id);
  if (idx !== -1) data.products.splice(idx, 1);
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function storeGetCustomers(params?: { search?: string }): Customer[] {
  let list = data.customers as Customer[];
  if (params?.search) {
    const s = params.search.toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(s) || c.phone.includes(s));
  }
  return list;
}

export function storeGetCustomer(id: number): CustomerDetail | null {
  const c = data.customers.find((c) => c.id === id);
  if (!c) return null;
  return c as CustomerDetail;
}

export function storeCreateCustomer(d: { name: string; phone: string; address?: string }): Customer {
  const c: Customer = { ...d, id: nextCustomerId++, totalDue: 0, createdAt: new Date().toISOString() };
  (data.customers as any[]).push({ ...c, transactions: [] });
  return c;
}

export function storeDeleteCustomer(id: number): void {
  const idx = data.customers.findIndex((c) => c.id === id);
  if (idx !== -1) data.customers.splice(idx, 1);
}

export function storeAddKhataTransaction(
  customerId: number,
  tx: { type: "credit" | "payment"; amount: number; description: string }
) {
  const c = data.customers.find((c) => c.id === customerId) as any;
  if (!c) throw new Error("Customer not found");
  const newTx = { id: nextTxId++, ...tx, createdAt: new Date().toISOString() };
  c.transactions = c.transactions ?? [];
  c.transactions.push(newTx);
  c.totalDue = tx.type === "credit" ? c.totalDue + tx.amount : Math.max(0, c.totalDue - tx.amount);
  return newTx;
}

// ─── Bills ────────────────────────────────────────────────────────────────────

export function storeGetBills(): Bill[] {
  return data.bills as Bill[];
}

export function storeCreateBill(d: Omit<Bill, "id" | "createdAt">): Bill {
  const bill: Bill = { ...d, id: nextBillId++, createdAt: new Date().toISOString() };
  (data.bills as Bill[]).push(bill);

  // Deduct stock
  for (const item of d.items) {
    const p = data.products.find((p) => p.id === item.productId);
    if (p) p.currentStock = Math.max(0, p.currentStock - item.quantity);
  }

  // If khata, add to customer due
  if (d.paymentMode === "khata" && d.customerId) {
    const c = data.customers.find((c) => c.id === d.customerId) as any;
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

  return bill;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function storeGetDashboard() {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayBills = (data.bills as Bill[]).filter((b) => b.createdAt.startsWith(todayStr));

  const todaySale = todayBills.reduce((s, b) => s + b.finalAmount, 0);
  const todayProfit = todayBills.reduce((s, b) => {
    const cost = b.items.reduce((c, item) => {
      const p = data.products.find((p) => p.id === item.productId) as Product | undefined;
      return c + (p?.purchasePricePerKg ?? 0) * item.quantity;
    }, 0);
    return s + (b.finalAmount - cost);
  }, 0);

  const customersWithDue = (data.customers as Customer[]).filter((c) => c.totalDue > 0);
  const lowStock = (data.products as Product[]).filter((p) => p.currentStock <= p.lowStockThreshold && p.currentStock > 0);
  const outOfStock = (data.products as Product[]).filter((p) => p.currentStock === 0);

  return {
    todaySale,
    todayProfit,
    todayOrderCount: todayBills.length,
    pendingKhataAmount: customersWithDue.reduce((s, c) => s + c.totalDue, 0),
    pendingKhataCount: customersWithDue.length,
    lowStockCount: lowStock.length,
    outOfStockCount: outOfStock.length,
    recentBills: [...(data.bills as Bill[])].reverse().slice(0, 6).map((b) => ({
      id: b.id,
      customerName: b.customerName ?? undefined,
      finalAmount: b.finalAmount,
      paymentMode: b.paymentMode,
      createdAt: b.createdAt,
    })),
    lowStockProducts: [...lowStock, ...outOfStock].slice(0, 6).map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      currentStock: p.currentStock,
      lowStockThreshold: p.lowStockThreshold,
      unit: p.unit,
    })),
  };
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export function storeGetSalesReport(params: { from?: string; to?: string }) {
  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;

  const filtered = data.salesReportData.filter((d) => {
    const date = new Date(d.date);
    if (fromDate && date < fromDate) return false;
    if (toDate && date > toDate) return false;
    return true;
  });

  return {
    totalSales: filtered.reduce((s, d) => s + d.sales, 0),
    orderCount: filtered.reduce((s, d) => s + d.orders, 0),
    data: filtered,
  };
}

export function storeGetProfitReport(params: { from?: string; to?: string }) {
  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;

  const filtered = data.profitReportData.filter((d) => {
    const date = new Date(d.date);
    if (fromDate && date < fromDate) return false;
    if (toDate && date > toDate) return false;
    return true;
  });

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
  return (data.products as Product[]).filter((p) => p.currentStock <= p.lowStockThreshold);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function storeGetSettings(): AppSettings {
  return data.settings as AppSettings;
}

export function storeUpdateSettings(d: Partial<AppSettings>): AppSettings {
  Object.assign(data.settings, d);
  return data.settings as AppSettings;
}
