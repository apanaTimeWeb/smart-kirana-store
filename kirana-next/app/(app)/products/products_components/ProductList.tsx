"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Warehouse, PackagePlus, Boxes, ShoppingBag, Barcode, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useAddPurchaseEntry,
  getGetDashboardSummaryQueryKey,
  getListProductsQueryKey,
  Product,
  ProductVariantInput,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ProductFilter, ProductDraft } from "./types";
import { MODE_CLASS, MODE_LABEL, formatBaseUnits, toInput } from "./utils";
import { StockBadge } from "./StockBadge";
import { ProductCreator } from "./ProductCreator";
import { PurchaseDialog } from "./PurchaseDialog";
import { EditVariantDialog } from "./EditVariantDialog";

export function ProductList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProductFilter>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: allProducts = [] } = useListProducts();
  const { data: products = [] } = useListProducts({ search: search || undefined });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const addPurchase = useAddPurchaseEntry();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    queryClient.invalidateQueries({ queryKey: ["reports"] });
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aStatus = a.currentStock <= 0 ? 0 : a.currentStock <= a.lowStockThreshold ? 1 : 2;
      const bStatus = b.currentStock <= 0 ? 0 : b.currentStock <= b.lowStockThreshold ? 1 : 2;
      if (aStatus !== bStatus) return aStatus - bStatus;
      if (Boolean(b.quickSelect) !== Boolean(a.quickSelect)) return Number(b.quickSelect) - Number(a.quickSelect);
      return a.name.localeCompare(b.name);
    });
  }, [products]);

  const visibleProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      if (filter === "in") return product.currentStock > product.lowStockThreshold;
      if (filter === "low") return product.currentStock > 0 && product.currentStock <= product.lowStockThreshold;
      if (filter === "out") return product.currentStock <= 0 || product.stockInBaseUnit <= 0;
      if (filter === "khula") return product.sellingMode === "khula";
      if (filter === "wholesale") return product.sellingMode === "wholesale";
      if (filter === "quick") return product.quickSelect;
      return true;
    });
  }, [filter, sortedProducts]);

  const stats = useMemo(() => {
    const khula = allProducts.filter((product) => product.sellingMode === "khula").length;
    const low = allProducts.filter((product) => product.currentStock <= product.lowStockThreshold || product.stockInBaseUnit <= 0).length;
    const quick = allProducts.filter((product) => product.quickSelect).length;
    return { total: allProducts.length, khula, low, quick };
  }, [allProducts]);

  const create = (draft: ProductDraft) => {
    const input = toInput(draft);
    createProduct.mutate({ data: input }, {
      onSuccess: () => {
        invalidate();
        setIsAddOpen(false);
        toast({ title: "Product master aur variants add ho gaye" });
      },
      onError: () => toast({ title: "Product add nahi hua", variant: "destructive" }),
    });
  };

  const update = (id: number, input: Partial<ProductVariantInput>) => {
    updateProduct.mutate({ id, data: input }, {
      onSuccess: () => {
        invalidate();
        setEditingProduct(null);
        toast({ title: "Variant update ho gaya" });
      },
      onError: () => toast({ title: "Variant update nahi hua", variant: "destructive" }),
    });
  };

  const remove = (product: Product) => {
    if (!confirm(`${product.name} delete karna hai?`)) return;
    deleteProduct.mutate({ id: product.id }, {
      onSuccess: () => {
        invalidate();
        toast({ title: "Variant delete ho gaya" });
      },
      onError: () => toast({ title: "Delete nahi hua", variant: "destructive" }),
    });
  };

  const purchase = (variantId: number, quantity: number, purchasePrice?: number) => {
    addPurchase.mutate({ data: { variantId, quantity, purchasePrice } }, {
      onSuccess: () => {
        invalidate();
        setIsPurchaseOpen(false);
        toast({ title: "Purchase stock add ho gaya" });
      },
      onError: () => toast({ title: "Purchase entry save nahi hui", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Master</h1>
          <p className="text-sm text-muted-foreground">Khula, packet, bora, tin, box aur carton variants ek jagah.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsPurchaseOpen(true)}>
            <Warehouse className="h-4 w-4" />
            Purchase Entry
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <PackagePlus className="h-4 w-4" />
            Naya Product
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Variants", value: stats.total, icon: Boxes },
          { label: "Khula Items", value: stats.khula, icon: ShoppingBag },
          { label: "Quick Billing", value: stats.quick, icon: Barcode },
          { label: "Low/Out", value: stats.low, icon: Warehouse },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
              <item.icon className="h-4 w-4 text-[var(--products-stat-icon)]" />
            </div>
            <p className="mt-2 text-2xl font-extrabold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search: name, barcode, shortcut, keyword..."
          className="h-11 pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          ["all", "All"],
          ["out", "Out"],
          ["low", "Low"],
          ["in", "In Stock"],
          ["khula", "Khula"],
          ["wholesale", "Bora/Wholesale"],
          ["quick", "Quick"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
              filter === value ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted/60"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60">
              <TableHead>Product</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Conversion</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <p className="font-semibold">{product.productName}</p>
                  <p className="text-xs text-muted-foreground">{product.category}{product.shortcut ? ` / ${product.shortcut}` : ""}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{product.variantName}</p>
                  {product.barcode && <p className="text-xs text-muted-foreground">{product.barcode}</p>}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={MODE_CLASS[product.sellingMode]}>{MODE_LABEL[product.sellingMode]}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  1 {product.unitType.toLowerCase()} = {formatBaseUnits(product.baseQuantity, product.baseUnit)}
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{product.currentStock} {product.unit}</p>
                  <p className="text-xs text-muted-foreground">{formatBaseUnits(product.stockInBaseUnit, product.baseUnit)}</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-[var(--products-selling-price)]">Rs {product.sellingPrice}</p>
                  <p className="text-xs text-muted-foreground">Buy Rs {product.purchasePrice}</p>
                </TableCell>
                <TableCell><StockBadge product={product} /></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-[var(--products-btn-delete-text)]" onClick={() => remove(product)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {visibleProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Koi product nahi mila</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-2 md:hidden">
        {visibleProducts.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
            Koi product nahi mila
          </div>
        )}
        {visibleProducts.map((product) => (
          <div key={product.id} className="rounded-lg border bg-card p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold">{product.productName}</p>
                <p className="text-sm text-muted-foreground">{product.variantName}</p>
              </div>
              <StockBadge product={product} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div><span className="text-muted-foreground">Stock</span><p className="font-semibold">{product.currentStock} {product.unit}</p></div>
              <div><span className="text-muted-foreground">Sell</span><p className="font-semibold">Rs {product.sellingPrice}</p></div>
              <div><span className="text-muted-foreground">Mode</span><p className="font-semibold">{MODE_LABEL[product.sellingMode]}</p></div>
            </div>
            <div className="mt-3 flex justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingProduct(product)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--products-btn-delete-text)]" onClick={() => remove(product)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <ProductCreator open={isAddOpen} onOpenChange={setIsAddOpen} onSubmit={create} isPending={createProduct.isPending} />
      <PurchaseDialog open={isPurchaseOpen} onOpenChange={setIsPurchaseOpen} products={allProducts} onSubmit={purchase} isPending={addPurchase.isPending} />
      <EditVariantDialog product={editingProduct} onClose={() => setEditingProduct(null)} onSubmit={update} isPending={updateProduct.isPending} />
    </div>
  );
}
