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
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-[var(--khata-card-bg)] rounded-xl border border-[var(--khata-border)]">
      <h2 className="text-2xl font-bold mb-4 text-[var(--khata-foreground)]">Something went wrong in Khata!</h2>
      <p className="text-[var(--khata-muted-text)] mb-6">{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
