"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useGetSettings, useUpdateSettings, getSettingsQueryKey } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

import { ActiveSession, DEFAULTS, SettingsForm } from "./types";
import { ShopDetailsCard } from "./ShopDetailsCard";
import { GSTSettingsCard } from "./GSTSettingsCard";
import { WhatsAppSettingsCard } from "./WhatsAppSettingsCard";
import { PrinterSetupCard } from "./PrinterSetupCard";
import { ActiveDevicesCard } from "./ActiveDevicesCard";

// Mock Hook (Backend mein real API call replace kar dena)
const useGetActiveSessions = () => {
  const [sessions] = useState<ActiveSession[]>([
    {
      id: "1",
      deviceType: "Computer",
      deviceName: "Windows PC - Chrome",
      ip: "182.68.45.123",
      location: "Patna, Bihar",
      lastActive: "Just now",
      isCurrent: true,
    },
    {
      id: "2",
      deviceType: "Mobile",
      deviceName: "Redmi Note 12",
      ip: "182.68.112.78",
      location: "Patna, Bihar",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
  ]);

  return { data: sessions, isLoading: false };
};

export function SettingsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: serverSettings, isLoading: settingsLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const { data: activeSessions = [], isLoading: sessionsLoading } = useGetActiveSessions();

  const [form, setForm] = useState<SettingsForm>(DEFAULTS);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (serverSettings) {
      setForm({
        shopName: serverSettings.shopName ?? DEFAULTS.shopName,
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
    }
  }, [serverSettings]);

  const update = (key: keyof SettingsForm, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const save = async () => {
    updateSettings.mutate(
      { data: form },
      {
        onSuccess: () => {
          toast({ title: "✅ Settings successfully saved!" });
          queryClient.invalidateQueries({ queryKey: getSettingsQueryKey() });
          setIsDirty(false);
        },
        onError: () => toast({ title: "❌ Failed to save settings", variant: "destructive" }),
      }
    );
  };

  const handleLogoutDevice = (sessionId: string, deviceName: string) => {
    if (confirm(`Kya aap "${deviceName}" se logout karna chahte hain?`)) {
      // TODO: Backend logout API call
      toast({ title: `${deviceName} se logout ho gaya` });
    }
  };

  if (settingsLoading) {
    return <div className="space-y-6 max-w-3xl">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your shop and security preferences</p>
      </div>

      <ShopDetailsCard form={form} update={update} />
      <GSTSettingsCard form={form} update={update} />
      <WhatsAppSettingsCard form={form} update={update} />
      <PrinterSetupCard form={form} update={update} />
      <ActiveDevicesCard
        sessionsLoading={sessionsLoading}
        activeSessions={activeSessions}
        handleLogoutDevice={handleLogoutDevice}
      />

      <Separator />

      <Button
        onClick={save}
        disabled={updateSettings.isPending || !isDirty}
        size="lg"
        className="w-full text-lg h-12"
      >
        {updateSettings.isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-5 w-5 mr-2" />
            Save All Settings
          </>
        )}
      </Button>
    </div>
  );
}
