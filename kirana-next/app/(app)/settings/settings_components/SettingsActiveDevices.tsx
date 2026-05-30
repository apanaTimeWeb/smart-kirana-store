"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { SettingsConstants } from "./SettingsConstants";
import { useSettingsActiveSessions } from "./SettingsActiveSessionsDataHook";
import { SettingsActiveSessionCard } from "./SettingsActiveSessionCard";

/**
 * SettingsActiveDevices
 * Responsibility: Orchestrates the "Active Devices & Sessions" security card.
 * - Fetches session list via useSettingsActiveSessions hook
 * - Renders loading / empty / list states
 * - Delegates each session row to SettingsActiveSessionCard
 * - Displays the security tip footer
 *
 * This component has ZERO data-fetching logic and ZERO session card rendering logic.
 */
export function SettingsActiveDevices() {
  const { data: activeSessions, isLoading: sessionsLoading } = useSettingsActiveSessions();

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
              <SettingsActiveSessionCard key={session.id} session={session} />
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
