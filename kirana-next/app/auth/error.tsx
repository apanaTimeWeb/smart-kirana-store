"use client";

/**
 * error.tsx — Auth Module Error Boundary
 *
 * Next.js automatically renders this if any Server Component in the auth
 * route segment throws. MUST be "use client" — Next.js requirement for
 * error boundaries (they use React's error boundary class internally).
 */

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error("[Auth Error]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--auth-muted-bg)" }}
    >
      <div
        className="w-full max-w-md rounded-xl border p-8 text-center space-y-4"
        style={{
          background: "var(--auth-card-bg)",
          borderColor: "var(--auth-border)",
        }}
      >
        <div
          className="inline-flex h-14 w-14 items-center justify-center rounded-full mx-auto"
          style={{ background: "var(--auth-demo-bg)" }}
        >
          <AlertTriangle
            className="h-7 w-7"
            style={{ color: "var(--auth-demo-icon)" }}
          />
        </div>

        <div className="space-y-1">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--auth-foreground)" }}
          >
            Kuch gadbad ho gayi
          </h2>
          <p
            className="text-sm"
            style={{ color: "var(--auth-muted-text)" }}
          >
            Authentication page load nahi ho saki. Please dobara try karein.
          </p>
        </div>

        <Button
          onClick={reset}
          className="gap-2"
          style={{
            background: "var(--auth-primary-bg)",
            color: "var(--auth-primary-text)",
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Dobara Try Karein
        </Button>
      </div>
    </div>
  );
}
