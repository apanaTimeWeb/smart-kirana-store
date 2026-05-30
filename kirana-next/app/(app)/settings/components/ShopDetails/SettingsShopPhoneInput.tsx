"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "../../context/SettingsContext";
import { SettingsSharedConstants } from "../../constants/SettingsSharedConstants";

/**
 * SettingsShopPhoneInput
 * Responsibility: Renders ONLY the "Phone Number" form field.
 * State: Read/writes `form.shopPhone` via SettingsContext.
 */
export function SettingsShopPhoneInput() {
  const { form, updateForm } = useSettings();

  return (
    <div className="space-y-1.5">
      <Label className="text-[var(--settings-foreground)]">
        {SettingsSharedConstants.TEXTS.PHONE}
      </Label>
      <Input
        id="settings-shop-phone"
        type="tel"
        value={form.shopPhone}
        onChange={(e) => updateForm("shopPhone", e.target.value)}
        placeholder={SettingsSharedConstants.TEXTS.PHONE_PLACEHOLDER}
        className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
      />
    </div>
  );
}
