import React from "react";
import { Zap } from "lucide-react";

export function DemoHint() {
  return (
    <div className="mb-4 rounded-xl border bg-[var(--signup-demo-bg)] border-[var(--signup-demo-border)] px-4 py-3 flex items-start gap-2.5">
      <Zap className="h-4 w-4 text-[var(--signup-demo-icon)] shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold text-[var(--signup-demo-title)]">Demo Data Already Filled Hai!</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Seedha "Register Karein" button dabao aur app explore karo.</p>
      </div>
    </div>
  );
}
