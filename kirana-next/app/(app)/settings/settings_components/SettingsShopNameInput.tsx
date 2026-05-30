"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "./SettingsContext";
import { SettingsConstants } from "./SettingsConstants";

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
        {SettingsConstants.TEXTS.SHOP_NAME}
      </Label>
      <Input
        id="settings-shop-name"
        value={form.shopName}
        onChange={(e) => updateForm("shopName", e.target.value)}
        placeholder={SettingsConstants.TEXTS.SHOP_NAME_PLACEHOLDER}
        className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
      />
    </div>
  );
}
