"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
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
