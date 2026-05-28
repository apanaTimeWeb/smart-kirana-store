import React from "react";
import { Zap } from "lucide-react";

export function DemoHint() {
  return (
    <div className="mb-4 rounded-xl border bg-[var(--login-demo-bg)] border-[var(--login-demo-border)] px-4 py-3 flex items-start gap-2.5">
      <Zap className="h-4 w-4 text-[var(--login-demo-icon)] shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold text-[var(--login-demo-title)]">Demo Account — Seedha Login Karein</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Phone aur password already filled hai. Bas button dabao!</p>
      </div>
    </div>
  );
}
