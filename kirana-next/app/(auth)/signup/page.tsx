"use client";

import Link from "next/link";
import { useState } from "react";
import { Store, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg mb-3">
          <Store className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Smart Kirana</h1>
        <p className="text-sm text-muted-foreground mt-1">Apni dukaan register karein — free mein</p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-4 pt-6 px-6">
          <h2 className="text-lg font-semibold">Naya Account Banayein</h2>
          <p className="text-xs text-muted-foreground">2 minute mein setup ho jayega</p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="shopName">Dukaan Ka Naam</Label>
              <Input id="shopName" placeholder="Ramesh General Store" required className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ownerName">Malik Ka Naam</Label>
              <Input id="ownerName" placeholder="Ramesh Kumar" required className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="9876543210" required className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password Banayein</Label>
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} placeholder="••••••••" required className="h-11 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? "Account ban raha hai..." : <span className="flex items-center gap-2">Register Karein <ArrowRight className="h-4 w-4" /></span>}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            Pehle se account hai?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Login Karein
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        <Link href="/" className="hover:text-primary transition-colors">← Wapas Home Par</Link>
      </p>
    </div>
  );
}
