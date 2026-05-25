"use client";

import { useQuery, useMutation, type UseQueryOptions } from "@tanstack/react-query";
import {
  storeGetCustomers, storeGetCustomer, storeCreateCustomer,
  storeDeleteCustomer, storeAddKhataTransaction,
} from "./store";
import type { Customer, CustomerDetail, KhataTransaction } from "./types";

export function getListCustomersQueryKey(params?: { search?: string }) {
  return ["customers", "list", params ?? {}] as const;
}

export function getGetCustomerQueryKey(id: number) {
  return ["customers", "detail", id] as const;
}

export function useListCustomers(params?: { search?: string }) {
  return useQuery({
    queryKey: getListCustomersQueryKey(params),
    queryFn: () => Promise.resolve(storeGetCustomers(params)),
  });
}

export function useGetCustomer(
  id: number,
  options?: { query?: Partial<UseQueryOptions<CustomerDetail | null>> },
) {
  return useQuery({
    queryKey: getGetCustomerQueryKey(id),
    queryFn: () => Promise.resolve(storeGetCustomer(id)),
    ...options?.query,
  });
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: async ({ data }: { data: { name: string; phone: string; address?: string } }) =>
      Promise.resolve(storeCreateCustomer(data)),
  });
}

export function useDeleteCustomer() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      storeDeleteCustomer(id);
      return Promise.resolve({ ok: true });
    },
  });
}

export function useAddKhataTransaction() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { type: "credit" | "payment"; amount: number; description: string };
    }) => Promise.resolve(storeAddKhataTransaction(id, data) as KhataTransaction),
  });
}
