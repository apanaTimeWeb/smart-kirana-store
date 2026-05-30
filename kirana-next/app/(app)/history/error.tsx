"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function HistoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("History Module Error:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--history-destructive-bg)]">
        <AlertTriangle className="h-10 w-10 text-[var(--history-destructive-text)]" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Failed to load History</h2>
        <p className="text-[var(--history-muted-text)] max-w-[500px]">
          There was a problem loading the bill history. Please try again.
        </p>
      </div>
      <Button onClick={() => reset()} variant="default">
        Try again
      </Button>
    </div>
  );
}
