"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Store, ShoppingCart, BookOpen, Package, BarChart3,
  CheckCircle2, ArrowRight, Star, Smartphone, Printer,
  MessageCircle, IndianRupee, TrendingUp, AlertTriangle,
  Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ── Feature data ──────────────────────────────────────────────────────
const features = [
  {
    icon: ShoppingCart,
    title: "Instant Billing",
    hindiTitle: "तुरंत बिल बनाओ",
    desc: "Cash, UPI ya Khata — teen second mein bill ready. Barcode scan bhi karo.",
    color: "bg-[var(--dashboard-sale-bg)] border-[var(--dashboard-sale-border)] text-[var(--dashboard-sale-value)]",
    iconBg: "bg-[var(--dashboard-sale-bg)]",
    iconColor: "text-[var(--dashboard-sale-value)]",
  },
  {
    icon: BookOpen,
    title: "Digital Khata",
    hindiTitle: "डिजिटल खाता",
    desc: "Kaun kitna udhar liya — sab track karo. WhatsApp reminder bhi bhejo.",
    color: "bg-[var(--dashboard-khata-bg)] border-[var(--dashboard-khata-border)] text-[var(--dashboard-khata-value)]",
    iconBg: "bg-[var(--dashboard-khata-bg)]",
    iconColor: "text-[var(--dashboard-khata-value)]",
  },
  {
    icon: Package,
    title: "Stock Alert",
    hindiTitle: "स्टॉक अलर्ट",
    desc: "Kaunsa saman khatam hone wala hai — pehle se pata chale. Kabhi out of stock mat ho.",
    color: "bg-[var(--dashboard-lowstock-bg)] border-[var(--dashboard-lowstock-border)] text-[var(--dashboard-lowstock-value)]",
    iconBg: "bg-[var(--dashboard-lowstock-bg)]",
    iconColor: "text-[var(--dashboard-lowstock-value)]",
  },
  {
    icon: BarChart3,
    title: "Daily Reports",
    hindiTitle: "रोज़ की रिपोर्ट",
    desc: "Aaj kitna bika, kitna munaafa hua — ek nazar mein dekho. GST bill bhi.",
    color: "bg-[var(--dashboard-profit-bg)] border-[var(--dashboard-profit-border)] text-[var(--dashboard-profit-value)]",
    iconBg: "bg-[var(--dashboard-profit-bg)]",
    iconColor: "text-[var(--dashboard-profit-value)]",
  },
  {
    icon: Printer,
    title: "Thermal Print",
    hindiTitle: "थर्मल प्रिंट",
    desc: "Seedha thermal printer se bill print karo. Customer ko pakka receipt do.",
    color: "bg-[var(--dashboard-sale-bg)] border-[var(--dashboard-sale-border)] text-[var(--dashboard-sale-value)]",
    iconBg: "bg-[var(--dashboard-sale-bg)]",
    iconColor: "text-[var(--dashboard-sale-value)]",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    hindiTitle: "मोबाइल पर चलाओ",
    desc: "Phone pe bhi, computer pe bhi — kahi se bhi apni dukaan manage karo.",
    color: "bg-[var(--dashboard-profit-bg)] border-[var(--dashboard-profit-border)] text-[var(--dashboard-profit-value)]",
    iconBg: "bg-[var(--dashboard-profit-bg)]",
    iconColor: "text-[var(--dashboard-profit-value)]",
  },
];

const problems = [
  {
    problem: "Kaafi baar udhar diya, bhool gaye — paise gaye",
    solution: "Digital Khata mein sab record, WhatsApp reminder automatic",
    icon: BookOpen,
  },
  {
    problem: "Saman khatam ho gaya, customer aaya — embarrassment",
    solution: "Low stock alert pehle se milega, kabhi out of stock nahi",
    icon: AlertTriangle,
  },
  {
    problem: "Din bhar kaam kiya, pata nahi kitna munaafa hua",
    solution: "Har din ka profit, sale, discount — sab ek jagah",
    icon: TrendingUp,
  },
  {
    problem: "Bill likhne mein time lagta hai, queue lag jaati hai",
    solution: "3 second mein bill ready, barcode scan support",
    icon: ShoppingCart,
  },
  {
    problem: "GST bill banana mushkil, accountant pe depend",
    solution: "GST bill automatic generate, print bhi karo",
    icon: IndianRupee,
  },
  {
    problem: "Purana register kho gaya — sab data gaya",
    solution: "Cloud mein safe, kabhi data nahi jayega",
    icon: CheckCircle2,
  },
];

