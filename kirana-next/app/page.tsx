"use client";

import "./landing.css";
import Link from "next/link";
import Image from "next/image";
import {
  Store, ShoppingCart, BookOpen, Package, BarChart3,
  CheckCircle2, ArrowRight, Star, Smartphone, Printer,
  IndianRupee, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

const features = [
  { icon: ShoppingCart, title: "Instant Billing", hindiTitle: "तुरंत बिल बनाओ", desc: "Cash, UPI ya Khata — 3 second mein bill ready. Barcode scan bhi.", iconBg: "bg-[var(--landing-feature-billing-bg)]", iconColor: "text-[var(--landing-feature-billing-text)]", sub: "text-[var(--landing-feature-billing-text)]" },
  { icon: BookOpen, title: "Digital Khata", hindiTitle: "डिजिटल खाता", desc: "Kaun kitna udhar liya — sab track karo. WhatsApp reminder bhi.", iconBg: "bg-[var(--landing-feature-khata-bg)]", iconColor: "text-[var(--landing-feature-khata-text)]", sub: "text-[var(--landing-feature-khata-text)]" },
  { icon: Package, title: "Stock Alert", hindiTitle: "स्टॉक अलर्ट", desc: "Kaunsa saman khatam hone wala hai — pehle se pata chale.", iconBg: "bg-[var(--landing-feature-stock-bg)]", iconColor: "text-[var(--landing-feature-stock-text)]", sub: "text-[var(--landing-feature-stock-text)]" },
  { icon: BarChart3, title: "Daily Reports", hindiTitle: "रोज़ की रिपोर्ट", desc: "Aaj kitna bika, kitna munaafa hua — ek nazar mein. GST bhi.", iconBg: "bg-[var(--landing-feature-reports-bg)]", iconColor: "text-[var(--landing-feature-reports-text)]", sub: "text-[var(--landing-feature-reports-text)]" },
  { icon: Printer, title: "Thermal Print", hindiTitle: "थर्मल प्रिंट", desc: "Seedha thermal printer se bill print karo. Pakka receipt do.", iconBg: "bg-[var(--landing-feature-billing-bg)]", iconColor: "text-[var(--landing-feature-billing-text)]", sub: "text-[var(--landing-feature-billing-text)]" },
  { icon: Smartphone, title: "Mobile First", hindiTitle: "मोबाइल पर चलाओ", desc: "Phone pe bhi, computer pe bhi — kahin se bhi manage karo.", iconBg: "bg-[var(--landing-feature-reports-bg)]", iconColor: "text-[var(--landing-feature-reports-text)]", sub: "text-[var(--landing-feature-reports-text)]" },
];

const problems = [
  { problem: "Udhar diya, bhool gaye — paise gaye", solution: "Digital Khata mein sab record, WhatsApp reminder automatic" },
  { problem: "Saman khatam, customer aaya — embarrassment", solution: "Low stock alert pehle se milega, kabhi out of stock nahi" },
  { problem: "Din bhar kaam kiya, munaafa pata nahi", solution: "Har din ka profit, sale, discount — sab ek jagah" },
  { problem: "Bill likhne mein time, queue lag jaati hai", solution: "3 second mein bill ready, barcode scan support" },
  { problem: "GST bill banana mushkil, accountant pe depend", solution: "GST bill automatic generate, print bhi karo" },
  { problem: "Purana register kho gaya — sab data gaya", solution: "Cloud mein safe, kabhi data nahi jayega" },
];

const steps = [
  { step: "1", title: "Register Karo", desc: "Phone number se free account — 2 minute mein", bg: "bg-[var(--landing-step1-bg)]", text: "text-[var(--landing-step1-text)]", border: "border-[var(--landing-step1-border)]" },
  { step: "2", title: "Dukaan Setup Karo", desc: "Products aur customers add karo — bas", bg: "bg-[var(--landing-step2-bg)]", text: "text-[var(--landing-step2-text)]", border: "border-[var(--landing-step2-border)]" },
  { step: "3", title: "Billing Shuru Karo", desc: "Aaj se digital billing, khata, stock sab", bg: "bg-[var(--landing-step3-bg)]", text: "text-[var(--landing-step3-text)]", border: "border-[var(--landing-step3-border)]" },
];

const testimonials = [
  { name: "Ramesh Kumar", shop: "Ramesh General Store, Patna", text: "Pehle register mein likhta tha, ab phone se hi sab ho jaata hai. Udhar track karna bahut easy ho gaya.", rating: 5, avatar: "R" },
  { name: "Sunita Devi", shop: "Sunita Kirana, Muzaffarpur", text: "WhatsApp reminder feature best hai! Customers khud payment kar dete hain ab.", rating: 5, avatar: "S" },
  { name: "Mohan Lal", shop: "Mohan Provision Store, Gaya", text: "Stock alert se kabhi saman khatam nahi hota. Bahut fayda hua business mein.", rating: 5, avatar: "M" },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Store className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight">Smart Kirana</span>
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#problems" className="hover:text-foreground transition-colors">Kyun Use Karein</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/login"><Button variant="outline" size="sm" className="h-8 text-xs">Login</Button></Link>
            <Link href="/signup"><Button size="sm" className="h-8 text-xs">Free Shuru Karein</Button></Link>
          </div>

          <button className="md:hidden p-1.5 rounded-lg hover:bg-muted" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-card px-4 py-3 space-y-1">
            <a href="#features" className="block text-sm font-medium py-2 border-b" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#problems" className="block text-sm font-medium py-2 border-b" onClick={() => setMenuOpen(false)}>Kyun Use Karein</a>
            <a href="#testimonials" className="block text-sm font-medium py-2 border-b" onClick={() => setMenuOpen(false)}>Reviews</a>
            <div className="flex gap-2 pt-3">
              <Link href="/login" className="flex-1"><Button variant="outline" className="w-full h-10">Login</Button></Link>
              <Link href="/signup" className="flex-1"><Button className="w-full h-10">Register</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&q=80&auto=format&fit=crop" alt="Kirana store" fill className="object-cover opacity-10" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/75 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-12 pb-10 md:pt-20 md:pb-16 text-center">
          <Badge className="mb-4 bg-[var(--landing-hero-badge-bg)] text-[var(--landing-hero-badge-text)] border-[var(--landing-hero-badge-border)] px-3 py-1 text-xs font-medium">
            🇮🇳 India ke Kirana Shops ke liye
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Apni Dukaan Ko{" "}
            <span className="text-[var(--landing-hero-highlight)]">Smart</span>{" "}
            Banao
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-2">
            Billing, Khata, Stock, Reports — sab ek app mein.
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-7">
            Aaj se hi apni dukaan ka hisaab digital karo. <strong className="text-foreground">Bilkul free.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-7 font-bold shadow-md gap-2">
                Free Mein Shuru Karein <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-7 font-semibold">
                Login Karein
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">No credit card · 2 minute setup · Mobile friendly</p>

          <div className="mt-10 relative mx-auto max-w-3xl rounded-xl overflow-hidden border shadow-xl">
            <Image src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80&auto=format&fit=crop" alt="Smart Kirana Dashboard" width={1200} height={550} className="w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 flex-wrap justify-center px-3">
              {["Billing", "Khata", "Stock", "Reports"].map((t) => (
                <span key={t} className="bg-card/90 backdrop-blur-sm border rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-sm">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y bg-card">
        <div className="mx-auto max-w-5xl px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: "10,000+", label: "Dukaan Registered" },
            { value: "₹50 Cr+", label: "Bills Generated" },
            { value: "2 Min", label: "Setup Time" },
            { value: "Free", label: "Hamesha ke liye" },
          ].map((s) => (
            <div key={s.label} className="py-1">
              <p className="text-xl sm:text-2xl font-extrabold text-[var(--landing-stats-value)]">{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem → Solution ── */}
      <section id="problems" className="py-12 md:py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-[var(--landing-badge-problems-bg)] text-[var(--landing-badge-problems-text)] border-[var(--landing-badge-problems-border)]">Real Problems</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Ye Problems Aapko Bhi Hoti Hain?</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">Har kirana dukaan wale ko ye problems hoti hain — Smart Kirana inhe solve karta hai</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((p, i) => (
              <div key={i} className="rounded-xl border bg-card p-4 space-y-2.5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-[var(--landing-problem-icon-bg)] flex items-center justify-center shrink-0 mt-0.5">
                    <X className="h-3.5 w-3.5 text-[var(--landing-problem-icon)]" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug pt-0.5">{p.problem}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-[var(--landing-solution-icon-bg)] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--landing-solution-icon)]" />
                  </div>
                  <p className="text-xs font-semibold leading-snug pt-0.5">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-[var(--landing-badge-features-bg)] text-[var(--landing-badge-features-text)] border-[var(--landing-badge-features-border)]">Features</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Sab Kuch Ek Jagah</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">Alag alag apps ki zaroorat nahi — billing se reports tak sab Smart Kirana mein</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="rounded-xl border bg-card p-4 space-y-3 hover:shadow-sm transition-shadow">
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", f.iconBg)}>
                  <f.icon className={cn("h-4 w-4", f.iconColor)} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{f.title}</h3>
                  <p className={cn("text-[11px] font-medium mb-1", f.sub)}>{f.hindiTitle}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-12 md:py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-3 bg-[var(--landing-badge-steps-bg)] text-[var(--landing-badge-steps-text)] border-[var(--landing-badge-steps-border)]">Shuru Karna Aasaan Hai</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">3 Steps Mein Ready</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <div className={cn("h-12 w-12 rounded-2xl border-2 flex items-center justify-center text-xl font-extrabold", s.bg, s.text, s.border)}>
                  {s.step}
                </div>
                <h3 className="font-bold text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-[var(--landing-badge-reviews-bg)] text-[var(--landing-badge-reviews-text)] border-[var(--landing-badge-reviews-border)]">Reviews</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dukaan Wale Kya Kehte Hain</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-[var(--landing-star-color)] text-[var(--landing-star-color)]" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[var(--landing-avatar-bg)] text-[var(--landing-avatar-text)] flex items-center justify-center font-bold text-xs shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-xs">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.shop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80&auto=format&fit=crop" alt="background" fill className="object-cover opacity-5" />
        </div>
        <div className="relative z-10 mx-auto max-w-xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">Aaj Se Hi Shuru Karo</h2>
          <p className="text-muted-foreground mb-6 text-sm">Hazaaron kirana dukaan wale already use kar rahe hain. Aap kab shuru karenge?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8 font-bold gap-2 shadow-md">
                Free Mein Register Karein <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 font-semibold">Login Karein</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Free hai · No credit card · Kabhi bhi band karo</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-card py-5 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Store className="h-3 w-3" />
            </div>
            <span className="font-bold text-sm">Smart Kirana Store</span>
          </div>
          <p className="text-[11px] text-muted-foreground text-center">Made with ❤️ for India's Kirana Shops</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-primary transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
