// Server Component — no hooks used here directly.
// AuthProvider and its children handle all client-side logic.
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthProvider } from "../context/AuthContext";
import { AuthLoginHeader } from "../components/Login/AuthLoginHeader";
import { AuthLoginForm } from "../components/Login/AuthLoginForm";
import { AuthDemoHint } from "../components/Shared/AuthDemoHint";

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium mb-6 transition-colors text-[var(--auth-muted-text)] hover:text-[var(--auth-back-hover)]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home pe wapas
        </Link>

        <AuthLoginHeader />
        <AuthLoginForm />
        <AuthDemoHint />
      </div>
    </AuthProvider>
  );
}
