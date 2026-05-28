import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet, LogOut, Shield } from "lucide-react";
import { ActiveSession } from "./types";

interface ActiveDevicesCardProps {
  sessionsLoading: boolean;
  activeSessions: ActiveSession[];
  handleLogoutDevice: (sessionId: string, deviceName: string) => void;
}

export function ActiveDevicesCard({ sessionsLoading, activeSessions, handleLogoutDevice }: ActiveDevicesCardProps) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Computer": return <Monitor className="h-5 w-5 text-[var(--settings-device-computer)]" />;
      case "Mobile": return <Smartphone className="h-5 w-5 text-[var(--settings-device-mobile)]" />;
      case "Tablet": return <Tablet className="h-5 w-5 text-[var(--settings-device-tablet)]" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  return (
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
  );
}
