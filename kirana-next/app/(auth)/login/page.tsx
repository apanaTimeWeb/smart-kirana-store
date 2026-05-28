import "./login.css";
import Link from "next/link";
import { LoginHeader } from "./login_components/LoginHeader";
import { DemoHint } from "./login_components/DemoHint";
import { LoginForm } from "./login_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <LoginHeader />
      <DemoHint />
      <LoginForm />

      <p className="text-center text-xs text-muted-foreground mt-4">
        <Link href="/" className="hover:text-[var(--login-back-hover)] transition-colors">
          ← Wapas Home Par
        </Link>
      </p>
    </div>
  );
}
