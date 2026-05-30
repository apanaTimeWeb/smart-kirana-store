import React from "react";
import { SettingsConstants } from "./SettingsConstants";

/**
 * SettingsDashboardLoadingFallback
 * Responsibility: Renders the "Loading settings..." UI state shown
 * while the initial settings data is being fetched from the server.
 * No "use client" needed — pure static JSX.
 */
export function SettingsDashboardLoadingFallback() {
  return (
    <div className="space-y-6 max-w-3xl text-[var(--settings-muted-text)]">
      {SettingsConstants.TEXTS.LOADING_SETTINGS}
    </div>
  );
}
