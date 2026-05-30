"use client";

import { useEffect } from "react";

export default function SuppliersError({
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
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Kuch galat ho gaya!</h2>
        <p className="text-[var(--supplier-muted-text)]">
          Suppliers load karne me problem aayi hai.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="rounded-md bg-[var(--supplier-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--supplier-primary-text)] shadow transition-colors"
      >
        Dobara koshish karein
      </button>
    </div>
  );
}
