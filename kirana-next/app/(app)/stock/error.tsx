"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Stock Module Error:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-destructive">Kuch galat ho gaya (Stock Module)</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={() => reset()}>Phir se try karein</Button>
    </div>
  );
}
