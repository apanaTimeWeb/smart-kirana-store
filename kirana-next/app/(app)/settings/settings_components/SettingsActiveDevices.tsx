"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Monitor, Smartphone, Tablet, LogOut, Shield } from "lucide-react";
import { SettingsConstants } from "./SettingsConstants";
import type { SettingsActiveSession } from "./SettingsTypes";

// Mock Hook (Backend mein real API call replace kar dena)
const useGetActiveSessions = () => {
  const [sessions] = useState<SettingsActiveSession[]>([
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

export function SettingsActiveDevices() {
  const { data: activeSessions = [], isLoading: sessionsLoading } = useGetActiveSessions();
  const { toast } = useToast();

  const handleLogoutDevice = (sessionId: string, deviceName: string) => {
    const message = SettingsConstants.TEXTS.LOGOUT_CONFIRM.replace("{0}", deviceName);
    if (confirm(message)) {
      // TODO: Backend logout API call
      toast({ title: SettingsConstants.TEXTS.LOGOUT_SUCCESS.replace("{0}", deviceName) });
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Computer": return <Monitor className="h-5 w-5 text-[var(--settings-device-computer)]" />;
      case "Mobile": return <Smartphone className="h-5 w-5 text-[var(--settings-device-mobile)]" />;
      case "Tablet": return <Tablet className="h-5 w-5 text-[var(--settings-device-tablet)]" />;
      default: return <Shield className="h-5 w-5 text-[var(--settings-muted-text)]" />;
    }
  };

  return (
    <Card className="bg-[var(--settings-card-bg)] border-[var(--settings-border)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--settings-foreground)]">
          <Shield className="h-5 w-5 text-[var(--settings-primary)]" />{" "}
          {SettingsConstants.TEXTS.ACTIVE_DEVICES}
        </CardTitle>
        <CardDescription className="text-[var(--settings-muted-text)]">
          {SettingsConstants.TEXTS.ACTIVE_DEVICES_DESC}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessionsLoading ? (
          <p className="text-[var(--settings-muted-text)]">{SettingsConstants.TEXTS.LOADING_DEVICES}</p>
        ) : activeSessions.length === 0 ? (
          <p className="text-[var(--settings-muted-text)]">{SettingsConstants.TEXTS.NO_SESSIONS}</p>
        ) : (
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  session.isCurrent
                    ? "border-[var(--settings-primary)] bg-[var(--settings-primary-bg)] shadow-sm"
                    : "border-[var(--settings-border)] hover:bg-[var(--settings-muted-hover-bg)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {getDeviceIcon(session.deviceType)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[var(--settings-foreground)]">{session.deviceName}</p>
                      {session.isCurrent && (
                        <Badge className="bg-[var(--settings-primary)] text-white hover:bg-[var(--settings-primary)]">
                          {SettingsConstants.TEXTS.CURRENT_DEVICE}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--settings-muted-text)] mt-0.5">
                      {session.ip} • {session.location || SettingsConstants.TEXTS.UNKNOWN_LOCATION}
                    </p>
                    <p className="text-xs text-[var(--settings-muted-text)] mt-1">
                      {SettingsConstants.TEXTS.LAST_ACTIVE}: {session.lastActive}
                    </p>
                  </div>
                </div>

                {!session.isCurrent && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleLogoutDevice(session.id, session.deviceName)}
                    className="bg-[var(--settings-destructive)] text-white hover:opacity-90"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {SettingsConstants.TEXTS.LOGOUT}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-[var(--settings-muted-text)] mt-6 bg-[var(--settings-muted-bg)] p-4 rounded-xl">
          {SettingsConstants.TEXTS.SECURITY_TIP}
        </p>
      </CardContent>
    </Card>
  );
}
