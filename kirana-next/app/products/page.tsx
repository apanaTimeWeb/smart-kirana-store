"use client";

import "./products.css";
import { useState, useMemo } from "react";
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  getListProductsQueryKey,
  getGetDashboardSummaryQueryKey,
  type Product,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Package, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ====================== FORM VALIDATION ======================
const productSchema = z.object({
  name: z.string().min(1, "Product naam zaruri hai"),
  purchasePricePerKg: z.coerce.number().min(0, "Purchase rate 0 se kam nahi ho sakta"),
  sellingPrice: z.coerce.number().min(0, "Selling price 0 se kam nahi ho sakta"),
  currentStock: z.coerce.number().min(0, "Stock negative nahi ho sakta"),
  lowStockThreshold: z.coerce.number().min(0, "Low stock alert 0 se kam nahi ho sakta"),
  unit: z.string().min(1, "Unit select karna zaruri hai"),
  expiryDate: z.string().optional(),
  totalQuantity: z.coerce.number().min(0, "Quantity 0 se kam nahi ho sakti").optional(),
  totalAmountPaid: z.coerce.number().min(0, "Amount 0 se kam nahi ho sakta").optional(),
  quantityPerPack: z.coerce.number().min(0.01, "Ek pack mein weight/volume positive hona chahiye").optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const UNITS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "l", label: "Liter (l)" },
  { value: "ml", label: "Milliliter (ml)" },
  { value: "bag", label: "Bag / Bora" },
  { value: "box", label: "Box" },
  { value: "cartoon", label: "Cartoon" },
  { value: "tin", label: "Tin" },
  { value: "packet", label: "Packet" },
  { value: "pic", label: "Pic / Piece" },
  { value: "bottle", label: "Bottle" },
];

