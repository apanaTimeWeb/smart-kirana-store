import React from "react";
import { Store } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--login-logo-bg)] text-[var(--login-logo-text)] shadow-lg mb-3">
        <Store className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-bold tracking-tight">Smart Kirana</h1>
      <p className="text-xs text-muted-foreground mt-1">Apni dukaan mein wapas aayein</p>
    </div>
  );
}
