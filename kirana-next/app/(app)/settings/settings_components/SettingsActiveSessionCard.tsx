"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SettingsConstants } from "./SettingsConstants";
import { SettingsActiveSessionDeviceIconResolver } from "./SettingsActiveSessionDeviceIconResolver";
import type { SettingsActiveSession } from "./SettingsTypes";

interface SettingsActiveSessionCardProps {
  session: SettingsActiveSession;
}

/**
 * SettingsActiveSessionCard
 * Responsibility: Renders ONE active session row.
 * Displays: device icon, device name, IP, location, last active time, and logout button.
 * State: Uses useToast for logout confirmation feedback only.
 * Props: Receives a single `session` object — zero coupling to any data-fetching logic.
 */
export function SettingsActiveSessionCard({ session }: SettingsActiveSessionCardProps) {
  const { toast } = useToast();

  const handleLogoutDevice = () => {
    const message = SettingsConstants.TEXTS.LOGOUT_CONFIRM.replace("{0}", session.deviceName);
    if (confirm(message)) {
      // 🔁 BACKEND INTEGRATION POINT: Call logout API here (e.g. mutate({ sessionId: session.id }))
      toast({
        title: SettingsConstants.TEXTS.LOGOUT_SUCCESS.replace("{0}", session.deviceName),
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
        session.isCurrent
          ? "border-[var(--settings-primary)] bg-[var(--settings-primary-bg)] shadow-sm"
          : "border-[var(--settings-border)] hover:bg-[var(--settings-muted-hover-bg)]"
      }`}
    >
      <div className="flex items-center gap-4">
        <SettingsActiveSessionDeviceIconResolver deviceType={session.deviceType} />
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
          onClick={handleLogoutDevice}
          className="bg-[var(--settings-destructive)] text-white hover:opacity-90"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {SettingsConstants.TEXTS.LOGOUT}
        </Button>
      )}
    </div>
  );
}
