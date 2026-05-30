import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store } from "lucide-react";
import { SettingsSharedConstants } from "../../constants/SettingsSharedConstants";
import { SettingsShopNameInput } from "./SettingsShopNameInput";
import { SettingsShopOwnerNameInput } from "./SettingsShopOwnerNameInput";
import { SettingsShopAddressInput } from "./SettingsShopAddressInput";
import { SettingsShopPhoneInput } from "./SettingsShopPhoneInput";
import { SettingsShopCurrencyInput } from "./SettingsShopCurrencyInput";

/**
 * SettingsShopDetails
 * Responsibility: Layout card for the "Dukaan Details" section.
 * This is a pure layout orchestrator — it has NO form logic or state.
 * Each input field is handled by its own isolated micro-component.
 * No "use client" needed: this is a Server Component; children handle their own client boundary.
 */
export function SettingsShopDetails() {
  return (
    <Card className="bg-[var(--settings-card-bg)] border-[var(--settings-border)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--settings-foreground)]">
          <Store className="h-5 w-5 text-[var(--settings-primary)]" />{" "}
          {SettingsSharedConstants.TEXTS.DUKAAN_DETAILS}
        </CardTitle>
        <CardDescription className="text-[var(--settings-muted-text)]">
          {SettingsSharedConstants.TEXTS.DUKAAN_DESC}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsShopNameInput />
          <SettingsShopOwnerNameInput />
        </div>

        <SettingsShopAddressInput />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingsShopPhoneInput />
          <SettingsShopCurrencyInput />
        </div>
      </CardContent>
    </Card>
  );
}
