"use client";

import "./signup.css";
import Link from "next/link";
import { useState } from "react";
import { Store, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shopName, setShopName] = useState("Ramesh General Store");
  const [ownerName, setOwnerName] = useState("Ramesh Kumar");
  const [phone, setPhone] = useState("9876543210");
  const [password, setPassword] = useState("demo1234");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push("/dashboard"); }, 700);
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--signup-logo-bg)] text-[var(--signup-logo-text)] shadow-lg mb-3">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Smart Kirana</h1>
        <p className="text-xs text-muted-foreground mt-1">Apni dukaan register karein — free mein</p>
      </div>

      {/* Demo hint */}
      <div className="mb-4 rounded-xl border bg-[var(--signup-demo-bg)] border-[var(--signup-demo-border)] px-4 py-3 flex items-start gap-2.5">
        <Zap className="h-4 w-4 text-[var(--signup-demo-icon)] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-[var(--signup-demo-title)]">Demo Data Already Filled Hai!</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Seedha "Register Karein" button dabao aur app explore karo.</p>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3 pt-5 px-5">
          <h2 className="text-base font-semibold">Naya Account Banayein</h2>
          <p className="text-xs text-muted-foreground">2 minute mein setup ho jayega</p>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="shopName" className="text-xs">Dukaan Ka Naam</Label>
              <Input id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} required className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ownerName" className="text-xs">Malik Ka Naam</Label>
              <Input id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password Banayein</Label>
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="h-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-10 font-semibold gap-2" disabled={loading}>
              {loading ? "Account ban raha hai..." : <><ArrowRight className="h-4 w-4" /> Register Karein</>}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            Pehle se account hai?{" "}
            <Link href="/login" className="text-[var(--signup-link-text)] font-semibold hover:underline">
              Login Karein
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-4">
        <Link href="/" className="hover:text-[var(--signup-back-hover)] transition-colors">← Wapas Home Par</Link>
      </p>
    </div>
  );
}
