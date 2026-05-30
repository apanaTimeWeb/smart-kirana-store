import React from "react";
import { Monitor, Smartphone, Tablet, Shield } from "lucide-react";
import type { DeviceType } from "../../types/SettingsTypes";

/**
 * SettingsActiveSessionDeviceIconResolver
 * Responsibility: Given a DeviceType, returns the correct Lucide icon element.
 * This is a pure utility component — zero state, zero side effects.
 * Adding a new device type requires ONLY updating SettingsSharedConstants.ts + this file.
 */
export function SettingsActiveSessionDeviceIconResolver({
  deviceType,
}: {
  deviceType: DeviceType;
}) {
  switch (deviceType) {
    case "Computer":
      return <Monitor className="h-5 w-5 text-[var(--settings-device-computer)]" />;
    case "Mobile":
      return <Smartphone className="h-5 w-5 text-[var(--settings-device-mobile)]" />;
    case "Tablet":
      return <Tablet className="h-5 w-5 text-[var(--settings-device-tablet)]" />;
    default:
      return <Shield className="h-5 w-5 text-[var(--settings-muted-text)]" />;
  }
}
