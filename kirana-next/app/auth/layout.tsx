import React from "react";
// CSS import lives here once so login/page.tsx and signup/page.tsx stay clean.
import "./auth.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-4 py-8"
         style={{ background: "var(--auth-muted-bg)" }}>
      {children}
    </div>
  );
}
