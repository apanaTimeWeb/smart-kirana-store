"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle } from "lucide-react";
import { useSettings } from "../../settings_context/SettingsContext";
import { SettingsSharedConstants } from "../../settings_constants/SettingsSharedConstants";

export function SettingsWhatsAppConfig() {
  const { form, updateForm } = useSettings();

  return (
    <Card className="bg-[var(--settings-card-bg)] border-[var(--settings-border)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--settings-foreground)]">
          <MessageCircle className="h-5 w-5 text-[var(--settings-whatsapp-icon)]" />{" "}
          {SettingsSharedConstants.TEXTS.WHATSAPP_SETTINGS}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <Label className="text-[var(--settings-foreground)]">{SettingsSharedConstants.TEXTS.WHATSAPP_NUMBER}</Label>
          <Input
            value={form.whatsappNumber}
            onChange={(e) => updateForm("whatsappNumber", e.target.value)}
            placeholder={SettingsSharedConstants.TEXTS.WHATSAPP_PLACEHOLDER}
            className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
