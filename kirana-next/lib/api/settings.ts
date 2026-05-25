"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { storeGetSettings, storeUpdateSettings } from "./store";
import type { AppSettings } from "./types";

export function getSettingsQueryKey() {
  return ["settings"] as const;
}

export function useGetSettings() {
  return useQuery<AppSettings>({
    queryKey: getSettingsQueryKey(),
    queryFn: () => Promise.resolve(storeGetSettings()),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  return useMutation({
    mutationFn: async ({ data }: { data: Partial<AppSettings> }) => {
      storeUpdateSettings(data);
      return Promise.resolve({ success: true });
    },
  });
}
