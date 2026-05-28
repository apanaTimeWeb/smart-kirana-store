"use client";

import { useQuery, useMutation, type UseQueryOptions } from "@tanstack/react-query";
import {
  storeGetSuppliers, storeGetSupplier, storeCreateSupplier,
  storeDeleteSupplier, storeAddSupplierTransaction,
} from "./store";
import type { Supplier, SupplierDetail, SupplierTransaction } from "./types";

export function getListSuppliersQueryKey(params?: { search?: string }) {
  return ["suppliers", "list", params ?? {}] as const;
}

export function getGetSupplierQueryKey(id: number) {
  return ["suppliers", "detail", id] as const;
}

export function useListSuppliers(params?: { search?: string }) {
  return useQuery({
    queryKey: getListSuppliersQueryKey(params),
    queryFn: () => Promise.resolve(storeGetSuppliers(params)),
  });
}

export function useGetSupplier(
  id: number,
  options?: { query?: Partial<UseQueryOptions<SupplierDetail | null>> },
) {
  return useQuery({
    queryKey: getGetSupplierQueryKey(id),
    queryFn: () => Promise.resolve(storeGetSupplier(id)),
    ...options?.query,
  });
}

export function useCreateSupplier() {
  return useMutation({
    mutationFn: async ({ data }: { data: { name: string; phone: string; address?: string } }) =>
      Promise.resolve(storeCreateSupplier(data)),
  });
}

export function useDeleteSupplier() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      storeDeleteSupplier(id);
      return Promise.resolve({ ok: true });
    },
  });
}

export function useAddSupplierTransaction() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { type: "credit" | "payment"; amount: number; description: string };
    }) => Promise.resolve(storeAddSupplierTransaction(id, data) as SupplierTransaction),
  });
}
