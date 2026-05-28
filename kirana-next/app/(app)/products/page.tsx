"use client";

import "./products.css";
import { useEffect, useMemo, useState } from "react";
import {
  getGetDashboardSummaryQueryKey,
  getListProductsQueryKey,
  type BaseUnit,
  type Product,
  type ProductInput,
  type ProductVariantInput,
  type SellingMode,
  type UnitType,
  useAddPurchaseEntry,
  useCreateProduct,
  useDeleteProduct,
  useListProducts,
  useUpdateProduct,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Barcode,
  Boxes,
  Edit,
  PackagePlus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Warehouse,
} from "lucide-react";

type SellingTypeKey = "khula" | "fixed" | "multiple";
type ProductFilter = "all" | "in" | "low" | "out" | "khula" | "wholesale" | "quick";

type VariantDraft = ProductVariantInput & {
  rowId: string;
};

type ProductDraft = {
  name: string;
  category: string;
  brand: string;
  keywords: string;
  shortcut: string;
  barcode: string;
  sellingTypes: Record<SellingTypeKey, boolean>;
  variants: VariantDraft[];
};

const UNITS: UnitType[] = [
  "GRAM",
  "KG",
  "ML",
  "LITRE",
  "PIECE",
  "POUCH",
  "BOTTLE",
  "PACKET",
  "BOX",
  "CARTON",
  "TIN",
  "DABBA",
  "BORA",
  "BAG",
  "DOZEN",
  "BUNDLE",
];

const BASE_UNITS: BaseUnit[] = ["gram", "ml", "piece"];

const MODE_LABEL: Record<SellingMode, string> = {
  khula: "Khula",
  fixed: "Fixed",
  variant: "Variant",
  wholesale: "Wholesale",
};

