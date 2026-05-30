"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileText } from "lucide-react";
import { useSettings } from "../../settings_context/SettingsContext";
import { SettingsSharedConstants } from "../../settings_constants/SettingsSharedConstants";

export function SettingsGSTConfig() {
  const { form, updateForm } = useSettings();

  return (
    <Card className="bg-[var(--settings-card-bg)] border-[var(--settings-border)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--settings-foreground)]">
          <FileText className="h-5 w-5 text-[var(--settings-primary)]" />{" "}
          {SettingsSharedConstants.TEXTS.GST_SETTINGS}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="gstEnabled" className="cursor-pointer text-[var(--settings-foreground)]">
            {SettingsSharedConstants.TEXTS.GST_ENABLE}
          </Label>
          <Switch
            id="gstEnabled"
            checked={form.gstEnabled}
            onCheckedChange={(checked) => updateForm("gstEnabled", checked)}
          />
        </div>

        {form.gstEnabled && (
          <div className="space-y-1.5">
            <Label className="text-[var(--settings-foreground)]">{SettingsSharedConstants.TEXTS.GST_NUMBER}</Label>
            <Input
              value={form.gstNumber}
              onChange={(e) => updateForm("gstNumber", e.target.value.toUpperCase())}
              placeholder={SettingsSharedConstants.TEXTS.GST_NUMBER_PLACEHOLDER}
              className="font-mono bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
