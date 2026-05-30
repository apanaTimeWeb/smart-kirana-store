"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-[var(--reports-card-bg)] rounded-xl border border-[var(--reports-border)]">
      <h2 className="text-2xl font-bold mb-4 text-[var(--reports-foreground)]">Something went wrong in Reports!</h2>
      <p className="text-[var(--reports-muted-text)] mb-6">{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
