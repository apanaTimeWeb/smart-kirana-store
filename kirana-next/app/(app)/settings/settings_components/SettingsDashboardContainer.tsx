"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "./SettingsContext";
import { SettingsConstants } from "./SettingsConstants";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsShopDetails } from "./SettingsShopDetails";
import { SettingsGSTConfig } from "./SettingsGSTConfig";
import { SettingsWhatsAppConfig } from "./SettingsWhatsAppConfig";
import { SettingsPrinterConfig } from "./SettingsPrinterConfig";
import { SettingsActiveDevices } from "./SettingsActiveDevices";
import { SettingsSaveAction } from "./SettingsSaveAction";

export function SettingsDashboardContainer() {
  const { settingsLoading } = useSettings();

  if (settingsLoading) {
    return (
      <div className="space-y-6 max-w-3xl text-[var(--settings-muted-text)]">
        {SettingsConstants.TEXTS.LOADING_SETTINGS}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <SettingsHeader />
      <SettingsShopDetails />
      <SettingsGSTConfig />
      <SettingsWhatsAppConfig />
      <SettingsPrinterConfig />
      <SettingsActiveDevices />

      <Separator className="bg-[var(--settings-border)]" />

      <SettingsSaveAction />
    </div>
  );
}