// ====================== PRODUCT FORM ======================
function ProductForm({
  onSubmit,
  isPending,
  defaultValues,
  submitLabel,
}: {
  onSubmit: (values: ProductFormValues) => void;
  isPending: boolean;
  defaultValues: ProductFormValues;
  submitLabel: string;
}) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const totalQuantity = form.watch("totalQuantity");
  const totalAmountPaid = form.watch("totalAmountPaid");
  const quantityPerPack = form.watch("quantityPerPack");
  const sellingPrice = form.watch("sellingPrice");

  const calculatedPerKg = 
    totalQuantity && totalAmountPaid && quantityPerPack && quantityPerPack > 0
      ? Number((totalAmountPaid / (totalQuantity * quantityPerPack)).toFixed(2))
      : 0;

  const autoMargin = 
    sellingPrice > 0 && calculatedPerKg > 0
      ? (((sellingPrice - calculatedPerKg) / sellingPrice) * 100).toFixed(1)
      : "0";

  const onFormSubmit = (values: ProductFormValues) => {
    const finalData = {
      ...values,
      purchasePricePerKg: calculatedPerKg || values.purchasePricePerKg || 0,
    };
    onSubmit(finalData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Ka Naam</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Jaise: Maida" className="text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bulk Kharidari Calculation */}
        <div className="border-2 [border-color:var(--products-calc-border)] [background-color:var(--products-calc-bg)] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Calculator className="h-5 w-5 [color:var(--products-calc-icon)]" />
            <h3 className="font-bold text-lg">Bulk Kharidari Calculation</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="totalQuantity" render={({ field }) => (
              <FormItem>
                <FormLabel>Total Bags / Bora / Cartoon</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="quantityPerPack" render={({ field }) => (
              <FormItem>
                <FormLabel>Ek Pack Mein Kitna (kg/l)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0.01" placeholder="25" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="totalAmountPaid" render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Total Amount Paid (₹)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="5555" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="unit" render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit select karein" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="mt-6 [background-color:var(--products-calc-result-bg)] border-2 [border-color:var(--products-calc-result-border)] rounded-xl p-5 text-center">
            <p className="text-sm [color:var(--products-calc-result-label)] font-medium">PURCHASE RATE (PER KG / PER L)</p>
            <p className="text-4xl font-bold [color:var(--products-calc-result-value)] mt-1">₹{calculatedPerKg}</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="sellingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling Price (Manual) ₹</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="Jaise: 48" {...field} className="text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="currentStock" render={({ field }) => (
            <FormItem>
              <FormLabel>Current Stock</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="lowStockThreshold" render={({ field }) => (
            <FormItem>
              <FormLabel>Low Stock Alert</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full py-6 text-lg" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}

// ===================== MAIN COMPONENT =====================
export default function Products() {
  const [search, setSearch] = useState("");
  const { data: products = [], isLoading } = useListProducts({ search: search || undefined });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
  };

  // ==================== STOCK STATUS & SORTING ====================
  const getStockStatus = (stock: number, threshold: number) => {
    if (stock <= 0) return { label: "Out of Stock", variant: "destructive" as const, priority: 1 };
    if (stock <= threshold) return { label: "Low Stock", variant: "secondary" as const, priority: 2 };
    return { label: "In Stock", variant: "default" as const, priority: 3 };
  };

  // Sorted Products - Out of Stock & Low Stock first
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const statusA = getStockStatus(a.currentStock, a.lowStockThreshold);
      const statusB = getStockStatus(b.currentStock, b.lowStockThreshold);
      
      if (statusA.priority !== statusB.priority) {
        return statusA.priority - statusB.priority; // Lower priority number = higher in list
      }
      return a.name.localeCompare(b.name); // Same status mein naam se sort
    });
  }, [products]);

  const defaultAdd: ProductFormValues = {
    name: "",
    purchasePricePerKg: 0,
    sellingPrice: 0,
    currentStock: 0,
    lowStockThreshold: 10,
    unit: "kg",
    expiryDate: "",
    totalQuantity: 0,
    totalAmountPaid: 0,
    quantityPerPack: 0,
  };

  const handleAdd = (values: ProductFormValues) => {
    createProduct.mutate({ data: values }, {
      onSuccess: () => { toast({ title: "✅ Product successfully add ho gaya" }); invalidate(); setIsAddOpen(false); },
      onError: () => toast({ title: "❌ Kuch error aaya", variant: "destructive" }),
    });
  };

  const handleEdit = (values: ProductFormValues) => {
    if (!editingProduct) return;
    updateProduct.mutate({ id: editingProduct.id, data: values }, {
      onSuccess: () => { toast({ title: "✅ Product update ho gaya" }); invalidate(); setEditingProduct(null); },
      onError: () => toast({ title: "❌ Update mein error aaya", variant: "destructive" }),
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`"${name}" ko delete karna chahte hain?`)) return;
    deleteProduct.mutate({ id }, {
      onSuccess: () => { toast({ title: "✅ Product delete ho gaya" }); invalidate(); },
      onError: () => toast({ title: "❌ Delete nahi ho saka", variant: "destructive" }),
    });
  };

  const margin = (p: Product) => 
    p.sellingPrice > 0 && p.purchasePricePerKg > 0
      ? (((p.sellingPrice - p.purchasePricePerKg) / p.sellingPrice) * 100).toFixed(1) 
      : "0";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <p className="text-muted-foreground">Out of Stock & Low Stock sabse upar</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" /> Naya Product Add Karein
        </Button>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Naya Product Add Karein</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAdd}
            isPending={createProduct.isPending}
            defaultValues={defaultAdd}
            submitLabel="Product Save Karein"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Edit Karein</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              onSubmit={handleEdit}
              isPending={updateProduct.isPending}
              defaultValues={{
                name: editingProduct.name,
                purchasePricePerKg: editingProduct.purchasePricePerKg || 0,
                sellingPrice: editingProduct.sellingPrice,
                currentStock: editingProduct.currentStock,
                lowStockThreshold: editingProduct.lowStockThreshold,
                unit: editingProduct.unit,
                expiryDate: editingProduct.expiryDate || "",
                totalQuantity: 0,
                totalAmountPaid: 0,
                quantityPerPack: 0,
              }}
              submitLabel="Update Karein"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Products Table */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60">
              <TableHead>Product</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Purchase Rate/kg</TableHead>
              <TableHead className="text-center">Selling Price</TableHead>
              <TableHead className="text-center">Margin %</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => {
              const status = getStockStatus(product.currentStock, product.lowStockThreshold);

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-semibold">{product.name}</TableCell>
                  <TableCell>
                    {product.currentStock} <span className="text-xs text-muted-foreground">{product.unit}</span>
                  </TableCell>

                  <TableCell>
                    <Badge 
                      variant={status.variant}
                      className={status.label === "Low Stock" ? "[background-color:var(--products-badge-lowstock-bg)] [color:var(--products-badge-lowstock-text)] [border-color:var(--products-badge-lowstock-border)]" : ""}
                    >
                      {status.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center font-bold [color:var(--products-purchase-rate)]">₹{product.purchasePricePerKg}</TableCell>
                  <TableCell className="text-center font-semibold [color:var(--products-selling-price)]">₹{product.sellingPrice}</TableCell>
                  <TableCell className="text-center font-medium [color:var(--products-margin)]">{margin(product)}%</TableCell>
                  <TableCell>
                    {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('hi-IN') : "-"}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="[color:var(--products-btn-delete-text)]" onClick={() => handleDelete(product.id, product.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {sortedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Koi product nahi mila
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}