"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "../../settings_context/SettingsContext";
import { SettingsSharedConstants } from "../../settings_constants/SettingsSharedConstants";

/**
 * SettingsShopAddressInput
 * Responsibility: Renders ONLY the "Pata (Address)" form field.
 * State: Read/writes `form.shopAddress` via SettingsContext.
 */
export function SettingsShopAddressInput() {
  const { form, updateForm } = useSettings();

  return (
    <div className="space-y-1.5">
      <Label className="text-[var(--settings-foreground)]">
        {SettingsSharedConstants.TEXTS.ADDRESS}
      </Label>
      <Input
        id="settings-shop-address"
        value={form.shopAddress}
        onChange={(e) => updateForm("shopAddress", e.target.value)}
        placeholder={SettingsSharedConstants.TEXTS.ADDRESS_PLACEHOLDER}
        className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
      />
    </div>
  );
}
