// Server Component — no hooks used here directly.
// AuthProvider and its children handle all client-side logic.
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthProvider } from "../context/AuthContext";
import { AuthSignupHeader } from "../components/Signup/AuthSignupHeader";
import { AuthSignupForm } from "../components/Signup/AuthSignupForm";
import { AuthDemoHint } from "../components/Shared/AuthDemoHint";

export default function SignupPage() {
  return (
    <AuthProvider>
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium mb-6 transition-colors"
          style={{ color: "var(--auth-muted-text)" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--auth-back-hover)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--auth-muted-text)")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home pe wapas
        </Link>

        <AuthSignupHeader />
        <AuthSignupForm />
        <AuthDemoHint />
      </div>
    </AuthProvider>
  );
}
