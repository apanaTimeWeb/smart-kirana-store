import "./signup.css";
import Link from "next/link";
import { SignupHeader } from "./signup_components/SignupHeader";
import { DemoHint } from "./signup_components/DemoHint";
import { SignupForm } from "./signup_components/SignupForm";

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">
      <SignupHeader />
      <DemoHint />
      <SignupForm />

      <p className="text-center text-xs text-muted-foreground mt-4">
        <Link href="/" className="hover:text-[var(--signup-back-hover)] transition-colors">
          ← Wapas Home Par
        </Link>
      </p>
    </div>
  );
}
