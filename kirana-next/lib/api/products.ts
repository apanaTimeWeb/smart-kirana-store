"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  storeAddPurchaseEntry,
  storeCreateProduct,
  storeDeleteProduct,
  storeGetProducts,
  storeUpdateProduct,
} from "./store";
import type { Product, ProductInput, ProductVariantInput, PurchaseEntryInput } from "./types";

export function getListProductsQueryKey(params?: { search?: string; lowStock?: boolean }) {
  return ["products", "list", params ?? {}] as const;
}

export function useListProducts(params?: { search?: string; lowStock?: boolean }) {
  return useQuery({
    queryKey: getListProductsQueryKey(params),
    queryFn: () => Promise.resolve(storeGetProducts(params)),
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async ({ data }: { data: ProductInput }) =>
      Promise.resolve(storeCreateProduct(data)),
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ProductVariantInput> }) =>
      Promise.resolve(storeUpdateProduct(id, data)),
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      storeDeleteProduct(id);
      return Promise.resolve({ ok: true });
    },
  });
}

export function useAddPurchaseEntry() {
  return useMutation({
    mutationFn: async ({ data }: { data: PurchaseEntryInput }) =>
      Promise.resolve(storeAddPurchaseEntry(data)),
  });
}
