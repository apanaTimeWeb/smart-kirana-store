"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";
import { useSettings } from "./SettingsContext";
import { SettingsConstants } from "./SettingsConstants";

export function SettingsPrinterConfig() {
  const { form, updateForm } = useSettings();

  return (
    <Card className="bg-[var(--settings-card-bg)] border-[var(--settings-border)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--settings-foreground)]">
          <Printer className="h-5 w-5 text-[var(--settings-primary)]" />{" "}
          {SettingsConstants.TEXTS.PRINTER_SETUP}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <Label className="text-[var(--settings-foreground)]">{SettingsConstants.TEXTS.PRINTER_NAME}</Label>
          <Input
            value={form.printerName}
            onChange={(e) => updateForm("printerName", e.target.value)}
            placeholder={SettingsConstants.TEXTS.PRINTER_PLACEHOLDER}
            className="bg-[var(--settings-background)] border-[var(--settings-border)] text-[var(--settings-foreground)]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
