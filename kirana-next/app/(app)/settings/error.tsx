"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import "./settings.css";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-[var(--settings-card-bg)] rounded-xl border border-[var(--settings-border)]">
      <h2 className="text-2xl font-bold mb-4 text-[var(--settings-foreground)]">Something went wrong in Settings!</h2>
      <p className="text-[var(--settings-muted-text)] mb-6">{error.message}</p>
      <Button onClick={() => reset()} className="bg-[var(--settings-primary)]">Try again</Button>
    </div>
  );
}
