"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  storeGetProducts, storeCreateProduct, storeUpdateProduct, storeDeleteProduct,
} from "./store";
import type { Product } from "./types";

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
    mutationFn: async ({ data }: { data: Omit<Product, "id" | "createdAt"> }) =>
      Promise.resolve(storeCreateProduct(data)),
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Omit<Product, "id" | "createdAt"> }) =>
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