const MODE_CLASS: Record<SellingMode, string> = {
  khula: "bg-[var(--products-mode-khula-bg)] text-[var(--products-mode-khula-text)] border-[var(--products-mode-khula-border)]",
  fixed: "bg-[var(--products-mode-fixed-bg)] text-[var(--products-mode-fixed-text)] border-[var(--products-mode-fixed-border)]",
  variant: "bg-[var(--products-mode-variant-bg)] text-[var(--products-mode-variant-text)] border-[var(--products-mode-variant-border)]",
  wholesale: "bg-[var(--products-mode-wholesale-bg)] text-[var(--products-mode-wholesale-text)] border-[var(--products-mode-wholesale-border)]",
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function numberValue(value: string | number | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function defaultBaseUnit(unitType: UnitType): BaseUnit {
  const unit = String(unitType).toUpperCase();
  if (["GRAM", "KG", "BORA", "BAG"].includes(unit)) return "gram";
  if (["ML", "LITRE", "TIN"].includes(unit)) return "ml";
  return "piece";
}

function defaultBaseQuantity(unitType: UnitType) {
  const unit = String(unitType).toUpperCase();
  if (unit === "GRAM") return 1;
  if (unit === "KG") return 1000;
  if (unit === "ML") return 1;
  if (unit === "LITRE") return 1000;
  if (unit === "BORA") return 50000;
  if (unit === "BAG") return 25000;
  if (unit === "TIN") return 15000;
  if (unit === "BOX") return 10;
  if (unit === "CARTON") return 200;
  if (unit === "DOZEN") return 12;
  return 1;
}

function defaultPresetsFor(baseUnit: BaseUnit) {
  if (baseUnit === "gram") return [100, 250, 500, 1000, 2000, 5000, 10000];
  if (baseUnit === "ml") return [100, 250, 500, 1000, 5000, 15000];
  return [];
}

function formatBaseUnits(quantity: number, baseUnit: BaseUnit) {
  if (baseUnit === "gram") {
    return quantity >= 1000 ? `${Number((quantity / 1000).toFixed(3))} kg` : `${quantity} g`;
  }
  if (baseUnit === "ml") {
    return quantity >= 1000 ? `${Number((quantity / 1000).toFixed(3))} litre` : `${quantity} ml`;
  }
  return `${quantity} pcs`;
}

function variantDraft(overrides: Partial<VariantDraft> = {}): VariantDraft {
  const unitType = overrides.unitType ?? "KG";
  const baseUnit = overrides.baseUnit ?? defaultBaseUnit(unitType);
  return {
    rowId: uid(),
    variantName: overrides.variantName ?? "Khula",
    unitType,
    baseUnit,
    baseQuantity: overrides.baseQuantity ?? defaultBaseQuantity(unitType),
    sellingMode: overrides.sellingMode ?? "khula",
    mrp: overrides.mrp ?? 0,
    purchasePrice: overrides.purchasePrice ?? 0,
    sellingPrice: overrides.sellingPrice ?? 0,
    quickSelect: overrides.quickSelect ?? false,
    barcode: overrides.barcode ?? "",
    stockInBaseUnit: overrides.stockInBaseUnit ?? 0,
    lowStockThresholdInBaseUnit: overrides.lowStockThresholdInBaseUnit ?? defaultBaseQuantity(unitType) * 5,
    presetBaseQuantities: overrides.presetBaseQuantities ?? defaultPresetsFor(baseUnit),
  };
}

function emptyDraft(): ProductDraft {
  return {
    name: "",
    category: "General",
    brand: "",
    keywords: "",
    shortcut: "",
    barcode: "",
    sellingTypes: { khula: true, fixed: false, multiple: false },
    variants: [variantDraft({ variantName: "Khula", sellingMode: "khula", unitType: "KG", quickSelect: true })],
  };
}

function buildTemplate(types: Record<SellingTypeKey, boolean>) {
  const rows: VariantDraft[] = [];
  if (types.khula) {
    rows.push(variantDraft({ variantName: "Khula", sellingMode: "khula", unitType: "KG", quickSelect: true }));
  }
  if (types.fixed) {
    rows.push(variantDraft({ variantName: "1kg Packet", sellingMode: "fixed", unitType: "PACKET", baseUnit: "gram", baseQuantity: 1000 }));
  }
  if (types.multiple) {
    rows.push(
      variantDraft({ variantName: "2kg Packet", sellingMode: "variant", unitType: "PACKET", baseUnit: "gram", baseQuantity: 2000 }),
      variantDraft({ variantName: "5kg Packet", sellingMode: "variant", unitType: "PACKET", baseUnit: "gram", baseQuantity: 5000, quickSelect: true }),
      variantDraft({ variantName: "10kg Bora", sellingMode: "wholesale", unitType: "BORA", baseUnit: "gram", baseQuantity: 10000 }),
      variantDraft({ variantName: "50kg Bora", sellingMode: "wholesale", unitType: "BORA", baseUnit: "gram", baseQuantity: 50000 })
    );
  }
  return rows.length ? rows : [variantDraft()];
}

function toInput(draft: ProductDraft): ProductInput {
  return {
    name: draft.name.trim(),
    category: draft.category.trim() || "General",
    brand: draft.brand.trim() || undefined,
    barcode: draft.barcode.trim() || undefined,
    shortcut: draft.shortcut.trim() || undefined,
    searchKeywords: draft.keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    variants: draft.variants.map((variant) => ({
      variantName: variant.variantName.trim() || "Default",
      unitType: variant.unitType,
      baseUnit: variant.baseUnit,
      baseQuantity: numberValue(variant.baseQuantity, 1),
      sellingMode: variant.sellingMode,
      mrp: numberValue(variant.mrp, 0),
      purchasePrice: numberValue(variant.purchasePrice, 0),
      sellingPrice: numberValue(variant.sellingPrice, 0),
      quickSelect: Boolean(variant.quickSelect),
      barcode: variant.barcode?.trim() || undefined,
      stockInBaseUnit: numberValue(variant.stockInBaseUnit, 0),
      lowStockThresholdInBaseUnit: numberValue(variant.lowStockThresholdInBaseUnit, 0),
      presetBaseQuantities: variant.presetBaseQuantities ?? [],
    })),
  };
}

function StockBadge({ product }: { product: Product }) {
  const out = product.currentStock <= 0;
  const low = !out && product.currentStock <= product.lowStockThreshold;
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold",
        out && "bg-[var(--products-stock-out-bg)] text-[var(--products-stock-out-text)] border-[var(--products-stock-out-border)]",
        low && "bg-[var(--products-badge-lowstock-bg)] text-[var(--products-badge-lowstock-text)] border-[var(--products-badge-lowstock-border)]",
        !out && !low && "bg-[var(--products-stock-ok-bg)] text-[var(--products-stock-ok-text)] border-[var(--products-stock-ok-border)]"
      )}
    >
      {out ? "Out" : low ? "Low" : "OK"}
    </Badge>
  );
}

