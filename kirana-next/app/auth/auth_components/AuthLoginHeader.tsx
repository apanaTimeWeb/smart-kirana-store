"use client";

import React from "react";
import { Store } from "lucide-react";

export function AuthLoginHeader() {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--auth-logo-bg)] text-[var(--auth-logo-text)] mb-4">
        <Store className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--auth-foreground)]">Smart Kirana</h1>
      <p className="text-[var(--auth-muted-text)] mt-1">Dukaan ka digital khata</p>
    </div>
  );
}
