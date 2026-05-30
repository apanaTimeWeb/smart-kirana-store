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
