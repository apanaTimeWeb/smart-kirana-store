import React from "react";
import { SettingsConstants } from "./SettingsConstants";

export function SettingsHeader() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-[var(--settings-foreground)]">
        {SettingsConstants.TEXTS.TITLE}
      </h1>
      <p className="mt-1 text-[var(--settings-muted-text)]">
        {SettingsConstants.TEXTS.SUBTITLE}
      </p>
    </div>
  );
}
