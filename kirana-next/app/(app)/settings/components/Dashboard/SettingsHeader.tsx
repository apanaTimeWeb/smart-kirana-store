import React from "react";
import { SettingsSharedConstants } from "../../constants/SettingsSharedConstants";

export function SettingsHeader() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-[var(--settings-foreground)]">
        {SettingsSharedConstants.TEXTS.TITLE}
      </h1>
      <p className="mt-1 text-[var(--settings-muted-text)]">
        {SettingsSharedConstants.TEXTS.SUBTITLE}
      </p>
    </div>
  );
}
