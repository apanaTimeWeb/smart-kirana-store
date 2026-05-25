"use client";

import { useQuery } from "@tanstack/react-query";
import { storeGetDashboard } from "./store";
import type { DashboardSummary } from "./types";

export function getGetDashboardSummaryQueryKey() {
  return ["dashboard", "summary"] as const;
}

export function useGetDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: getGetDashboardSummaryQueryKey(),
    queryFn: () => Promise.resolve(storeGetDashboard()),
  });
}
