import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle } from "lucide-react";
import { SettingsForm } from "./types";

interface WhatsAppSettingsCardProps {
  form: SettingsForm;
  update: (key: keyof SettingsForm, value: string | boolean | number) => void;
}

export function WhatsAppSettingsCard({ form, update }: WhatsAppSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[var(--settings-whatsapp-icon)]" /> WhatsApp Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <Label>WhatsApp Number</Label>
          <Input
            value={form.whatsappNumber}
            onChange={(e) => update("whatsappNumber", e.target.value)}
            placeholder="9876543210"
          />
        </div>
      </CardContent>
    </Card>
  );
}
