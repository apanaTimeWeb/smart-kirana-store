"use client";

import "./billing.css";
import { useState, useMemo, useRef } from "react";
import {
  useListProducts,
  useListCustomers,
  useCreateBill,
  useCreateCustomer,
  getListBillsQueryKey,
  getGetDashboardSummaryQueryKey,
  getListProductsQueryKey,
  getListCustomersQueryKey,
  type BillInputPaymentMode,
  type Customer,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search, ShoppingCart, Trash2, Plus, Minus, CheckCircle2,
  UserPlus, X, ChevronDown, User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type CartItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
};

function CustomerPicker({
  customers, value, onChange, required,
}: {
  customers: Customer[];
  value: string;
  onChange: (id: string) => void;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const createCustomer = useCreateCustomer();
  const { toast } = useToast();

  const selected = customers.find((c) => c.id.toString() === value);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const s = search.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(s) || c.phone.includes(s));
  }, [customers, search]);

  function openPicker() {
    setOpen(true);
    setSearch("");
    setShowAdd(false);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function selectCustomer(c: Customer) {
    onChange(c.id.toString());
    setOpen(false);
    setSearch("");
    setShowAdd(false);
  }

  function clearSelection(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
  }

  function handleAddCustomer() {
    if (!newName.trim() || !newPhone.trim()) {
      toast({ title: "Naam aur phone number zaroori hai", variant: "destructive" });
      return;
    }
    createCustomer.mutate(
      { data: { name: newName.trim(), phone: newPhone.trim(), address: newAddress.trim() || undefined } },
      {
        onSuccess: (customer) => {
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          onChange(customer.id.toString());
          setOpen(false);
          setShowAdd(false);
          setNewName(""); setNewPhone(""); setNewAddress("");
          toast({ title: `${customer.name} add ho gaye!` });
        },
        onError: () => toast({ title: "Customer add nahi hua", variant: "destructive" }),
      }
    );
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={openPicker}
        className={cn(
          "w-full flex items-center gap-2 rounded-md border px-3 h-10 text-sm transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring",
          required && !value ? "border-[var(--billing-picker-required-border)] bg-[var(--billing-picker-required-bg)]" : "bg-background",
          open && "ring-2 ring-ring"
        )}
        data-testid="button-customer-picker"
      >
        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className={cn("flex-1 text-left truncate", !selected && "text-muted-foreground")}>
          {selected
            ? `${selected.name}${selected.totalDue > 0 ? ` · Due: ₹${selected.totalDue.toFixed(0)}` : ""}`
            : required ? "Customer select karein (zaroori)" : "Customer (optional)"}
        </span>
        {selected ? (
          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive shrink-0" onClick={clearSelection} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-1 left-0 right-0 z-50 rounded-lg border bg-[var(--billing-cart-bg)] shadow-xl overflow-hidden">
            {!showAdd ? (
              <>
                <div className="flex items-center gap-2 border-b px-3 py-2">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Naam ya phone se dhundein..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                    data-testid="input-customer-search"
                  />
                  {search && (
                    <button onClick={() => setSearch("")}>
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <div className="max-h-44 overflow-auto">
                  {filtered.length === 0 ? (
                    <div className="py-4 text-center text-xs text-muted-foreground">
                      "{search}" naam ka koi customer nahi mila
                    </div>
                  ) : (
                    filtered.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => selectCustomer(c)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors",
                          value === c.id.toString() && "bg-[var(--billing-picker-selected-row-bg)]"
                        )}
                        data-testid={`option-customer-${c.id}`}
                      >
                        <div className="h-7 w-7 rounded-full bg-[var(--billing-picker-avatar-bg)] text-[var(--billing-picker-avatar-text)] flex items-center justify-center text-xs font-bold shrink-0">
                          {c.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{c.name}</p>
                          <p className="text-[11px] text-muted-foreground">{c.phone}</p>
                        </div>
                        {c.totalDue > 0 && (
                          <span className="text-[11px] font-semibold text-[var(--billing-picker-due-text)] shrink-0">
                            Due ₹{c.totalDue.toFixed(0)}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
                <div className="border-t p-2">
                  <button
                    type="button"
                    onClick={() => { setShowAdd(true); setNewName(search); }}
                    className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--billing-picker-add-text)] [&:hover]:bg-[var(--billing-picker-add-hover-bg)] transition-colors"
                    data-testid="button-add-new-customer"
                  >
                    <UserPlus className="h-4 w-4" />
                    + Naya Customer Add Karein
                    {search && <span className="text-muted-foreground font-normal truncate">"{search}"</span>}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-[var(--billing-picker-new-icon)]" /> Naya Customer
                  </p>
                  <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <Input placeholder="Naam *" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-9 text-sm" autoFocus data-testid="input-new-customer-name" />
                  <Input placeholder="Phone Number *" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="h-9 text-sm" type="tel" data-testid="input-new-customer-phone" />
                  <Input placeholder="Address (optional)" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="h-9 text-sm" data-testid="input-new-customer-address" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-9 text-xs" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button size="sm" className="flex-1 h-9 text-xs" onClick={handleAddCustomer} disabled={createCustomer.isPending} data-testid="button-save-new-customer">
                    {createCustomer.isPending ? "Saving..." : "Save Karein"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function Billing() {
  const { data: products = [], isLoading } = useListProducts();
  const { data: customers = [] } = useListCustomers();
  const createBill = useCreateBill();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<BillInputPaymentMode>("cash");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [billSuccess, setBillSuccess] = useState(false);
  const [mobileTab, setMobileTab] = useState<"products" | "cart">("products");
  const [enableGST, setEnableGST] = useState(false);
  const [gstRate, setGstRate] = useState(18); // 18% GST

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const s = search.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(s) || p.barcode?.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)
    );
  }, [search, products]);

  const addToCart = (product: (typeof products)[0]) => {
    if (product.currentStock <= 0) {
      toast({ title: "Stock khatam ho gaya", description: product.name, variant: "destructive" });
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, productName: product.name, unitPrice: product.sellingPrice, quantity: 1 }];
    });
    setSearch("");
  };

  const updateQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const taxableValue = Math.max(0, subtotal - discount);
  const gstAmount = enableGST ? (taxableValue * gstRate) / 100 : 0;
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;
  const finalAmount = taxableValue + gstAmount;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get shop name from localStorage
  const shopName = (() => {
    try {
      const s = typeof window !== "undefined" ? localStorage.getItem("kirana_settings") : null;
      if (s) return JSON.parse(s).shopName || "Smart Kirana Store";
    } catch { }
    return "Smart Kirana Store";
  })();

  // GST Bill Print Function
  const printThermalBill = (billData: {
    items: CartItem[];
    customerName?: string;
    subtotal: number;
    discount: number;
    taxableValue: number;
    gstAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    finalAmount: number;
    paymentMode: string;
    enableGST: boolean;
    gstRate: number;
  }) => {
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;

    const rows = billData.items.map((item) => `
      <tr>
        <td style="padding:3px 0;">${item.productName}</td>
        <td style="padding:3px 0; text-align:right;">${item.quantity} x ₹${item.unitPrice}</td>
        <td style="padding:3px 0; text-align:right;">₹${(item.quantity * item.unitPrice).toFixed(0)}</td>
      </tr>
    `).join("");

    win.document.write(`
      <html><head><title>Tax Invoice</title>
      <style>
        body { font-family: monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 10px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 4px 0; }
        hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
        .gst-details { font-size: 11px; margin-top: 5px; }
      </style>
      </head><body>
        <div class="center bold"><h2>${shopName}</h2><p>Tax Invoice</p></div>
        <hr/>
        <p><strong>Date:</strong> ${format(new Date(), "dd MMM yyyy, hh:mm a")}</p>
        ${billData.customerName ? `<p><strong>Customer:</strong> ${billData.customerName}</p>` : ''}
        <hr/>
        <table>
          <thead><tr><th>Item</th><th style="text-align:right">Qty x Rate</th><th style="text-align:right">Amt</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <hr/>
        <div style="display:flex;justify-content:space-between;">
          <span>Subtotal:</span><span>₹${billData.subtotal.toFixed(0)}</span>
        </div>
        ${billData.discount > 0 ? `
        <div style="display:flex;justify-content:space-between;">
          <span>Discount:</span><span>-₹${billData.discount.toFixed(0)}</span>
        </div>` : ''}
        <div style="display:flex;justify-content:space-between;">
          <span>Taxable Value:</span><span>₹${billData.taxableValue.toFixed(0)}</span>
        </div>
        ${billData.enableGST ? `
        <div style="display:flex;justify-content:space-between;" class="gst-details">
          <span>CGST (${billData.gstRate / 2}%):</span><span>₹${billData.cgstAmount.toFixed(0)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;" class="gst-details">
          <span>SGST (${billData.gstRate / 2}%):</span><span>₹${billData.sgstAmount.toFixed(0)}</span>
        </div>
        ` : ''}
        <hr/>
        <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;">
          <span>Total :</span><span>₹${billData.finalAmount.toFixed(0)}</span>
        </div>
        <hr/>
        <div style="display:flex;justify-content:space-between;">
          <span>Payment Mode:</span><span>${billData.paymentMode === 'cash' ? 'Cash' : billData.paymentMode === 'upi' ? 'UPI' : 'Khata'}</span>
        </div>
        ${billData.enableGST ? `
        <div class="gst-details center" style="margin-top:8px;">
          GSTIN: 27AAAAA1234A1Z<br/>
          HSN/SAC: As per invoice
        </div>
        ` : ''}
        <hr/>
        <div class="center" style="margin-top:15px;font-size:12px;">Thank You! Visit Again</div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => {
      win.print();
    }, 100);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMode === "khata" && !selectedCustomerId) {
      toast({ title: "Khata ke liye customer select karein", variant: "destructive" });
      return;
    }

    const taxableValueCalc = Math.max(0, subtotal - discount);
    const gstAmountCalc = enableGST ? (taxableValueCalc * gstRate) / 100 : 0;
    const finalAmountCalc = taxableValueCalc + gstAmountCalc;

    createBill.mutate(
      {
        data: {
          customerId: selectedCustomerId ? Number(selectedCustomerId) : undefined,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
          totalAmount: subtotal,
          discountAmount: discount,
          taxableValue: taxableValueCalc,
          gstAmount: gstAmountCalc,
          finalAmount: finalAmountCalc,
          paymentMode,
          enableGST,
          gstRate: enableGST ? gstRate : 0,
        },
      },
      {
        onSuccess: () => {
          const billData = {
            items: [...cart],
            customerName: customers.find(c => c.id.toString() === selectedCustomerId)?.name,
            subtotal,
            discount,
            taxableValue: taxableValueCalc,
            gstAmount: gstAmountCalc,
            cgstAmount: gstAmountCalc / 2,
            sgstAmount: gstAmountCalc / 2,
            finalAmount: finalAmountCalc,
            paymentMode,
            enableGST,
            gstRate,
          };

          printThermalBill(billData);

          setBillSuccess(true);

          queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });

          setTimeout(() => {
            setCart([]);
            setDiscount(0);
            setSelectedCustomerId("");
            setPaymentMode("cash");
            setEnableGST(false);
            setBillSuccess(false);
          }, 1500);

          toast({ title: "Bill ban gaya!" });
        },
        onError: () => toast({ title: "Bill nahi bana", variant: "destructive" }),
      }
    );
  };

  const resetCart = () => {
    setCart([]);
    setDiscount(0);
    setSelectedCustomerId("");
    setEnableGST(false);
  };

  const CartPanel = (
    <Card className={cn("flex flex-col h-full transition-all", billSuccess && "border-[var(--billing-cart-success-border)]")}>
      <CardHeader className="border-b pb-3 pt-4 px-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="h-4 w-4 text-primary" />
          Current Bill
          {billSuccess && <CheckCircle2 className="h-5 w-5 text-[var(--billing-cart-success-icon)] ml-auto" />}
          {cartCount > 0 && !billSuccess && (
            <Badge className="ml-auto bg-[var(--billing-cart-badge-bg)] text-[var(--billing-cart-badge-text)] px-2 py-0.5 text-xs">{cartCount}</Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-[120px] flex-col items-center justify-center text-muted-foreground gap-2 py-8">
            <ShoppingCart className="h-10 w-10 opacity-15" />
            <p className="text-sm">Products add karein</p>
          </div>
        ) : (
          <div className="divide-y">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-2 px-4 py-3" data-testid={`row-cart-${item.productId}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">₹{item.unitPrice} / pcs</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-muted transition-colors" onClick={() => updateQty(item.productId, -1)} data-testid={`button-minus-${item.productId}`}>
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                  <button className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-muted transition-colors" onClick={() => updateQty(item.productId, 1)} data-testid={`button-plus-${item.productId}`}>
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="text-right w-14">
                  <p className="font-bold text-sm">₹{(item.unitPrice * item.quantity).toFixed(0)}</p>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="text-muted-foreground [&:hover]:text-[var(--billing-cart-item-remove-hover)] transition-colors" data-testid={`button-remove-${item.productId}`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col border-t bg-[var(--billing-cart-footer-bg)] px-4 py-4 gap-3">
        <div className="flex justify-between w-full text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Discount (₹)</span>
          <Input
            type="number" min="0" value={discount || ""} placeholder="0"
            onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="h-8 text-right flex-1" data-testid="input-discount"
          />
        </div>

        {/* GST Toggle */}
        <div className="flex items-center justify-between w-full border-t pt-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="enableGST"
              checked={enableGST}
              onCheckedChange={(checked) => setEnableGST(checked as boolean)}
              className="h-4 w-4"
            />
            <label htmlFor="enableGST" className="text-sm font-medium cursor-pointer">
              Enable GST ({gstRate}%)
            </label>
          </div>
          {enableGST && (
            <Select value={gstRate.toString()} onValueChange={(val) => setGstRate(Number(val))}>
              <SelectTrigger className="w-24 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {enableGST && (
          <>
            <div className="flex justify-between w-full text-sm">
              <span className="text-muted-foreground">Taxable Value</span>
              <span className="font-medium">₹{Math.max(0, subtotal - discount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full text-xs text-muted-foreground">
              <span>CGST ({gstRate / 2}%)</span>
              <span>₹{((Math.max(0, subtotal - discount) * gstRate / 100) / 2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full text-xs text-muted-foreground">
              <span>SGST ({gstRate / 2}%)</span>
              <span>₹{((Math.max(0, subtotal - discount) * gstRate / 100) / 2).toFixed(2)}</span>
            </div>
          </>
        )}

        <div className="flex justify-between w-full border-t pt-3">
          <span className="font-bold">Total</span>
          <span className="text-xl font-extrabold text-[var(--billing-cart-total-text)]">₹{finalAmount.toFixed(2)}</span>
        </div>

        <Select value={paymentMode} onValueChange={(val) => { setPaymentMode(val as BillInputPaymentMode); if (val !== "khata") setSelectedCustomerId(""); }}>
          <SelectTrigger className="w-full" data-testid="select-payment-mode">
            <SelectValue placeholder="Payment tarika" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash Payment</SelectItem>
            <SelectItem value="upi">UPI Payment</SelectItem>
            <SelectItem value="khata">Khata (Udhaar)</SelectItem>
          </SelectContent>
        </Select>

        {(paymentMode === "khata" || cart.length > 0) && (
          <CustomerPicker customers={customers} value={selectedCustomerId} onChange={setSelectedCustomerId} required={paymentMode === "khata"} />
        )}

        <Button
          className="w-full h-12 text-base font-bold"
          disabled={cart.length === 0 || createBill.isPending || billSuccess}
          onClick={handleCheckout}
          data-testid="button-checkout"
        >
          {billSuccess ? (
            <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Bill Hua!</span>
          ) : (
            `Bill Karo — ₹${finalAmount.toFixed(0)}`
          )}
        </Button>

        {cart.length > 0 && (
          <button
            className="text-xs text-muted-foreground hover:text-destructive underline underline-offset-2 transition-colors"
            onClick={resetCart}
          >
            Cart clear karein
          </button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-[calc(100dvh-2*1.5rem)] gap-5">
        <div className="flex flex-1 flex-col gap-3 min-h-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Product search karein... (naam, barcode)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11"
                autoFocus
                data-testid="input-product-search"
              />
            </div>
            {cartCount > 0 && (
              <Badge className="bg-[var(--billing-cart-badge-bg)] text-[var(--billing-cart-badge-text)] px-2.5 py-1 text-sm font-bold">{cartCount}</Badge>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i}><CardContent className="p-3"><Skeleton className="h-16 w-full" /></CardContent></Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">Koi product nahi mila</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-2">
                {filteredProducts.map((product) => {
                  const inCart = cart.find((i) => i.productId === product.id);
                  const outOfStock = product.currentStock <= 0;
                  return (
                    <Card
                      key={product.id}
                      data-testid={`card-product-${product.id}`}
                      onClick={() => {
                        if (outOfStock) return;
                        if (inCart) removeFromCart(product.id);
                        else addToCart(product);
                      }}
                      className={cn(
                        "cursor-pointer transition-all duration-150 select-none",
                        outOfStock ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:shadow-sm active:scale-[0.97]",
                        inCart && "border-[var(--billing-product-in-cart-border)] bg-[var(--billing-product-in-cart-bg)]"
                      )}
                    >
                      <CardContent className="p-3 space-y-1.5">
                        <p className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-extrabold text-[var(--billing-product-price)]">₹{product.sellingPrice}</span>
                          <span className={cn(
                            "text-[10px] font-medium",
                            outOfStock ? "text-[var(--billing-stock-out)]" : product.currentStock <= product.lowStockThreshold ? "text-[var(--billing-stock-low)]" : "text-[var(--billing-stock-ok)]"
                          )}>
                            {outOfStock ? "Khatam" : `${product.currentStock} left`}
                          </span>
                        </div>
                        {inCart && <div className="text-[10px] font-semibold text-[var(--billing-product-in-cart-label)]">Cart: {inCart.quantity} pcs</div>}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="w-80 lg:w-96 shrink-0 flex flex-col">
          {CartPanel}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col h-[calc(100dvh-3.5rem-4rem)] gap-0">
        <div className="flex rounded-xl border bg-[var(--billing-tab-bar-bg)] p-1 gap-1 shrink-0 mb-3">
          <button
            onClick={() => setMobileTab("products")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all",
              mobileTab === "products"
                ? "bg-[var(--billing-tab-active-bg)] shadow-sm text-[var(--billing-tab-active-text)]"
                : "text-[var(--billing-tab-inactive-text)]"
            )}
          >
            <Search className="h-4 w-4" />
            Products
          </button>
          <button
            onClick={() => setMobileTab("cart")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all",
              mobileTab === "cart"
                ? "bg-[var(--billing-tab-active-bg)] shadow-sm text-[var(--billing-tab-active-text)]"
                : "text-[var(--billing-tab-inactive-text)]"
            )}
            data-testid="button-view-cart"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--billing-tab-badge-bg)] text-[10px] font-bold text-[var(--billing-tab-badge-text)]">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {mobileTab === "products" ? (
          <div className="flex flex-1 flex-col gap-3 min-h-0">
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Product dhundein..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11"
                data-testid="input-product-search"
              />
            </div>

            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}><CardContent className="p-3"><Skeleton className="h-16 w-full" /></CardContent></Card>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">Koi product nahi mila</div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 pb-2">
                  {filteredProducts.map((product) => {
                    const inCart = cart.find((i) => i.productId === product.id);
                    const outOfStock = product.currentStock <= 0;
                    return (
                      <Card
                        key={product.id}
                        data-testid={`card-product-${product.id}`}
                        onClick={() => {
                          if (outOfStock) return;
                          if (inCart) removeFromCart(product.id);
                          else addToCart(product);
                        }}
                        className={cn(
                          "cursor-pointer transition-all duration-150 select-none active:scale-[0.96]",
                          outOfStock ? "opacity-50 cursor-not-allowed" : "hover:border-primary",
                          inCart && "border-[var(--billing-product-in-cart-border)] bg-[var(--billing-product-in-cart-bg)]"
                        )}
                      >
                        <CardContent className="p-3 space-y-1">
                          <p className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground">{product.category}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-base font-extrabold text-[var(--billing-product-price)]">₹{product.sellingPrice}</span>
                            <span className={cn(
                              "text-[10px] font-medium",
                              outOfStock ? "text-[var(--billing-stock-out)]" : product.currentStock <= product.lowStockThreshold ? "text-[var(--billing-stock-low)]" : "text-[var(--billing-stock-ok)]"
                            )}>
                              {outOfStock ? "Khatam" : `${product.currentStock}`}
                            </span>
                          </div>
                          {inCart && (
                            <div className="text-[10px] font-bold text-[var(--billing-product-in-cart-label)] bg-[var(--billing-product-in-cart-label-bg)] rounded px-1.5 py-0.5 text-center">
                              ✓ {inCart.quantity} in cart
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {cartCount > 0 && (
              <button
                onClick={() => setMobileTab("cart")}
                className="shrink-0 flex items-center justify-between w-full rounded-xl bg-[var(--billing-sticky-btn-bg)] px-4 py-3 text-[var(--billing-sticky-btn-text)] shadow-lg active:scale-[0.98] transition-transform"
                data-testid="button-view-cart-sticky"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-bold text-sm">{cartCount} items in cart</span>
                </div>
                <span className="font-extrabold text-base">₹{finalAmount.toFixed(0)} →</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
            {CartPanel}
          </div>
        )}
      </div>
    </>
  );
}