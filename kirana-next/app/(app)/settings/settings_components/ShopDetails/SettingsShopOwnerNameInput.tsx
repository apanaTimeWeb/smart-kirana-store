"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "../../settings_context/SettingsContext";
import { SettingsSharedConstants } from "../../settings_constants/SettingsSharedConstants";

/**
 * SettingsShopOwnerNameInput
 * Responsibility: Renders ONLY the "Malik Ka Naam" (Owner Name) form field.
 * State: Read/writes `form.ownerName` via SettingsContext.
 */
export function SettingsShopOwnerNameInput() {
  const { form, updateForm } = useSettings();

  return (
    <div className="space-y-1.5">
      <Label className="text-[var(--settings-foreground)]">
        {SettingsSharedConstants.TEXTS.OWNER_NAME}
      </Label>
      <Input
        id="settings-owner-name"
        value={form.ownerName}
        onChange={(e) => updateForm("ownerName", e.target.value)}
        placeholder={SettingsSharedConstants.TEXTS.OWNER_NAME_PLACEHOLDER}
        className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
      />
    </div>
  );
}
