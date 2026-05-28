import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";
import { SettingsForm } from "./types";

interface ShopDetailsCardProps {
  form: SettingsForm;
  update: (key: keyof SettingsForm, value: string | boolean | number) => void;
}

export function ShopDetailsCard({ form, update }: ShopDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" /> Dukaan Details
        </CardTitle>
        <CardDescription>Aapki dukaan ki basic information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Dukaan Ka Naam</Label>
            <Input
              value={form.shopName}
              onChange={(e) => update("shopName", e.target.value)}
              placeholder="Ramesh General Store"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Malik Ka Naam</Label>
            <Input
              value={form.ownerName}
              onChange={(e) => update("ownerName", e.target.value)}
              placeholder="Ramesh Kumar"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Pata (Address)</Label>
          <Input
            value={form.shopAddress}
            onChange={(e) => update("shopAddress", e.target.value)}
            placeholder="Gandhi Nagar, Patna"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Phone Number</Label>
            <Input
              value={form.shopPhone}
              onChange={(e) => update("shopPhone", e.target.value)}
              placeholder="9876543210"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Currency Symbol</Label>
            <Input
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="w-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
