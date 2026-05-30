"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "../../settings_context/SettingsContext";
import { SettingsSharedConstants } from "../../settings_constants/SettingsSharedConstants";

/**
 * SettingsShopNameInput
 * Responsibility: Renders ONLY the "Dukaan Ka Naam" (Shop Name) form field.
 * State: Read/writes `form.shopName` via SettingsContext.
 */
export function SettingsShopNameInput() {
  const { form, updateForm } = useSettings();

  return (
    <div className="space-y-1.5">
      <Label className="text-[var(--settings-foreground)]">
        {SettingsSharedConstants.TEXTS.SHOP_NAME}
      </Label>
      <Input
        id="settings-shop-name"
        value={form.shopName}
        onChange={(e) => updateForm("shopName", e.target.value)}
        placeholder={SettingsSharedConstants.TEXTS.SHOP_NAME_PLACEHOLDER}
        className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
      />
    </div>
  );
}
