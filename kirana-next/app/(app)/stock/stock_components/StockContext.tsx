"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
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
import { ProductFilter, ProductDraft } from "./StockTypes";
import { toInput } from "./StockUtils";

function useStockStateInternal() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProductFilter>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const f = params.get("filter") as ProductFilter | null;
      if (f) setFilter(f);
    }
  }, []);

  const { data: allProducts = [] } = useListProducts();
  const { data: products = [], isLoading } = useListProducts({ search: search || undefined });
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
      if (filter === "expiring") {
        if (!product.expiryDate) return false;
        const daysLeft = (new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return daysLeft <= 15;
      }
      return true;
    });
  }, [filter, sortedProducts]);

  const stats = useMemo(() => {
    const khula = allProducts.filter((product) => product.sellingMode === "khula").length;
    const low = allProducts.filter((product) => product.currentStock <= product.lowStockThreshold || product.stockInBaseUnit <= 0).length;
    const quick = allProducts.filter((product) => product.quickSelect).length;
    return { total: allProducts.length, khula, low, quick };
  }, [allProducts]);

  const totalPages = Math.ceil(visibleProducts.length / itemsPerPage);
  const paginatedProducts = visibleProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: ProductFilter) => {
    setFilter(value);
    setCurrentPage(1);
  };

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

  const purchase = (variantId: number, quantity: number, purchasePrice?: number, supplierId?: number, expiryDate?: string) => {
    addPurchase.mutate({ data: { variantId, quantity, purchasePrice, supplierId, expiryDate } }, {
      onSuccess: () => {
        invalidate();
        setIsPurchaseOpen(false);
        toast({ title: "Purchase stock add ho gaya" });
      },
      onError: () => toast({ title: "Purchase entry save nahi hui", variant: "destructive" }),
    });
  };

  return {
    search,
    handleSearchChange,
    filter,
    handleFilterChange,
    isAddOpen,
    setIsAddOpen,
    isPurchaseOpen,
    setIsPurchaseOpen,
    editingProduct,
    setEditingProduct,
    currentPage,
    setCurrentPage,
    totalPages,
    allProducts,
    products,
    sortedProducts,
    visibleProducts,
    paginatedProducts,
    stats,
    isLoading,
    create,
    isCreating: createProduct.isPending,
    update,
    isUpdating: updateProduct.isPending,
    remove,
    isRemoving: deleteProduct.isPending,
    purchase,
    isPurchasing: addPurchase.isPending,
  };
}

export type StockContextValue = ReturnType<typeof useStockStateInternal>;

const StockContext = createContext<StockContextValue | null>(null);

export function StockProvider({ children }: { children: React.ReactNode }) {
  const value = useStockStateInternal();
  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}

export function useStock() {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return context;
}
