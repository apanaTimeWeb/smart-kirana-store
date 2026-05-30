export type DashboardStatSummary = {
  todaySale?: number;
  todayProfit?: number;
  todayOrderCount?: number;
  pendingKhataAmount?: number;
  pendingKhataCount?: number;
  lowStockCount?: number;
  outOfStockCount?: number;
};

export type LowStockProduct = {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  lowStockThreshold: number;
  unit: string;
};

export type ExpiringProduct = {
  id: number;
  name: string;
  variantName: string;
  expiryDate: string;
  daysLeft: number;
};

export type RecentBill = {
  id: number;
  customerName?: string;
  finalAmount: number;
  paymentMode: string;
  createdAt: string;
};

export type DashboardSummaryData = DashboardStatSummary & {
  recentBills?: RecentBill[];
  lowStockProducts?: LowStockProduct[];
  expiringProducts?: ExpiringProduct[];
};


