import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";
import { SettingsForm } from "./types";

interface PrinterSetupCardProps {
  form: SettingsForm;
  update: (key: keyof SettingsForm, value: string | boolean | number) => void;
}

export function PrinterSetupCard({ form, update }: PrinterSetupCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5 text-primary" /> Printer Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <Label>Printer Name / IP Address</Label>
          <Input
            value={form.printerName}
            onChange={(e) => update("printerName", e.target.value)}
            placeholder="Epson TM-T82 or 192.168.1.100"
          />
        </div>
      </CardContent>
    </Card>
  );
}
