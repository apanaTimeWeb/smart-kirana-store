"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "../../settings_context/SettingsContext";
import { SettingsSharedConstants } from "../../settings_constants/SettingsSharedConstants";

/**
 * SettingsShopCurrencyInput
 * Responsibility: Renders ONLY the "Currency Symbol" form field.
 * State: Read/writes `form.currency` via SettingsContext.
 */
export function SettingsShopCurrencyInput() {
  const { form, updateForm } = useSettings();

  return (
    <div className="space-y-1.5">
      <Label className="text-[var(--settings-foreground)]">
        {SettingsSharedConstants.TEXTS.CURRENCY}
      </Label>
      <Input
        id="settings-currency-symbol"
        value={form.currency}
        onChange={(e) => updateForm("currency", e.target.value)}
        className="w-24 bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
      />
    </div>
  );
}
