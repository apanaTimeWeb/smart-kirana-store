"use client";

import { useMemo, useState, useEffect } from "react";
import {
  getGetDashboardSummaryQueryKey,
  getListBillsQueryKey,
  getListProductsQueryKey,
  type BillInputPaymentMode,
  type Product,
  useCreateBill,
  useGetSettings,
  useListCustomers,
  useListProducts,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type BillData, type BillingFilter, type CartItem } from "./types";
import { defaultPresetsFor, formatBaseUnits, lineLabel, priceForBaseQuantity, uniqueNumbers } from "./utils";
import { buildWhatsAppMessage, printThermalBill } from "./whatsapp-utils";

export function useBilling() {
  const { data: products = [], isLoading } = useListProducts();
  const { data: customers = [] } = useListCustomers();
  const { data: settings } = useGetSettings();
  const createBill = useCreateBill();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ── UI State ──────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<BillInputPaymentMode | "">("cash");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [billSuccess, setBillSuccess] = useState(false);
  const [mobileTab, setMobileTab] = useState<"products" | "cart">("products");
  const [enableGST, setEnableGST] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [khulaProduct, setKhulaProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<BillingFilter>("all");
  const [whatsappBillData, setWhatsappBillData] = useState<BillData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Persist State ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("billing_draft_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.discount !== undefined) setDiscount(parsed.discount);
        if (parsed.paymentMode !== undefined) setPaymentMode(parsed.paymentMode);
        if (parsed.selectedCustomerId !== undefined) setSelectedCustomerId(parsed.selectedCustomerId);
        if (parsed.quickPhone !== undefined) setQuickPhone(parsed.quickPhone);
        if (parsed.enableGST !== undefined) setEnableGST(parsed.enableGST);
        if (parsed.gstRate !== undefined) setGstRate(parsed.gstRate);
      }
    } catch (e) {
      console.error("Failed to load billing state", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("billing_draft_state", JSON.stringify({
        cart,
        discount,
        paymentMode,
        selectedCustomerId,
        quickPhone,
        enableGST,
        gstRate,
      }));
    } catch (e) {
      console.error("Failed to save billing state", e);
    }
  }, [cart, discount, paymentMode, selectedCustomerId, quickPhone, enableGST, gstRate, isLoaded]);

  // ── Derived values ────────────────────────────────────────────────────────
  const shopName = settings?.shopName?.trim() || "Smart Kirana Store";

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxableValue = Math.max(0, subtotal - discount);
  const gstAmount = enableGST ? (taxableValue * gstRate) / 100 : 0;
  const finalAmount = taxableValue + gstAmount;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── Filtered / sorted products ────────────────────────────────────────────
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
      if (filter === "in")
        return product.stockInBaseUnit > 0 && product.currentStock > product.lowStockThreshold;
      if (filter === "low")
        return product.stockInBaseUnit > 0 && product.currentStock <= product.lowStockThreshold;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const stock = stockRank(a) - stockRank(b);
      if (stock !== 0) return stock;
      if (Boolean(b.quickSelect) !== Boolean(a.quickSelect))
        return Number(b.quickSelect) - Number(a.quickSelect);
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

  // ── Cart helpers ──────────────────────────────────────────────────────────
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
        // Increment quantity instead of removing
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

  const handleProductRemove = (product: Product) => {
    setCart((prev) => {
      const itemsToRemove = prev.filter((item) => item.productId === product.id);
      if (itemsToRemove.length > 0) {
        toast({ title: "Removed from cart", description: product.name, variant: "destructive" });
      }
      return prev.filter((item) => item.productId !== product.id);
    });
  };

  const resetCart = () => {
    setCart([]);
    setDiscount(0);
    setPaymentMode("cash");
    setSelectedCustomerId("");
    setQuickPhone("");
    setEnableGST(false);
  };

  // ── Checkout ──────────────────────────────────────────────────────────────
  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!paymentMode) {
      toast({ title: "Payment Mode select karein", variant: "destructive" });
      return;
    }
    if (paymentMode === "khata" && !selectedCustomerId) {
      toast({ title: "Khata ke liye customer select karein", variant: "destructive" });
      return;
    }

    const selectedCustomer = customers.find(
      (customer) => customer.id.toString() === selectedCustomerId
    );
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
          paymentMode: paymentMode as BillInputPaymentMode,
          enableGST,
          gstRate: enableGST ? gstRate : 0,
        },
      },
      {
        onSuccess: () => {
          const billData: BillData = {
            items: [...cart],
            customerName: selectedCustomer?.name,
            customerPhone: finalPhone,
            subtotal,
            discount,
            taxableValue,
            gstAmount,
            finalAmount,
            paymentMode: paymentMode as BillInputPaymentMode,
            enableGST,
            gstRate,
          };

          setBillSuccess(true);
          queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          queryClient.invalidateQueries({ queryKey: ["customers"] });
          queryClient.invalidateQueries({ queryKey: ["reports"] });

          const rawPhone = (billData.customerPhone ?? "")
            .replace(/\D/g, "")
            .replace(/^91/, "")
            .slice(0, 10);

          if (rawPhone.length === 10) {
            const msg = buildWhatsAppMessage(
              billData,
              shopName,
              settings?.shopAddress,
              settings?.shopPhone
            );
            window.open(`https://wa.me/91${rawPhone}?text=${encodeURIComponent(msg)}`, "_blank");
            printThermalBill(
              billData,
              shopName,
              settings?.shopAddress,
              settings?.shopPhone,
              settings?.gstNumber,
              settings?.gstEnabled
            );
          } else {
            setWhatsappBillData(billData);
          }

          setTimeout(() => {
            setCart([]);
            setDiscount(0);
            setSelectedCustomerId("");
            setQuickPhone("");
            setPaymentMode("");
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

  return {
    // data
    products,
    customers,
    settings,
    isLoading,
    shopName,
    // cart state
    cart,
    discount,
    setDiscount,
    paymentMode,
    setPaymentMode,
    selectedCustomerId,
    setSelectedCustomerId,
    quickPhone,
    setQuickPhone,
    billSuccess,
    enableGST,
    setEnableGST,
    gstRate,
    setGstRate,
    // computed
    subtotal,
    taxableValue,
    gstAmount,
    finalAmount,
    cartCount,
    // product grid
    search,
    setSearch,
    filter,
    setFilter,
    filteredProducts,
    quickProducts,
    // khula
    khulaProduct,
    setKhulaProduct,
    // whatsapp
    whatsappBillData,
    setWhatsappBillData,
    // mobile
    mobileTab,
    setMobileTab,
    // handlers
    handleProductTap,
    handleProductRemove,
    addKhula,
    updateQty,
    removeFromCart,
    resetCart,
    handleCheckout,
    createBill,
  };
}
