"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";
import { AUTH_PLACEHOLDERS } from "../../constants/AuthConstants";

export function AuthLoginForm() {
  const { login, isLoginLoading } = useAuth();
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState<string>(AUTH_PLACEHOLDERS.login.phone);
  const [password, setPassword] = useState<string>(AUTH_PLACEHOLDERS.login.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ phone, password });
  };

  return (
    <Card className="border border-[var(--auth-border)] shadow-sm bg-[var(--auth-card-bg)]">
      <CardContent className="px-5 pb-5 pt-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs text-[var(--auth-foreground)]">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs text-[var(--auth-foreground)]">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--auth-muted-text)] hover:text-[var(--auth-foreground)]"
              >
                {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-10 font-semibold gap-2 bg-[var(--auth-primary-bg)] text-[var(--auth-primary-text)]" disabled={isLoginLoading}>
            {isLoginLoading ? "Login ho raha hai..." : <><ArrowRight className="h-4 w-4" /> Login Karein</>}
          </Button>
        </form>

        <div className="mt-4 text-center text-xs text-[var(--auth-muted-text)]">
          Naya account?{" "}
          <Link href="/auth/signup" className="text-[var(--auth-link-text)] font-semibold hover:underline">
            Register Karein
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
