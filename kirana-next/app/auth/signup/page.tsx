"use client";

import "../auth.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthProvider } from "../auth_components/AuthContext";
import { AuthSignupHeader } from "../auth_components/AuthSignupHeader";
import { AuthSignupForm } from "../auth_components/AuthSignupForm";
import { AuthDemoHint } from "../auth_components/AuthDemoHint";

export default function SignupPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--auth-muted-bg)]">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-[var(--auth-muted-text)] hover:text-[var(--auth-back-hover)] mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home pe wapas
          </Link>

          <AuthSignupHeader />
          <AuthSignupForm />
          <AuthDemoHint />
        </div>
      </div>
    </AuthProvider>
  );
}
