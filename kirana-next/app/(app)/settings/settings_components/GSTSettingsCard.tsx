import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileText } from "lucide-react";
import { SettingsForm } from "./types";

interface GSTSettingsCardProps {
  form: SettingsForm;
  update: (key: keyof SettingsForm, value: string | boolean | number) => void;
}

export function GSTSettingsCard({ form, update }: GSTSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> GST Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="gstEnabled" className="cursor-pointer">GST Billing Enable Karein</Label>
          <Switch
            id="gstEnabled"
            checked={form.gstEnabled}
            onCheckedChange={(checked) => update("gstEnabled", checked)}
          />
        </div>

        {form.gstEnabled && (
          <div className="space-y-1.5">
            <Label>GST Number (GSTIN)</Label>
            <Input
              value={form.gstNumber}
              onChange={(e) => update("gstNumber", e.target.value.toUpperCase())}
              placeholder="22AAAAA0000A1Z5"
              className="font-mono"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
