"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Store, Printer, FileText, MessageCircle, Save, Loader2, 
  Monitor, Smartphone, Tablet, LogOut, Shield 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useGetSettings, useUpdateSettings } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { getSettingsQueryKey } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type ActiveSession = {
  id: string;
  deviceType: "Computer" | "Mobile" | "Tablet" | "Other";
  deviceName: string;
  ip: string;
  location?: string;
  lastActive: string;
  isCurrent: boolean;
};

// Mock Hook (Backend mein real API call replace kar dena)
const useGetActiveSessions = () => {
  const [sessions] = useState<ActiveSession[]>([
    {
      id: "1",
      deviceType: "Computer",
      deviceName: "Windows PC - Chrome",
      ip: "182.68.45.123",
      location: "Patna, Bihar",
      lastActive: "Just now",
      isCurrent: true,
    },
    {
      id: "2",
      deviceType: "Mobile",
      deviceName: "Redmi Note 12",
      ip: "182.68.112.78",
      location: "Patna, Bihar",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
  ]);

  return { data: sessions, isLoading: false };
};

type SettingsForm = {
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  ownerName: string;
  gstNumber: string;
  gstEnabled: boolean;
  currency: string;
  lowStockThreshold: number;
  whatsappNumber: string;
  printerName: string;
};

const DEFAULTS: SettingsForm = {
  shopName: "Smart Kirana Store",
  shopAddress: "",
  shopPhone: "",
  ownerName: "",
  gstNumber: "",
  gstEnabled: false,
  currency: "₹",
  lowStockThreshold: 5,
  whatsappNumber: "",
  printerName: "",
};

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: serverSettings, isLoading: settingsLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const { data: activeSessions = [], isLoading: sessionsLoading } = useGetActiveSessions();

  const [form, setForm] = useState<SettingsForm>(DEFAULTS);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (serverSettings) {
      setForm({
        shopName: serverSettings.shopName ?? DEFAULTS.shopName,
        shopAddress: serverSettings.shopAddress ?? "",
        shopPhone: serverSettings.shopPhone ?? "",
        ownerName: serverSettings.ownerName ?? "",
        gstNumber: serverSettings.gstNumber ?? "",
        gstEnabled: serverSettings.gstEnabled ?? false,
        currency: serverSettings.currency ?? "₹",
        lowStockThreshold: serverSettings.lowStockThreshold ?? 5,
        whatsappNumber: serverSettings.whatsappNumber ?? "",
        printerName: serverSettings.printerName ?? "",
      });
    }
  }, [serverSettings]);

  const update = (key: keyof SettingsForm, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const save = async () => {
    updateSettings.mutate(
      { data: form },
      {
        onSuccess: () => {
          toast({ title: "✅ Settings successfully saved!" });
          queryClient.invalidateQueries({ queryKey: getSettingsQueryKey() });
          setIsDirty(false);
        },
        onError: () => toast({ title: "❌ Failed to save settings", variant: "destructive" }),
      }
    );
  };

  const handleLogoutDevice = (sessionId: string, deviceName: string) => {
    if (confirm(`Kya aap "${deviceName}" se logout karna chahte hain?`)) {
      // TODO: Backend logout API call
      toast({ title: `${deviceName} se logout ho gaya` });
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Computer": return <Monitor className="h-5 w-5 text-blue-600" />;
      case "Mobile": return <Smartphone className="h-5 w-5 text-green-600" />;
      case "Tablet": return <Tablet className="h-5 w-5 text-purple-600" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  if (settingsLoading) {
    return <div className="space-y-6 max-w-3xl">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your shop and security preferences</p>
      </div>

      {/* ==================== SHOP DETAILS ==================== */}
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
              <Input value={form.shopName} onChange={(e) => update("shopName", e.target.value)} placeholder="Ramesh General Store" />
            </div>
            <div className="space-y-1.5">
              <Label>Malik Ka Naam</Label>
              <Input value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} placeholder="Ramesh Kumar" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Pata (Address)</Label>
            <Input value={form.shopAddress} onChange={(e) => update("shopAddress", e.target.value)} placeholder="Gandhi Nagar, Patna" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input value={form.shopPhone} onChange={(e) => update("shopPhone", e.target.value)} placeholder="9876543210" />
            </div>
            <div className="space-y-1.5">
              <Label>Currency Symbol</Label>
              <Input value={form.currency} onChange={(e) => update("currency", e.target.value)} className="w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================== GST ==================== */}
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

      {/* ==================== WHATSAPP ==================== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" /> WhatsApp Settings
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

      {/* ==================== PRINTER ==================== */}
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

      {/* ==================== ACTIVE DEVICES ==================== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Active Devices & Sessions
          </CardTitle>
          <CardDescription>Account kis devices pe logged in hai - Security ke liye monitor karein</CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <p>Loading devices...</p>
          ) : activeSessions.length === 0 ? (
            <p className="text-muted-foreground">No active sessions found.</p>
          ) : (
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                    session.isCurrent 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getDeviceIcon(session.deviceType)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{session.deviceName}</p>
                        {session.isCurrent && <Badge>Current Device</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {session.ip} • {session.location || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last active: {session.lastActive}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleLogoutDevice(session.id, session.deviceName)}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-6 bg-muted/50 p-4 rounded-xl">
            💡 Security Tip: Agar koi anjaan device dikhe to turant logout kar dein.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* ==================== SAVE BUTTON ==================== */}
      <Button 
        onClick={save} 
        disabled={updateSettings.isPending || !isDirty} 
        size="lg" 
        className="w-full text-lg h-12"
      >
        {updateSettings.isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-5 w-5 mr-2" />
            Save All Settings
          </>
        )}
      </Button>
    </div>
  );
}