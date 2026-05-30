"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useGetSettings, useUpdateSettings, getSettingsQueryKey } from "@/lib/api";
import { SettingsSharedConstants } from "../settings_constants/SettingsSharedConstants";
import type { SettingsForm } from "../settings_types/SettingsTypes";

interface SettingsContextType {
  form: SettingsForm;
  isDirty: boolean;
  settingsLoading: boolean;
  isSaving: boolean;
  updateForm: (key: keyof SettingsForm, value: string | boolean | number) => void;
  saveSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: serverSettings, isLoading: settingsLoading } = useGetSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [form, setForm] = useState<SettingsForm>(SettingsSharedConstants.DEFAULTS);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (serverSettings) {
      setForm({
        shopName: serverSettings.shopName ?? SettingsSharedConstants.DEFAULTS.shopName,
        shopAddress: serverSettings.shopAddress ?? "",
        shopPhone: serverSettings.shopPhone ?? "",
        ownerName: serverSettings.ownerName ?? "",
        gstNumber: serverSettings.gstNumber ?? "",
        gstEnabled: serverSettings.gstEnabled ?? false,
        currency: serverSettings.currency ?? "₹",
        lowStockThreshold: serverSettings.lowStockThreshold ?? 5,
        whatsappNumber: serverSettings.whatsappNumber ?? "",
        printerName: serverSettings.printerName ?? "",
      });
      setIsDirty(false);
    }
  }, [serverSettings]);

  const updateForm = useCallback((key: keyof SettingsForm, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  const saveSettings = useCallback(() => {
    updateSettingsMutation.mutate(
      { data: form },
      {
        onSuccess: () => {
          toast({ title: SettingsSharedConstants.TEXTS.SAVE_SUCCESS });
          queryClient.invalidateQueries({ queryKey: getSettingsQueryKey() });
          setIsDirty(false);
        },
        onError: () => toast({ title: SettingsSharedConstants.TEXTS.SAVE_ERROR, variant: "destructive" }),
      }
    );
  }, [form, toast, queryClient, updateSettingsMutation]);

  const contextValue = useMemo(() => ({
    form,
    isDirty,
    settingsLoading,
    isSaving: updateSettingsMutation.isPending,
    updateForm,
    saveSettings,
  }), [form, isDirty, settingsLoading, updateSettingsMutation.isPending, updateForm, saveSettings]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
