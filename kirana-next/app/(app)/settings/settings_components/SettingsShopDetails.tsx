"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";
import { useSettings } from "./SettingsContext";
import { SettingsConstants } from "./SettingsConstants";

export function SettingsShopDetails() {
  const { form, updateForm } = useSettings();

  return (
    <Card className="bg-[var(--settings-card-bg)] border-[var(--settings-border)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--settings-foreground)]">
          <Store className="h-5 w-5 text-[var(--settings-primary)]" />{" "}
          {SettingsConstants.TEXTS.DUKAAN_DETAILS}
        </CardTitle>
        <CardDescription className="text-[var(--settings-muted-text)]">
          {SettingsConstants.TEXTS.DUKAAN_DESC}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[var(--settings-foreground)]">{SettingsConstants.TEXTS.SHOP_NAME}</Label>
            <Input
              value={form.shopName}
              onChange={(e) => updateForm("shopName", e.target.value)}
              placeholder={SettingsConstants.TEXTS.SHOP_NAME_PLACEHOLDER}
              className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[var(--settings-foreground)]">{SettingsConstants.TEXTS.OWNER_NAME}</Label>
            <Input
              value={form.ownerName}
              onChange={(e) => updateForm("ownerName", e.target.value)}
              placeholder={SettingsConstants.TEXTS.OWNER_NAME_PLACEHOLDER}
              className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[var(--settings-foreground)]">{SettingsConstants.TEXTS.ADDRESS}</Label>
          <Input
            value={form.shopAddress}
            onChange={(e) => updateForm("shopAddress", e.target.value)}
            placeholder={SettingsConstants.TEXTS.ADDRESS_PLACEHOLDER}
            className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[var(--settings-foreground)]">{SettingsConstants.TEXTS.PHONE}</Label>
            <Input
              value={form.shopPhone}
              onChange={(e) => updateForm("shopPhone", e.target.value)}
              placeholder={SettingsConstants.TEXTS.PHONE_PLACEHOLDER}
              className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[var(--settings-foreground)]">{SettingsConstants.TEXTS.CURRENCY}</Label>
            <Input
              value={form.currency}
              onChange={(e) => updateForm("currency", e.target.value)}
              className="w-24 bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
