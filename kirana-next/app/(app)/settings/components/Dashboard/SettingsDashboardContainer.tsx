"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "../../context/SettingsContext";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsShopDetails } from "../ShopDetails/SettingsShopDetails";
import { SettingsGSTConfig } from "../Configurations/SettingsGSTConfig";
import { SettingsWhatsAppConfig } from "../Configurations/SettingsWhatsAppConfig";
import { SettingsPrinterConfig } from "../Configurations/SettingsPrinterConfig";
import { SettingsActiveDevices } from "../ActiveDevices/SettingsActiveDevices";
import { SettingsSaveAction } from "./SettingsSaveAction";
import { SettingsDashboardLoadingFallback } from "./SettingsDashboardLoadingFallback";

/**
 * SettingsDashboardContainer
 * Responsibility: Master layout orchestrator for the Settings page.
 * - Checks API loading state and delegates to SettingsDashboardLoadingFallback
 * - Arranges all section cards in the correct vertical order
 * This component has ZERO business logic — it is a pure structural layout.
 */
export function SettingsDashboardContainer() {
  const { settingsLoading } = useSettings();

  if (settingsLoading) {
    return <SettingsDashboardLoadingFallback />;
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
