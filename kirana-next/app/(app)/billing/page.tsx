"use client";

import "./billing.css";
import React, { useEffect, useMemo, useState } from "react";
import {
  getGetDashboardSummaryQueryKey,
  getListBillsQueryKey,
  getListCustomersQueryKey,
  getListProductsQueryKey,
  type BillInputPaymentMode,
  type Customer,
  type Product,
  useCreateBill,
  useCreateCustomer,
  useGetSettings,
  useListCustomers,
  useListProducts,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  MessageCircle,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { format } from "date-fns";

type CartItem = {
  lineId: string;
  productId: number;
  productName: string;
  variantName: string;
  displayName: string;
  displayQuantity: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  stockDeltaBaseUnit: number;
  selectedBaseQuantity?: number;
};

type BillData = {
  items: CartItem[];
  customerName?: string;
  customerPhone?: string;
  subtotal: number;
  discount: number;
  taxableValue: number;
  gstAmount: number;
  finalAmount: number;
  paymentMode: string;
  enableGST: boolean;
  gstRate: number;
};

export function buildWhatsAppMessage(
  billData: BillData,
  shopName: string,
  shopAddress?: string,
  shopPhone?: string
) {
  const lines = billData.items
    .map((item) => `• ${item.displayName} (${item.quantity > 1 ? `${item.quantity} x ${item.displayQuantity}` : item.displayQuantity}) — Rs ${item.totalPrice.toFixed(0)}`)
    .join("\n");

  let msg = `🛒 *${shopName}*\n`;
  if (shopAddress) msg += `📍 ${shopAddress}\n`;
  if (shopPhone) msg += `📞 ${shopPhone}\n`;
  msg += `\n*Bill Date:* ${format(new Date(), "dd MMM yyyy, hh:mm a")}\n`;
  if (billData.customerName) msg += `*Customer:* ${billData.customerName}\n`;
  msg += `\n*Items:*\n${lines}\n`;
  msg += `\n*Subtotal:* Rs ${billData.subtotal.toFixed(0)}`;
  if (billData.discount > 0) msg += `\n*Discount:* -Rs ${billData.discount.toFixed(0)}`;
  if (billData.enableGST) msg += `\n*GST (${billData.gstRate}%):* Rs ${billData.gstAmount.toFixed(0)}`;
  msg += `\n\n💰 *Total: Rs ${billData.finalAmount.toFixed(0)}*`;
  msg += `\n💳 *Payment:* ${billData.paymentMode.toUpperCase()}`;
  msg += `\n\nThank you for shopping with us! 🙏`;

  return msg;
}

function WhatsAppDialog({
  billData,
  shopName,
  shopAddress,
  shopPhone,
  onClose,
}: {
  billData: BillData | null;
  shopName: string;
  shopAddress?: string;
  shopPhone?: string;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  // Reset phone each time a new bill opens and prefill if customer has phone
  useEffect(() => {
    if (billData) {
      const rawPhone = (billData.customerPhone ?? "").replace(/\D/g, "").replace(/^91/, "").slice(0, 10);
      setPhone(rawPhone);
    }
  }, [billData]);

  const handleSend = () => {
    if (phone.length < 10) {
      toast({ title: "Valid 10-digit number daalo", variant: "destructive" });
      return;
    }
    if (!billData) return;
    const msg = buildWhatsAppMessage(billData, shopName, shopAddress, shopPhone);
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setPhone("");
    onClose();
  };

  const handleClose = () => {
    setPhone("");
    onClose();
  };

  return (
    <Dialog open={Boolean(billData)} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-sm pointer-events-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            Bill WhatsApp pe bhejein?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 p-4">
            <p className="text-sm text-muted-foreground">
              Customer ko bill ka summary WhatsApp pe directly bhej sakte hain.
              Ek click mein WhatsApp open hoga message ke saath.
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="h-4 w-4 text-muted-foreground" />
              WhatsApp Number
            </label>
            <div className="flex">
              <div className="flex h-10 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground select-none">
                +91
              </div>
              <Input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="rounded-l-none flex-1"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Skip
            </Button>
            <Button
              className="flex-1 gap-2 bg-[#25D366] text-white hover:bg-[#1ebe5d] active:scale-[0.98]"
              onClick={handleSend}
              disabled={phone.length < 10}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp pe Bhejo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type BillingFilter = "all" | "khula" | "fixed" | "variant" | "wholesale" | "in" | "low";

const MODE_LABEL: Record<string, string> = {
  khula: "Khula",
  fixed: "Fixed",
  variant: "Variant",
  wholesale: "Wholesale",
};

function formatBaseUnits(quantity: number, baseUnit: Product["baseUnit"]) {
  if (baseUnit === "gram") {
    return quantity >= 1000 ? `${Number((quantity / 1000).toFixed(3))} kg` : `${quantity} g`;
  }
  if (baseUnit === "ml") {
    return quantity >= 1000 ? `${Number((quantity / 1000).toFixed(3))} litre` : `${quantity} ml`;
  }
  return `${quantity} pcs`;
}

function rateUnit(product: Product) {
  if (product.sellingMode === "khula") {
    if (product.baseUnit === "gram") return "kg";
    if (product.baseUnit === "ml") return "litre";
    return "piece";
  }
  return product.unitType.toLowerCase();
}

function priceForBaseQuantity(product: Product, baseQuantity: number) {
  return Number(((product.sellingPrice / Math.max(1, product.baseQuantity)) * baseQuantity).toFixed(2));
}

function uniqueNumbers(values: Array<number | undefined>) {
  return Array.from(new Set(values.filter((value): value is number => Number.isFinite(value) && Number(value) > 0)));
}

function defaultPresetsFor(product: Product) {
  if (product.baseUnit === "gram") return [100, 250, 500, 1000, 2000, 5000, 10000];
  if (product.baseUnit === "ml") return [100, 250, 500, 1000, 5000, 15000];
  return [1, 2, 5, 10];
}

function lineLabel(item: CartItem) {
  return item.quantity > 1 ? `${item.quantity} x ${item.displayQuantity}` : item.displayQuantity;
}

function CustomerPicker({
  customers,
  value,
  onChange,
  required,
}: {
  customers: Customer[];
  value: string;
  onChange: (id: string) => void;
  required?: boolean;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const createCustomer = useCreateCustomer();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addCustomer = () => {
    if (!name.trim() || !phone.trim()) {
      toast({ title: "Customer naam aur phone zaroori hai", variant: "destructive" });
      return;
    }
    createCustomer.mutate(
      { data: { name: name.trim(), phone: phone.trim() } },
      {
        onSuccess: (customer) => {
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          onChange(customer.id.toString());
          setName("");
          setPhone("");
          setAddOpen(false);
        },
      }
    );
  };

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={cn("flex-1", required && !value && "border-[var(--billing-picker-required-border)] bg-[var(--billing-picker-required-bg)]")}>
            <SelectValue placeholder={required ? "Customer select karein" : "Customer optional"} />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                {customer.name} {customer.totalDue > 0 ? `(Due Rs ${customer.totalDue.toFixed(0)})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="icon" onClick={() => setAddOpen((open) => !open)}>
          {addOpen ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        </Button>
      </div>

      {addOpen && (
        <div className="grid gap-2 rounded-lg border bg-card p-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
          <Button type="button" size="sm" onClick={addCustomer} disabled={createCustomer.isPending}>
            {createCustomer.isPending ? "Saving..." : "Customer Save"}
          </Button>
        </div>
      )}
    </div>
  );
}

function KhulaPicker({
  product,
  open,
  onOpenChange,
  onAdd,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product, baseQuantity: number) => void;
}) {
  const [custom, setCustom] = useState("");

  if (!product) return null;

  const presets = uniqueNumbers([
    ...(product.popularBaseQuantities ?? []),
    ...(product.presetBaseQuantities ?? []),
    ...defaultPresetsFor(product),
    product.baseQuantity,
  ]).slice(0, 8);

  const add = (baseQuantity: number) => {
    onAdd(product, baseQuantity);
    setCustom("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.productName} - Khula</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-[var(--billing-khula-rate-bg)] p-3">
            <p className="text-sm text-muted-foreground">Rate</p>
            <p className="text-2xl font-extrabold text-[var(--billing-product-price)]">
              Rs {product.sellingPrice} / {rateUnit(product)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {presets.map((baseQuantity) => (
              <Button key={baseQuantity} type="button" variant="outline" className="h-14 flex-col gap-0" onClick={() => add(baseQuantity)}>
                <span className="font-bold">{formatBaseUnits(baseQuantity, product.baseUnit)}</span>
                <span className="text-xs text-muted-foreground">Rs {priceForBaseQuantity(product, baseQuantity)}</span>
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder={product.baseUnit === "gram" ? "Custom gram" : product.baseUnit === "ml" ? "Custom ml" : "Custom pcs"}
            />
            <Button
              type="button"
              disabled={!Number(custom)}
              onClick={() => add(Number(custom))}
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Billing() {
  const { data: products = [], isLoading } = useListProducts();
  const { data: customers = [] } = useListCustomers();
  const { data: settings } = useGetSettings();
  const createBill = useCreateBill();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<BillInputPaymentMode>("cash");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [billSuccess, setBillSuccess] = useState(false);
  const [mobileTab, setMobileTab] = useState<"products" | "cart">("products");
  const [enableGST, setEnableGST] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [khulaProduct, setKhulaProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<BillingFilter>("all");

  // WhatsApp: null = closed, BillData = open
  const [whatsappBillData, setWhatsappBillData] = useState<BillData | null>(null);

  const filteredProducts = useMemo(() => {
    const stockRank = (product: Product) => {
      if (product.stockInBaseUnit <= 0 || product.currentStock <= 0) return 2;
      if (product.currentStock <= product.lowStockThreshold) return 0;
      return 1;
    };

    const filtered = products.filter((product) => {
      if (filter === "khula") return product.sellingMode === "khula";
      if (filter === "fixed") return product.sellingMode === "fixed";
      if (filter === "variant") return product.sellingMode === "variant";
      if (filter === "wholesale") return product.sellingMode === "wholesale";
      if (filter === "in") return product.stockInBaseUnit > 0 && product.currentStock > product.lowStockThreshold;
      if (filter === "low") return product.stockInBaseUnit > 0 && product.currentStock <= product.lowStockThreshold;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const stock = stockRank(a) - stockRank(b);
      if (stock !== 0) return stock;
      if (Boolean(b.quickSelect) !== Boolean(a.quickSelect)) return Number(b.quickSelect) - Number(a.quickSelect);
      return (b.usageCount ?? 0) - (a.usageCount ?? 0);
    });
    if (!search.trim()) return sorted;

    const s = search.toLowerCase();
    return sorted.filter((product) => {
      const fields = [
        product.name,
        product.productName,
        product.variantName,
        product.category,
        product.brand,
        product.barcode,
        product.shortcut,
        product.unitType,
        ...(product.searchKeywords ?? []),
      ];
      return fields.some((field) => String(field ?? "").toLowerCase().includes(s));
    });
  }, [filter, products, search]);

  const quickProducts = useMemo(
    () => products.filter((product) => product.quickSelect && product.stockInBaseUnit > 0).slice(0, 8),
    [products]
  );

  const cartBaseQty = (productId: number) =>
    cart.filter((item) => item.productId === productId).reduce((sum, item) => sum + item.stockDeltaBaseUnit, 0);

  const canAdd = (product: Product, stockDelta: number) => {
    if (cartBaseQty(product.id) + stockDelta > product.stockInBaseUnit) {
      toast({ title: "Itna stock available nahi hai", description: product.name, variant: "destructive" });
      return false;
    }
    return true;
  };

  const addFixed = (product: Product, qty = 1) => {
    const stockDelta = product.baseQuantity * qty;
    if (!canAdd(product, stockDelta)) return;

    setCart((prev) => {
      const lineId = `${product.id}:fixed`;
      const existing = prev.find((item) => item.lineId === lineId);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId
            ? {
                ...item,
                quantity: item.quantity + qty,
                stockDeltaBaseUnit: item.stockDeltaBaseUnit + stockDelta,
                totalPrice: item.unitPrice * (item.quantity + qty),
              }
            : item
        );
      }

      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          productName: product.productName,
          variantName: product.variantName,
          displayName: product.name,
          displayQuantity: `1 ${product.unitType.toLowerCase()}`,
          quantity: qty,
          unit: product.unitType.toLowerCase(),
          unitPrice: product.sellingPrice,
          totalPrice: product.sellingPrice * qty,
          stockDeltaBaseUnit: stockDelta,
        },
      ];
    });
    setSearch("");
  };

  const addKhula = (product: Product, baseQuantity: number) => {
    if (!canAdd(product, baseQuantity)) return;

    const price = priceForBaseQuantity(product, baseQuantity);
    setCart((prev) => {
      const lineId = `${product.id}:khula:${baseQuantity}`;
      const existing = prev.find((item) => item.lineId === lineId);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId
            ? {
                ...item,
                quantity: item.quantity + 1,
                stockDeltaBaseUnit: item.stockDeltaBaseUnit + baseQuantity,
                totalPrice: item.unitPrice * (item.quantity + 1),
              }
            : item
        );
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          productName: product.productName,
          variantName: product.variantName,
          displayName: product.name,
          displayQuantity: formatBaseUnits(baseQuantity, product.baseUnit),
          quantity: 1,
          unit: product.baseUnit,
          unitPrice: price,
          totalPrice: price,
          stockDeltaBaseUnit: baseQuantity,
          selectedBaseQuantity: baseQuantity,
        },
      ];
    });
    setSearch("");
    setKhulaProduct(null);
  };

  const handleProductTap = (product: Product) => {
    if (product.stockInBaseUnit <= 0) {
      toast({ title: "Stock khatam ho gaya", description: product.name, variant: "destructive" });
      return;
    }
    if (product.sellingMode === "khula") {
      setKhulaProduct(product);
      return;
    }
    addFixed(product);
  };

  const updateQty = (lineId: string, delta: number) => {
    setCart((prev) => {
      const current = prev.find((item) => item.lineId === lineId);
      if (!current) return prev;
      const nextQty = current.quantity + delta;
      if (nextQty <= 0) return prev.filter((item) => item.lineId !== lineId);

      const product = products.find((p) => p.id === current.productId);
      const unitDelta = current.stockDeltaBaseUnit / current.quantity;
      if (delta > 0 && product && !canAdd(product, unitDelta)) return prev;

      return prev.map((item) =>
        item.lineId === lineId
          ? {
              ...item,
              quantity: nextQty,
              stockDeltaBaseUnit: unitDelta * nextQty,
              totalPrice: item.unitPrice * nextQty,
            }
          : item
      );
    });
  };

  const removeFromCart = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxableValue = Math.max(0, subtotal - discount);
  const gstAmount = enableGST ? (taxableValue * gstRate) / 100 : 0;
  const finalAmount = taxableValue + gstAmount;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const shopName = settings?.shopName?.trim() || "Smart Kirana Store";

  const printThermalBill = (billData: BillData) => {
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;

    const rows = billData.items.map((item) => `
      <tr>
        <td style="padding:3px 0;">${item.displayName}<br/><small>${lineLabel(item)}</small></td>
        <td style="padding:3px 0; text-align:right;">Rs ${item.unitPrice.toFixed(2)}</td>
        <td style="padding:3px 0; text-align:right;">Rs ${item.totalPrice.toFixed(0)}</td>
      </tr>
    `).join("");

    win.document.write(`
      <html><head><title>Bill</title>
      <style>
        body { font-family: monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 10px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 4px 0; vertical-align: top; }
        hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
        small { color: #333; }
      </style>
      </head><body>
        <div class="center bold">
          <h2>${shopName}</h2>
          <p>Retail Invoice</p>
          ${settings?.shopAddress ? `<p>${settings.shopAddress}</p>` : ""}
          ${settings?.shopPhone ? `<p>Phone: ${settings.shopPhone}</p>` : ""}
          ${settings?.gstEnabled && settings.gstNumber ? `<p>GSTIN: ${settings.gstNumber}</p>` : ""}
        </div>
        <hr/>
        <p><strong>Date:</strong> ${format(new Date(), "dd MMM yyyy, hh:mm a")}</p>
        ${billData.customerName ? `<p><strong>Customer:</strong> ${billData.customerName}</p>` : ""}
        <hr/>
        <table>
          <thead><tr><th>Item</th><th style="text-align:right">Rate</th><th style="text-align:right">Amt</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <hr/>
        <div style="display:flex;justify-content:space-between;"><span>Subtotal:</span><span>Rs ${billData.subtotal.toFixed(0)}</span></div>
        ${billData.discount > 0 ? `<div style="display:flex;justify-content:space-between;"><span>Discount:</span><span>-Rs ${billData.discount.toFixed(0)}</span></div>` : ""}
        ${billData.enableGST ? `<div style="display:flex;justify-content:space-between;"><span>GST (${billData.gstRate}%):</span><span>Rs ${billData.gstAmount.toFixed(0)}</span></div>` : ""}
        <hr/>
        <div class="bold" style="display:flex;justify-content:space-between;font-size:15px;"><span>Total:</span><span>Rs ${billData.finalAmount.toFixed(0)}</span></div>
        <hr/>
        <div style="display:flex;justify-content:space-between;"><span>Payment:</span><span>${billData.paymentMode}</span></div>
        <div class="center" style="margin-top:15px;font-size:12px;">Thank You! Visit Again</div>
        <script>
          setTimeout(() => { window.print(); }, 100);
        </script>
      </body></html>
    `);
    win.document.close();
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMode === "khata" && !selectedCustomerId) {
      toast({ title: "Khata ke liye customer select karein", variant: "destructive" });
      return;
    }

    const selectedCustomer = customers.find((customer) => customer.id.toString() === selectedCustomerId);
    const finalPhone = selectedCustomer?.phone || quickPhone;

    createBill.mutate(
      {
        data: {
          customerId: selectedCustomerId ? Number(selectedCustomerId) : undefined,
          items: cart.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            variantName: item.variantName,
            quantity: item.quantity,
            unit: item.unit,
            displayQuantity: lineLabel(item),
            stockDeltaBaseUnit: item.stockDeltaBaseUnit,
            selectedBaseQuantity: item.selectedBaseQuantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          totalAmount: subtotal,
          discountAmount: discount,
          taxableValue,
          gstAmount,
          finalAmount,
          paymentMode,
          enableGST,
          gstRate: enableGST ? gstRate : 0,
        },
      },
      {
        onSuccess: () => {
          const billData = {
            items: [...cart],
            customerName: selectedCustomer?.name,
            customerPhone: finalPhone,
            subtotal,
            discount,
            taxableValue,
            gstAmount,
            finalAmount,
            paymentMode,
            enableGST,
            gstRate,
          };

          printThermalBill(billData);

          setBillSuccess(true);
          queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["reports"] });

          const rawPhone = (billData.customerPhone ?? "").replace(/\D/g, "").replace(/^91/, "").slice(0, 10);
          
          if (rawPhone.length === 10) {
            // Send directly apne aap
            const msg = buildWhatsAppMessage(billData, shopName, settings?.shopAddress, settings?.shopPhone);
            const url = `https://wa.me/91${rawPhone}?text=${encodeURIComponent(msg)}`;
            window.open(url, "_blank");
          } else {
            // Show WhatsApp dialog if no valid phone
            setWhatsappBillData(billData);
          }

          setTimeout(() => {
            setCart([]);
            setDiscount(0);
            setSelectedCustomerId("");
            setQuickPhone("");
            setPaymentMode("cash");
            setEnableGST(false);
            setBillSuccess(false);
            setMobileTab("products");
          }, 900);

          toast({ title: "Bill ban gaya" });
        },
        onError: () => toast({ title: "Bill nahi bana", variant: "destructive" }),
      }
    );
  };

  const resetCart = () => {
    setCart([]);
    setDiscount(0);
    setSelectedCustomerId("");
    setQuickPhone("");
    setEnableGST(false);
  };

  const ProductGrid = (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search: chi, att, barcode, shortcut..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredProducts[0]) handleProductTap(filteredProducts[0]);
          }}
          className="h-11 pl-9"
          autoFocus
        />
      </div>

      {!search && quickProducts.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductTap(product)}
              className="shrink-0 rounded-lg border bg-card px-3 py-2 text-left text-sm font-semibold shadow-sm hover:border-primary"
            >
              <span>{product.productName}</span>
              <span className="ml-1 text-muted-foreground">{product.variantName}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {([
          ["all", "All"],
          ["khula", "Khula"],
          ["fixed", "Fixed"],
          ["variant", "Variant"],
          ["wholesale", "Bora"],
          ["low", "Low"],
          ["in", "In Stock"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "shrink-0 rounded-md border px-3 py-1.5 text-xs font-bold transition-colors",
              filter === value ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted/60"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}><CardContent className="p-3"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Koi product nahi mila</div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 pb-2 sm:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const inCartBase = cartBaseQty(product.id);
              const outOfStock = product.stockInBaseUnit <= 0 || inCartBase >= product.stockInBaseUnit;
              const lowStock = product.currentStock <= product.lowStockThreshold;
              return (
                <Card
                  key={product.id}
                  data-testid={`card-product-${product.id}`}
                  onClick={() => !outOfStock && handleProductTap(product)}
                  className={cn(
                    "cursor-pointer select-none transition-all active:scale-[0.98]",
                    outOfStock ? "cursor-not-allowed opacity-50" : "hover:border-primary hover:shadow-sm"
                  )}
                >
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-bold">{product.productName}</p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">{product.variantName}</p>
                      </div>
                      {product.quickSelect && <Badge className="bg-[var(--billing-quick-bg)] text-[var(--billing-quick-text)]">Top</Badge>}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg font-extrabold text-[var(--billing-product-price)]">Rs {product.sellingPrice}</span>
                      <Badge variant="outline" className="text-[10px]">{MODE_LABEL[product.sellingMode]}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">/{rateUnit(product)}</span>
                      <span className={cn(outOfStock ? "text-[var(--billing-stock-out)]" : lowStock ? "text-[var(--billing-stock-low)]" : "text-[var(--billing-stock-ok)]")}>
                        {outOfStock ? "Khatam" : `${product.currentStock} ${product.unit}`}
                      </span>
                    </div>
                    {product.sellingMode === "khula" && (
                      <div className="rounded-md bg-[var(--billing-khula-chip-bg)] px-2 py-1 text-center text-[11px] font-semibold text-[var(--billing-khula-chip-text)]">
                        Preset quantity
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const CartPanel = (
    <Card className={cn("flex h-full flex-col transition-all", billSuccess && "border-[var(--billing-cart-success-border)]")}>
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="h-4 w-4 text-primary" />
          Current Bill
          {billSuccess && <CheckCircle2 className="ml-auto h-5 w-5 text-[var(--billing-cart-success-icon)]" />}
          {cartCount > 0 && !billSuccess && <Badge className="ml-auto bg-[var(--billing-cart-badge-bg)] text-[var(--billing-cart-badge-text)]">{cartCount}</Badge>}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <PackageCheck className="h-10 w-10 opacity-20" />
            <p className="text-sm">Product tap karein</p>
          </div>
        ) : (
          <div className="divide-y">
            {cart.map((item) => (
              <div key={item.lineId} className="flex items-center gap-2 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.displayName}</p>
                  <p className="text-xs text-muted-foreground">{lineLabel(item)} / Rs {item.unitPrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-muted" onClick={() => updateQty(item.lineId, -1)}>
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-muted" onClick={() => updateQty(item.lineId, 1)}>
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <p className="w-16 text-right text-sm font-bold">Rs {item.totalPrice.toFixed(0)}</p>
                <button className="text-muted-foreground hover:text-[var(--billing-cart-item-remove-hover)]" onClick={() => removeFromCart(item.lineId)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-3 border-t bg-[var(--billing-cart-footer-bg)] px-4 py-4">
        <div className="flex w-full justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex w-full items-center gap-2">
          <span className="whitespace-nowrap text-sm text-muted-foreground">Discount</span>
          <Input type="number" min="0" value={discount || ""} placeholder="0" onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))} className="h-8 text-right" />
        </div>
        <div className="flex w-full items-center justify-between border-t pt-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={enableGST} onCheckedChange={(checked) => setEnableGST(Boolean(checked))} />
            GST
          </label>
          {enableGST && (
            <Select value={gstRate.toString()} onValueChange={(value) => setGstRate(Number(value))}>
              <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
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
          <div className="flex w-full justify-between text-sm">
            <span className="text-muted-foreground">GST Amount</span>
            <span className="font-medium">Rs {gstAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex w-full justify-between border-t pt-3">
          <span className="font-bold">Total</span>
          <span className="text-xl font-extrabold text-[var(--billing-cart-total-text)]">Rs {finalAmount.toFixed(2)}</span>
        </div>

        <Select value={paymentMode} onValueChange={(value) => { setPaymentMode(value as BillInputPaymentMode); if (value !== "khata") setSelectedCustomerId(""); }}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="khata">Khata</SelectItem>
          </SelectContent>
        </Select>

        {(paymentMode === "khata" || cart.length > 0) && (
          <CustomerPicker customers={customers} value={selectedCustomerId} onChange={setSelectedCustomerId} required={paymentMode === "khata"} />
        )}

        {cart.length > 0 && !selectedCustomerId && (
          <div className="flex items-center rounded-md border px-3 bg-background focus-within:ring-1 focus-within:ring-ring">
             <span className="text-sm text-muted-foreground mr-2">+91</span>
             <Input 
               type="tel"
               placeholder="WhatsApp (Optional)"
               className="border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 shadow-none bg-transparent"
               value={quickPhone}
               onChange={(e) => setQuickPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
             />
          </div>
        )}

        <Button className="h-12 w-full text-base font-bold" disabled={cart.length === 0 || createBill.isPending || billSuccess} onClick={handleCheckout}>
          {billSuccess ? <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Bill Hua</span> : `Bill Karo - Rs ${finalAmount.toFixed(0)}`}
        </Button>

        {cart.length > 0 && (
          <button className="text-xs text-muted-foreground underline underline-offset-2 hover:text-destructive" onClick={resetCart}>
            Cart clear karein
          </button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <>
      <div className="hidden h-[calc(100dvh-2*1.5rem)] gap-5 md:flex">
        <div className="flex min-w-0 flex-1 flex-col">{ProductGrid}</div>
        <div className="w-96 shrink-0">{CartPanel}</div>
      </div>

      <div className="flex h-[calc(100dvh-3.5rem-4rem)] flex-col gap-3 md:hidden">
        <div className="flex shrink-0 gap-1 rounded-lg border bg-[var(--billing-tab-bar-bg)] p-1">
          <button
            onClick={() => setMobileTab("products")}
            className={cn("flex-1 rounded-md py-2 text-sm font-bold", mobileTab === "products" ? "bg-[var(--billing-tab-active-bg)] text-[var(--billing-tab-active-text)] shadow-sm" : "text-[var(--billing-tab-inactive-text)]")}
          >
            Products
          </button>
          <button
            onClick={() => setMobileTab("cart")}
            className={cn("flex-1 rounded-md py-2 text-sm font-bold", mobileTab === "cart" ? "bg-[var(--billing-tab-active-bg)] text-[var(--billing-tab-active-text)] shadow-sm" : "text-[var(--billing-tab-inactive-text)]")}
          >
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </button>
        </div>

        {mobileTab === "products" ? ProductGrid : <div className="min-h-0 flex-1">{CartPanel}</div>}

        {mobileTab === "products" && cartCount > 0 && (
          <button
            onClick={() => setMobileTab("cart")}
            className="flex shrink-0 items-center justify-between rounded-lg bg-[var(--billing-sticky-btn-bg)] px-4 py-3 text-[var(--billing-sticky-btn-text)] shadow-lg"
          >
            <span className="font-bold">{cartCount} items</span>
            <span className="font-extrabold">Rs {finalAmount.toFixed(0)}</span>
          </button>
        )}
      </div>

      <KhulaPicker product={khulaProduct} open={Boolean(khulaProduct)} onOpenChange={(open) => !open && setKhulaProduct(null)} onAdd={addKhula} />

      <WhatsAppDialog
        billData={whatsappBillData}
        shopName={shopName}
        shopAddress={settings?.shopAddress}
        shopPhone={settings?.shopPhone}
        onClose={() => setWhatsappBillData(null)}
      />
    </>
  );
}
