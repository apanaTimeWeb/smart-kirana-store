"use client";

import "./settings.css";
import { SettingsProvider } from "./settings_components/SettingsContext";
import { SettingsDashboardContainer } from "./settings_components/SettingsDashboardContainer";

export default function Settings() {
  return (
    <SettingsProvider>
      <SettingsDashboardContainer />
    </SettingsProvider>
  );
}