"use client";

import React from "react";
import { ReportsConstants } from "../../constants/ReportsSharedConstants";

export function ReportsHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--reports-foreground)]">
        {ReportsConstants.TEXTS.TITLE}
      </h1>
      <p className="mt-0.5 text-xs text-[var(--reports-muted-text)]">
        {ReportsConstants.TEXTS.SUBTITLE}
      </p>
    </div>
  );
}