function ProductCreator({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: ProductDraft) => void;
  isPending: boolean;
}) {
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft());

  const setType = (type: SellingTypeKey, checked: boolean) => {
    const sellingTypes = { ...draft.sellingTypes, [type]: checked };
    setDraft({ ...draft, sellingTypes, variants: buildTemplate(sellingTypes) });
  };

  const setVariant = (rowId: string, patch: Partial<VariantDraft>) => {
    setDraft({
      ...draft,
      variants: draft.variants.map((variant) => {
        if (variant.rowId !== rowId) return variant;
        const unitType = patch.unitType ?? variant.unitType;
        const baseUnit = patch.unitType ? defaultBaseUnit(unitType) : patch.baseUnit ?? variant.baseUnit;
        const baseQuantity = patch.unitType ? defaultBaseQuantity(unitType) : patch.baseQuantity ?? variant.baseQuantity;
        return { ...variant, ...patch, unitType, baseUnit, baseQuantity };
      }),
    });
  };

  const submit = () => {
    onSubmit(draft);
    setDraft(emptyDraft());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Master + Variants</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Product name</label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Fortune Mustard Oil" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Oil" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Brand</label>
                <Input value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} placeholder="Fortune" />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Search keywords</label>
              <Input value={draft.keywords} onChange={(e) => setDraft({ ...draft, keywords: e.target.value })} placeholder="sarso tel, oil, mustard" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Shortcut</label>
                <Input value={draft.shortcut} onChange={(e) => setDraft({ ...draft, shortcut: e.target.value })} placeholder="oil" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Master barcode</label>
                <Input value={draft.barcode} onChange={(e) => setDraft({ ...draft, barcode: e.target.value })} placeholder="optional" />
              </div>
            </div>

            <div className="rounded-lg border bg-[var(--products-type-bg)] p-3">
              <p className="mb-3 text-sm font-semibold">Selling type</p>
              <div className="grid gap-2">
                {([
                  ["khula", "Khula"],
                  ["fixed", "Fixed Pack"],
                  ["multiple", "Multiple Variant"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
                    <Checkbox checked={draft.sellingTypes[key]} onCheckedChange={(checked) => setType(key, Boolean(checked))} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold">Variant Add</p>
                <p className="text-xs text-muted-foreground">Stock hamesha base unit me save hoga: gram, ml, piece.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDraft({ ...draft, variants: [...draft.variants, variantDraft({ variantName: "New Variant", sellingMode: "variant", unitType: "PACKET" })] })}
              >
                <Plus className="h-4 w-4" />
                Row
              </Button>
            </div>

            <div className="space-y-3">
              {draft.variants.map((variant, index) => (
                <div key={variant.rowId} className="rounded-lg border bg-card p-3">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Badge variant="outline">Variant {index + 1}</Badge>
                    {draft.variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[var(--products-btn-delete-text)]"
                        onClick={() => setDraft({ ...draft, variants: draft.variants.filter((v) => v.rowId !== variant.rowId) })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-4">
                    <Input value={variant.variantName} onChange={(e) => setVariant(variant.rowId, { variantName: e.target.value })} placeholder="500ml pouch" />
                    <Select value={variant.sellingMode} onValueChange={(value) => setVariant(variant.rowId, { sellingMode: value as SellingMode })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(MODE_LABEL).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={String(variant.unitType)} onValueChange={(value) => setVariant(variant.rowId, { unitType: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={variant.baseUnit} onValueChange={(value) => setVariant(variant.rowId, { baseUnit: value as BaseUnit })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{BASE_UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input type="number" min="0" value={variant.baseQuantity} onChange={(e) => setVariant(variant.rowId, { baseQuantity: numberValue(e.target.value, 1) })} placeholder="Base qty" />
                    <Input type="number" min="0" value={variant.purchasePrice} onChange={(e) => setVariant(variant.rowId, { purchasePrice: numberValue(e.target.value) })} placeholder="Purchase rate" />
                    <Input type="number" min="0" value={variant.sellingPrice} onChange={(e) => setVariant(variant.rowId, { sellingPrice: numberValue(e.target.value) })} placeholder="Selling rate" />
                    <Input value={variant.barcode ?? ""} onChange={(e) => setVariant(variant.rowId, { barcode: e.target.value })} placeholder="Barcode" />
                    <Input type="number" min="0" value={variant.stockInBaseUnit} onChange={(e) => setVariant(variant.rowId, { stockInBaseUnit: numberValue(e.target.value) })} placeholder="Stock in base unit" />
                    <Input type="number" min="0" value={variant.lowStockThresholdInBaseUnit} onChange={(e) => setVariant(variant.rowId, { lowStockThresholdInBaseUnit: numberValue(e.target.value) })} placeholder="Low stock base" />
                    <Input type="number" min="0" value={variant.mrp ?? 0} onChange={(e) => setVariant(variant.rowId, { mrp: numberValue(e.target.value) })} placeholder="MRP" />
                    <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                      <Checkbox checked={variant.quickSelect} onCheckedChange={(checked) => setVariant(variant.rowId, { quickSelect: Boolean(checked) })} />
                      Quick
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    1 {variant.unitType.toLowerCase()} = {formatBaseUnits(numberValue(variant.baseQuantity, 1), variant.baseUnit)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={submit} disabled={isPending || !draft.name.trim() || draft.variants.length === 0} className="h-11 w-full font-bold">
          {isPending ? "Saving..." : "Product Save Karein"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function PurchaseDialog({
  open,
  onOpenChange,
  products,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSubmit: (variantId: number, quantity: number, purchasePrice?: number) => void;
  isPending: boolean;
}) {
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState("");
  const selected = products.find((product) => product.id.toString() === variantId);
  const addedBase = selected ? selected.baseQuantity * quantity : 0;

  const submit = () => {
    if (!selected) return;
    onSubmit(selected.id, quantity, purchasePrice ? Number(purchasePrice) : undefined);
    setQuantity(1);
    setPurchasePrice("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Purchase Entry</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Product variant</label>
            <Select value={variantId} onValueChange={setVariantId}>
              <SelectTrigger><SelectValue placeholder="Chini 50kg Bora" /></SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.productName} - {product.variantName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Qty</label>
              <Input type="number" min="0" value={quantity} onChange={(e) => setQuantity(numberValue(e.target.value, 0))} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">New purchase rate</label>
              <Input type="number" min="0" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="optional" />
            </div>
          </div>

          {selected && (
            <div className="rounded-lg border bg-[var(--products-purchase-preview-bg)] p-4">
              <p className="text-sm font-semibold">{quantity} x {selected.variantName}</p>
              <p className="mt-1 text-2xl font-extrabold text-[var(--products-purchase-preview-text)]">
                + {formatBaseUnits(addedBase, selected.baseUnit)}
              </p>
              <p className="text-xs text-muted-foreground">
                Stock base me add hoga. Current: {selected.currentStock} {selected.unit}
              </p>
            </div>
          )}

          <Button onClick={submit} disabled={!selected || quantity <= 0 || isPending} className="h-11 font-bold">
            {isPending ? "Saving..." : "Stock Add Karein"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditVariantDialog({
  product,
  onClose,
  onSubmit,
  isPending,
}: {
  product: Product | null;
  onClose: () => void;
  onSubmit: (id: number, input: Partial<ProductVariantInput>) => void;
  isPending: boolean;
}) {
  const [draft, setDraft] = useState<VariantDraft | null>(null);

  useEffect(() => {
    if (!product) {
      setDraft(null);
      return;
    }
    setDraft({
      rowId: product.id.toString(),
      id: product.id,
      variantName: product.variantName,
      unitType: product.unitType,
      baseUnit: product.baseUnit,
      baseQuantity: product.baseQuantity,
      sellingMode: product.sellingMode,
      mrp: product.mrp ?? 0,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      quickSelect: product.quickSelect,
      barcode: product.barcode ?? "",
      stockInBaseUnit: product.stockInBaseUnit,
      lowStockThresholdInBaseUnit: product.lowStockThresholdInBaseUnit,
      presetBaseQuantities: product.presetBaseQuantities ?? [],
    });
  }, [product]);

  if (!product || !draft) return null;

  const patchDraft = (patch: Partial<VariantDraft>) => {
    const unitType = patch.unitType ?? draft.unitType;
    setDraft({
      ...draft,
      ...patch,
      unitType,
      baseUnit: patch.unitType ? defaultBaseUnit(unitType) : patch.baseUnit ?? draft.baseUnit,
      baseQuantity: patch.unitType ? defaultBaseQuantity(unitType) : patch.baseQuantity ?? draft.baseQuantity,
    });
  };

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Variant - {product.productName}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <Input value={draft.variantName} onChange={(e) => patchDraft({ variantName: e.target.value })} placeholder="Variant Name (e.g., 500ml Pouch)" />
          <Select value={draft.sellingMode} onValueChange={(value) => patchDraft({ sellingMode: value as SellingMode })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(MODE_LABEL).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={draft.unitType} onValueChange={(value) => patchDraft({ unitType: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={draft.baseUnit} onValueChange={(value) => patchDraft({ baseUnit: value as BaseUnit })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{BASE_UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}</SelectContent>
          </Select>
          <Input type="number" min="0" value={draft.baseQuantity} onChange={(e) => patchDraft({ baseQuantity: numberValue(e.target.value, 1) })} placeholder="Base Quantity" />
          <Input type="number" min="0" value={draft.purchasePrice} onChange={(e) => patchDraft({ purchasePrice: numberValue(e.target.value) })} placeholder="Purchase Rate" />
          <Input type="number" min="0" value={draft.sellingPrice} onChange={(e) => patchDraft({ sellingPrice: numberValue(e.target.value) })} placeholder="Selling Rate" />
          <Input value={draft.barcode ?? ""} onChange={(e) => patchDraft({ barcode: e.target.value })} placeholder="Barcode" />
          <Input type="number" min="0" value={draft.stockInBaseUnit} onChange={(e) => patchDraft({ stockInBaseUnit: numberValue(e.target.value) })} placeholder="Stock (in base unit)" />
          <Input type="number" min="0" value={draft.lowStockThresholdInBaseUnit} onChange={(e) => patchDraft({ lowStockThresholdInBaseUnit: numberValue(e.target.value) })} placeholder="Low Stock Threshold" />
        </div>
        <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <Checkbox checked={draft.quickSelect} onCheckedChange={(checked) => patchDraft({ quickSelect: Boolean(checked) })} />
          Quick billing suggestion
        </label>

        <Button onClick={() => onSubmit(product.id, draft)} disabled={isPending} className="h-11 font-bold">
          {isPending ? "Saving..." : "Update Variant"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function Products() {
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
