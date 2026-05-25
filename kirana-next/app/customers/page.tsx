"use client";

import "./customers.css";
import { useState, useMemo } from "react";
import {
  useListCustomers,
  useCreateCustomer,
  useDeleteCustomer,
  useGetCustomer,
  useAddKhataTransaction,
  getListCustomersQueryKey,
  getGetCustomerQueryKey,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Plus, BookOpen, ArrowUpRight, ArrowDownRight, 
  Users, Trash2, MessageCircle, Printer, IndianRupee, 
  CreditCard, X, ChevronRight 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const customerSchema = z.object({
  name: z.string().min(1, "Name required"),
  phone: z.string().min(10, "Phone required"),
  address: z.string().optional(),
});

const txSchema = z.object({
  type: z.enum(["credit", "payment"] as const),
  amount: z.coerce.number().min(0.01, "Amount must be > 0"),
  description: z.string().min(1, "Description required"),
});

function KhataLedger({ customerId }: { customerId: number }) {
  const { data: detail, isLoading } = useGetCustomer(customerId);
  const addTx = useAddKhataTransaction();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [mode, setMode] = useState<"payment" | "credit" | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(txSchema),
    defaultValues: { type: "payment", amount: 0, description: "" },
  });

  const ledgerRows = useMemo(() => {
    if (!detail?.transactions) return [];
    let balance = 0;
    return detail.transactions.map((tx: any) => {
      balance += tx.type === "credit" ? tx.amount : -tx.amount;
      return { ...tx, balance };
    });
  }, [detail?.transactions]);

  const shopName = (() => {
    try {
      const s = typeof window !== "undefined" ? localStorage.getItem("kirana_settings") : null;
      if (s) return JSON.parse(s).shopName || "Smart Kirana Store";
    } catch {}
    return "Smart Kirana Store";
  })();

  const reminderMessage = useMemo(() => {
    if (!detail) return "";
    return `Namaste ${detail.name} Ji,\n\nAapka balance ₹${detail.totalDue.toFixed(2)} pending hai.\n\nKripya jaldi payment kar dein.\n\nThank you\n${shopName}`;
  }, [detail, shopName]);

  const printThermalBill = () => {
    if (!detail) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;

    const rows = ledgerRows.map((tx: any) => `
      <tr>
        <td style="padding:3px 0;">${format(new Date(tx.createdAt), "dd/MM")}</td>
        <td style="padding:3px 0;">${tx.description}</td>
        <td style="padding:3px 0; text-align:right;">${tx.type === "credit" ? "+" : "-"}₹${tx.amount}</td>
        <td style="padding:3px 0; text-align:right;">₹${tx.balance}</td>
      </tr>
    `).join("");

    win.document.write(`
      <html><head><title>Khata Bill</title>
      <style>
        body { font-family: monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 10px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 4px 0; }
        hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
      </style>
      </head><body>
        <div class="center bold"><h2>${shopName}</h2><p>Khata Ledger</p></div>
        <hr/>
        <p><strong>Customer:</strong> ${detail.name}</p>
        <p><strong>Phone:</strong> ${detail.phone}</p>
        <hr/>
        <table><thead><tr><th>Date</th><th>Particulars</th><th style="text-align:right">Amt</th><th style="text-align:right">Bal</th></tr></thead><tbody>${rows}</tbody></table>
        <hr/>
        <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;"><span>Total Due :</span><span>₹${detail.totalDue.toFixed(2)}</span></div>
        <hr/>
        <div class="center" style="margin-top:15px;font-size:12px;">Thank You!</div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 600);
  };

  const openWhatsApp = () => {
    if (!detail) return;
    const phone = detail.phone.replace(/\D/g, "");
    const encoded = encodeURIComponent(reminderMessage);
    window.open(`https://wa.me/91${phone}?text=${encoded}`, "_blank");
  };

  const handleTextOnly = () => {
    openWhatsApp();
    setIsReminderOpen(false);
  };

  const handlePDFAndText = () => {
    printThermalBill();
    setTimeout(() => {
      openWhatsApp();
      setIsReminderOpen(false);
    }, 800);
  };

  if (isLoading) return <div className="py-12 text-center">Loading...</div>;
  if (!detail) return null;

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      {/* Header */}
      <div className="rounded-xl border bg-gradient-to-br from-[var(--customers-header-bg-from)] to-[var(--customers-header-bg-to)] [border-color:var(--customers-header-border)] p-5 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full [background-color:var(--customers-header-avatar-bg)] [color:var(--customers-header-avatar-text)] flex items-center justify-center text-2xl font-bold">
              {detail.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-xl">{detail.name}</p>
              <p className="text-muted-foreground">📞 {detail.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Due</p>
            <p className="text-4xl font-bold [color:var(--customers-header-due-amount)]">₹{detail.totalDue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* 4 Buttons - Center Aligned with Active State */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex flex-wrap gap-3 justify-center [background-color:var(--customers-btn-panel-bg)] border rounded-xl p-2 shadow-sm">
          <Button 
            size="sm" 
            onClick={() => setMode("payment")} 
            className={cn("transition-all", mode === "payment" && "ring-2 ring-offset-2 [--tw-ring-color:var(--customers-btn-payment-ring)] [background-color:var(--customers-btn-payment-active-bg)]")}
          >
            <IndianRupee className="mr-1.5 h-4 w-4" /> Payment Mila
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setMode("credit")} 
            className={cn("transition-all [border-color:var(--customers-btn-credit-border)] [color:var(--customers-btn-credit-text)] hover:[background-color:var(--customers-btn-credit-hover-bg)]",
              mode === "credit" && "ring-2 ring-offset-2 [--tw-ring-color:var(--customers-btn-credit-ring)] [background-color:var(--customers-btn-credit-active-bg)]")}
          >
            <CreditCard className="mr-1.5 h-4 w-4" /> Udhaar Diya
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsReminderOpen(true)} 
            className="[border-color:var(--customers-btn-reminder-border)] [color:var(--customers-btn-reminder-text)] hover:[background-color:var(--customers-btn-reminder-hover-bg)]"
          >
            <MessageCircle className="mr-1.5 h-4 w-4" /> Reminder
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={printThermalBill}
          >
            <Printer className="mr-1.5 h-4 w-4" /> Thermal Print
          </Button>
        </div>
      </div>

      {/* Reminder Dialog */}
      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>WhatsApp Reminder</DialogTitle></DialogHeader>
          <div className="py-6 space-y-4">
            <div className="[background-color:var(--customers-reminder-msg-bg)] [border-color:var(--customers-reminder-msg-border)] border rounded-xl p-4 text-sm whitespace-pre-line">
              {reminderMessage}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button onClick={handleTextOnly} className="h-11 [background-color:var(--customers-reminder-send-bg)]">Text Only</Button>
              <Button onClick={handlePDFAndText} variant="outline" className="h-11 [border-color:var(--customers-reminder-bill-border)] [color:var(--customers-reminder-bill-text)]">Bill + Text</Button>
              <Button onClick={() => setIsReminderOpen(false)} variant="destructive" className="h-11">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment / Udhaar Form */}
      {mode && (
        <div className="rounded-xl border p-6 mb-6 [background-color:var(--customers-form-panel-bg)] shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <p className="font-semibold text-lg">
              {mode === "payment" ? "💰 Payment Entry" : "📦 Udhaar Entry"}
            </p>
            <button onClick={() => setMode(null)}><X className="h-5 w-5" /></button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => {
              addTx.mutate({ id: customerId, data: values }, {
                onSuccess: () => {
                  toast({ title: values.type === "payment" ? "Payment recorded" : "Udhaar added" });
                  queryClient.invalidateQueries({ queryKey: getGetCustomerQueryKey(customerId) });
                  setMode(null);
                }
              });
            })} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem className="md:col-span-4">
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} className="h-11" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem className="md:col-span-8">
                  <FormLabel>{mode === "payment" ? "Note" : "Item / Reason"}</FormLabel>
                  <FormControl><Input {...field} className="h-11" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="md:col-span-12 h-11">Save Entry</Button>
            </form>
          </Form>
        </div>
      )}

      {/* Scrollable History Table */}
      <div className="flex-1 border rounded-xl [background-color:var(--customers-ledger-bg)] flex flex-col overflow-hidden">
        <div className="grid grid-cols-[120px_1fr_130px_130px] bg-muted sticky top-0 text-xs font-semibold text-muted-foreground border-b">
          <div className="px-6 py-3.5">Date</div>
          <div className="px-6 py-3.5">Description</div>
          <div className="px-6 py-3.5 text-right">Amount</div>
          <div className="px-6 py-3.5 text-right">Balance</div>
        </div>

        <div className="flex-1 overflow-auto">
          {ledgerRows.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No transactions yet</p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {ledgerRows.map((tx: any) => (
                <div key={tx.id} className="grid grid-cols-[120px_1fr_130px_130px] hover:bg-muted/30 items-center px-6 py-4">
                  <div className="text-sm text-muted-foreground">{format(new Date(tx.createdAt), "dd MMM yyyy")}</div>
                  <div className="flex items-start gap-3 pr-4">
                    <div className={cn("mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                      tx.type === "credit" ? "[background-color:var(--customers-tx-credit-icon-bg)] [color:var(--customers-tx-credit-icon-text)]" : "[background-color:var(--customers-tx-payment-icon-bg)] [color:var(--customers-tx-payment-icon-text)]")}>
                      {tx.type === "credit" ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                    </div>
                    <p className="text-sm leading-tight">{tx.description}</p>
                  </div>
                  <div className="text-right font-semibold">
                    <span className={tx.type === "credit" ? "[color:var(--customers-tx-credit-amount)]" : "[color:var(--customers-tx-payment-amount)]"}>  
                      {tx.type === "credit" ? "+" : "-"} ₹{tx.amount.toFixed(0)}
                    </span>
                  </div>
                  <div className="text-right font-bold text-base">₹{tx.balance.toFixed(0)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
export default function Customers() {
  const [search, setSearch] = useState("");
  const { data: customers = [], isLoading } = useListCustomers({ search: search || undefined });
  const createCustomer = useCreateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [ledgerId, setLedgerId] = useState<number | null>(null);

  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  const onAdd = (values: any) => {
    createCustomer.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Customer add hua" });
        queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
        setIsAddOpen(false);
        form.reset();
      }
    });
  };

  const onDelete = (id: number, name: string) => {
    if (!confirm(`"${name}" delete karna chahte hain?`)) return;
    deleteCustomer.mutate({ id });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Khata (खाता)</h1>
          <p className="text-muted-foreground">{customers.length} Customers</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Naam ya phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-72" />
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Naya Customer Add Karein</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAdd)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Naam</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Address (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full">Add Customer</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={ledgerId !== null} onOpenChange={(open) => !open && setLedgerId(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Khata Ledger</DialogTitle>
          </DialogHeader>
          {ledgerId && <KhataLedger customerId={ledgerId} />}
        </DialogContent>
      </Dialog>

      <div className="rounded-2xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : (
          <div className="divide-y">
            {customers.map((customer: any) => (
              <div
                key={customer.id}
                className="px-6 py-5 flex items-center justify-between hover:bg-muted/60 cursor-pointer"
                onClick={() => setLedgerId(customer.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">📞 {customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    {customer.totalDue > 0 ? (
                      <p className="text-2xl font-bold [color:var(--customers-list-due-text)]">₹{customer.totalDue}</p>
                    ) : (
                      <p className="[color:var(--customers-list-clear-text)]">Clear</p>
                    )}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(customer.id, customer.name); }}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:[color:var(--customers-list-delete-hover)]" />
                  </button>
                  <ChevronRight className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}