"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useSettings } from "../../settings_context/SettingsContext";
import { SettingsSharedConstants } from "../../settings_constants/SettingsSharedConstants";

export function SettingsSaveAction() {
  const { isDirty, isSaving, saveSettings } = useSettings();

  return (
    <Button
      onClick={saveSettings}
      disabled={isSaving || !isDirty}
      size="lg"
      className="w-full text-lg h-12 bg-[var(--settings-primary)] hover:opacity-90"
    >
      {isSaving ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          {SettingsSharedConstants.TEXTS.SAVING}
        </>
      ) : (
        <>
          <Save className="h-5 w-5 mr-2" />
          {SettingsSharedConstants.TEXTS.SAVE_ALL}
        </>
      )}
    </Button>
  );
}
