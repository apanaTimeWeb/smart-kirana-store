import type { ElementType } from "react";

export interface ReportsProduct {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  stockInBaseUnit: number;
  unit: string;
}

export interface ReportsKhataCustomer {
  id: number;
  name: string;
  phone: string;
  totalDue: number;
}

export interface ReportsSalesData {
  date: string;
  sales: number;
}

export interface ReportsProfitData {
  date: string;
  profit: number;
}

/**
 * The shape of each card config object assembled in ReportsStatGrid.
 * Derived from the `statCards` array — keeps the array typed without
 * redeclaring properties inline.
 */
export interface ReportsStatCardDefinition {
  label: string;
  sublabel: string;
  value: string;
  note?: string;
  icon: ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

/**
 * One entry in the QUICK_DATES preset array.
 * `days: 0` means "today only" (single-day range).
 */
export interface ReportsQuickDate {
  label: string;
  days: number;
}
