"use client";

import React from "react";
import { Info } from "lucide-react";

export function AuthDemoHint() {
  return (
    <div className="bg-[var(--auth-demo-bg)] border border-[var(--auth-demo-border)] rounded-lg p-3 text-sm flex gap-3 mt-4">
      <Info className="h-5 w-5 text-[var(--auth-demo-icon)] shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-[var(--auth-demo-title)]">Demo Mode</p>
        <p className="text-[var(--auth-muted-text)] text-xs mt-0.5">
          Koi bhi number/password daal ke "Login" ya "Register" dabayein. Dashboard khul jayega.
        </p>
      </div>
    </div>
  );
}