const testimonials = [
  {
    name: "Ramesh Kumar",
    shop: "Ramesh General Store, Patna",
    text: "Pehle register mein likhta tha, ab phone se hi sab ho jaata hai. Udhar track karna bahut easy ho gaya.",
    rating: 5,
    avatar: "R",
  },
  {
    name: "Sunita Devi",
    shop: "Sunita Kirana, Muzaffarpur",
    text: "WhatsApp reminder feature best hai! Customers khud payment kar dete hain ab.",
    rating: 5,
    avatar: "S",
  },
  {
    name: "Mohan Lal",
    shop: "Mohan Provision Store, Gaya",
    text: "Stock alert se kabhi saman khatam nahi hota. Bahut fayda hua business mein.",
    rating: 5,
    avatar: "M",
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Store className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">Smart Kirana</span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">स्मार्ट किराना</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#problems" className="hover:text-foreground transition-colors">Kyun Use Karein</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Free Mein Shuru Karein</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-card px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#problems" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Kyun Use Karein</a>
            <a href="#testimonials" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Reviews</a>
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1"><Button variant="outline" className="w-full">Login</Button></Link>
              <Link href="/signup" className="flex-1"><Button className="w-full">Register</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&q=80&auto=format&fit=crop"
            alt="Kirana store"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-32 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium">
            🇮🇳 India ke Kirana Shops ke liye
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Apni Dukaan Ko{" "}
            <span className="text-primary">Smart</span>{" "}
            Banao
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Billing, Khata, Stock, Reports — sab kuch ek app mein.
          </p>
          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-10">
            Register karo aur aaj se hi apni dukaan ka hisaab digital karo. <strong className="text-foreground">Bilkul free.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="h-13 px-8 text-base font-bold shadow-lg gap-2">
                Free Mein Shuru Karein <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-13 px-8 text-base font-semibold gap-2">
                Login Karein
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required · 2 minute setup · Mobile friendly
          </p>

          {/* Hero image */}
          <div className="mt-16 relative mx-auto max-w-4xl rounded-2xl overflow-hidden border shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80&auto=format&fit=crop"
              alt="Smart Kirana Dashboard"
              width={1200}
              height={600}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {["Billing", "Khata", "Stock", "Reports"].map((t) => (
                <span key={t} className="bg-card/90 backdrop-blur-sm border rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10,000+", label: "Dukaan Registered" },
            { value: "₹50 Cr+", label: "Bills Generated" },
            { value: "2 Min", label: "Setup Time" },
            { value: "Free", label: "Hamesha ke liye" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem → Solution ── */}
      <section id="problems" className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-[var(--dashboard-lowstock-bg)] text-[var(--dashboard-lowstock-value)] border-[var(--dashboard-lowstock-border)]">
              Real Problems
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Ye Problems Aapko Bhi Hoti Hain?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Har kirana dukaan wale ko ye problems face karni padti hain — Smart Kirana inhe solve karta hai
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((p, i) => (
              <div key={i} className="rounded-2xl border bg-card p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">{p.problem}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-[var(--dashboard-profit-bg)] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-[var(--dashboard-profit-value)]" />
                  </div>
                  <p className="text-sm font-medium leading-snug">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-[var(--dashboard-sale-bg)] text-[var(--dashboard-sale-value)] border-[var(--dashboard-sale-border)]">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Sab Kuch Ek Jagah
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Alag alag apps ki zaroorat nahi — billing se lekar reports tak sab Smart Kirana mein
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className={cn("rounded-2xl border p-6 space-y-4 hover:shadow-md transition-shadow bg-card")}>
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", f.iconBg)}>
                  <f.icon className={cn("h-5 w-5", f.iconColor)} />
                </div>
                <div>
                  <h3 className="font-bold text-base">{f.title}</h3>
                  <p className={cn("text-xs font-medium mb-2", f.iconColor)}>{f.hindiTitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-[var(--dashboard-khata-bg)] text-[var(--dashboard-khata-value)] border-[var(--dashboard-khata-border)]">
            Shuru Karna Aasaan Hai
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-12">
            3 Steps Mein Ready
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Register Karo", desc: "Phone number se free account banao — 2 minute mein", color: "bg-[var(--dashboard-sale-bg)] text-[var(--dashboard-sale-value)] border-[var(--dashboard-sale-border)]" },
              { step: "2", title: "Dukaan Setup Karo", desc: "Products add karo, customers add karo — bas", color: "bg-[var(--dashboard-khata-bg)] text-[var(--dashboard-khata-value)] border-[var(--dashboard-khata-border)]" },
              { step: "3", title: "Billing Shuru Karo", desc: "Aaj se hi digital billing, khata, stock sab manage karo", color: "bg-[var(--dashboard-profit-bg)] text-[var(--dashboard-profit-value)] border-[var(--dashboard-profit-border)]" },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-4">
                <div className={cn("h-14 w-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-extrabold", s.color)}>
                  {s.step}
                </div>
                <h3 className="font-bold text-base">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-[var(--dashboard-profit-bg)] text-[var(--dashboard-profit-value)] border-[var(--dashboard-profit-border)]">
              Reviews
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Dukaan Wale Kya Kehte Hain
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border bg-card p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[var(--dashboard-khata-value)] text-[var(--dashboard-khata-value)]" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.shop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80&auto=format&fit=crop"
            alt="Kirana store background"
            fill
            className="object-cover opacity-5"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Aaj Se Hi Shuru Karo
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Hazaaron kirana dukaan wale already use kar rahe hain. Aap kab shuru karenge?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-10 h-13 text-base font-bold gap-2 shadow-lg">
                Free Mein Register Karein <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-10 h-13 text-base font-semibold">
                Login Karein
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Free hai · No credit card · Kabhi bhi band karo
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-card py-8 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Store className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-sm">Smart Kirana Store</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Made with ❤️ for India's Kirana Shops · Vyapar jitna useful, Khatabook jitna simple
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-primary transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
