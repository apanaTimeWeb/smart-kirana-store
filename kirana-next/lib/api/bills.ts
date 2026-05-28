"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeGetBills, storeCreateBill } from "./store";
import type { Bill, BillInput } from "./types";

export function getListBillsQueryKey() {
  return ["bills", "list"] as const;
}

export function useListBills() {
  return useQuery({
    queryKey: getListBillsQueryKey(),
    queryFn: () => Promise.resolve(storeGetBills()),
  });
}

export function useCreateBill() {
  return useMutation({
    mutationFn: async ({ data }: { data: BillInput }) => {
      const customerName = data.customerId
        ? (await import("./store")).storeGetCustomers().find((c) => c.id === data.customerId)?.name
        : undefined;
      return Promise.resolve(storeCreateBill({ ...data, customerName }));
    },
  });
}

export function useReturnBillItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: import("./types").ReturnBillInput }) => {
      const { storeReturnBillItems } = await import("./store");
      return Promise.resolve(storeReturnBillItems(data));
    },
    onSuccess: () => {
      // Invalidate relevant queries so the UI updates
      queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

