"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  storeGetSalesReport, storeGetProfitReport, storeGetKhataReport, storeGetLowStockReport,
} from "./store";
import type { SalesReport, ProfitReport, KhataReport, Product } from "./types";

export function getGetSalesReportQueryKey(params?: { period?: string; from?: string; to?: string }) {
  return ["reports", "sales", params ?? {}] as const;
}

export function getGetProfitReportQueryKey(params?: { from?: string; to?: string }) {
  return ["reports", "profit", params ?? {}] as const;
}

export function useGetSalesReport(
  params: { period?: string; from?: string; to?: string },
  options?: { query?: Partial<UseQueryOptions<SalesReport>> },
) {
  return useQuery<SalesReport>({
    queryKey: getGetSalesReportQueryKey(params),
    queryFn: () => Promise.resolve(storeGetSalesReport(params)),
    ...options?.query,
  });
}

export function useGetProfitReport(
  params: { from?: string; to?: string },
  options?: { query?: Partial<UseQueryOptions<ProfitReport>> },
) {
  return useQuery<ProfitReport>({
    queryKey: getGetProfitReportQueryKey(params),
    queryFn: () => Promise.resolve(storeGetProfitReport(params)),
    ...options?.query,
  });
}

export function useGetPendingKhataReport() {
  return useQuery<KhataReport>({
    queryKey: ["reports", "khata"],
    queryFn: () => Promise.resolve(storeGetKhataReport()),
  });
}

export function useGetLowStockReport() {
  return useQuery<Product[]>({
    queryKey: ["reports", "lowstock"],
    queryFn: () => Promise.resolve(storeGetLowStockReport()),
  });
}
