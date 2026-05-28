"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Info, Scale, IndianRupee, Package, Calendar } from "lucide-react";
import { ProductDraft, SellingTypeKey, VariantDraft } from "./types";
import {
  BASE_UNITS,
  MODE_LABEL,
  UNITS,
  buildTemplate,
  defaultBaseQuantity,
  defaultBaseUnit,
  emptyDraft,
  formatBaseUnits,
  numberValue,
  variantDraft,
} from "./utils";
import { BaseUnit, SellingMode } from "@/lib/api";

export function ProductCreator({
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
  const [activeTab, setActiveTab] = useState<string>("master");

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
    setActiveTab("master");
  };

  const addVariant = () => {
    const newVariant = variantDraft({ variantName: "New Variant", sellingMode: "variant", unitType: "PACKET" });
    setDraft({
      ...draft,
      variants: [...draft.variants, newVariant],
    });
    setActiveTab(newVariant.rowId);
  };

  const removeVariant = (rowId: string) => {
    const newVariants = draft.variants.filter((v) => v.rowId !== rowId);
    setDraft({ ...draft, variants: newVariants });
    if (activeTab === rowId) {
      setActiveTab(newVariants.length > 0 ? newVariants[0].rowId : "master");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] h-full md:h-auto flex flex-col bg-muted/10 p-0 overflow-hidden">
        <DialogHeader className="bg-card px-5 py-4 border-b shrink-0">
          <DialogTitle className="text-xl">Add New Product</DialogTitle>
          <p className="text-sm text-muted-foreground">Define product details and all its variants (Khula, Packets, Wholesale).</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-card border-b px-2 shrink-0 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-2 p-2">
              <TabsList className="h-10 bg-transparent gap-1">
                <TabsTrigger 
                  value="master" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
                >
                  Master Info
                </TabsTrigger>
                {draft.variants.map((variant, index) => (
                  <TabsTrigger 
                    key={variant.rowId} 
                    value={variant.rowId}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 whitespace-nowrap"
                  >
                    Variant {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full shrink-0 h-8 px-3 ml-2 border-dashed border-2 text-muted-foreground hover:text-foreground"
                onClick={addVariant}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <TabsContent value="master" className="m-0 space-y-6 animate-in fade-in-50 duration-300">
              <div className="rounded-xl border bg-card p-5 space-y-5 shadow-sm">
                <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Product Master Details
                </h3>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="e.g. Fortune Mustard Oil"
                    className="h-11"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      placeholder="e.g. Oil"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Brand</label>
                    <Input
                      value={draft.brand}
                      onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                      placeholder="e.g. Fortune"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Search Keywords</label>
                    <Input
                      value={draft.keywords}
                      onChange={(e) => setDraft({ ...draft, keywords: e.target.value })}
                      placeholder="e.g. sarso tel, mustard"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Shortcut Key</label>
                    <Input
                      value={draft.shortcut}
                      onChange={(e) => setDraft({ ...draft, shortcut: e.target.value })}
                      placeholder="e.g. oil"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
                <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Auto-Generate Variants
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select selling types to automatically create common variant templates.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {([
                    ["khula", "Khula (Loose)"],
                    ["fixed", "Fixed Pack"],
                    ["multiple", "Wholesale"],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                      <Checkbox
                        checked={draft.sellingTypes[key]}
                        onCheckedChange={(checked) => setType(key, Boolean(checked))}
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            {draft.variants.map((variant, index) => (
              <TabsContent key={variant.rowId} value={variant.rowId} className="m-0 animate-in fade-in-50 duration-300">
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                  <div className="bg-muted/30 px-4 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-background">Variant {index + 1}</Badge>
                      <span className="text-sm font-semibold">{variant.variantName || "Unnamed Variant"}</span>
                    </div>
                    {draft.variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 h-8 px-2"
                        onClick={() => removeVariant(variant.rowId)}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Delete Variant
                      </Button>
                    )}
                  </div>
                  
                  <div className="p-4 md:p-5 space-y-6">
                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Variant Name</label>
                        <Input
                          value={variant.variantName}
                          onChange={(e) => setVariant(variant.rowId, { variantName: e.target.value })}
                          placeholder="e.g. 500ml pouch"
                          className="h-10"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Selling Mode</label>
                        <Select
                          value={variant.sellingMode}
                          onValueChange={(value) => setVariant(variant.rowId, { sellingMode: value as SellingMode })}
                        >
                          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(MODE_LABEL).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Measurement */}
                    <div className="space-y-3 rounded-lg border p-3.5 bg-muted/10">
                      <h4 className="text-xs font-semibold flex items-center gap-1.5">
                        <Scale className="h-3.5 w-3.5" /> Measurement
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Pack Type</label>
                          <Select
                            value={String(variant.unitType)}
                            onValueChange={(value) => setVariant(variant.rowId, { unitType: value as any })}
                          >
                            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {UNITS.map((unit) => (
                                <SelectItem key={unit} value={unit} className="text-sm">{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Base Unit</label>
                          <Select
                            value={variant.baseUnit}
                            onValueChange={(value) => setVariant(variant.rowId, { baseUnit: value as BaseUnit })}
                          >
                            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {BASE_UNITS.map((unit) => (
                                <SelectItem key={unit} value={unit} className="text-sm">{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-1.5 col-span-2 md:col-span-1">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Qty in Base Unit</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              className="h-9 text-sm"
                              value={variant.baseQuantity}
                              onChange={(e) => setVariant(variant.rowId, { baseQuantity: numberValue(e.target.value, 1) })}
                              placeholder="e.g. 500"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground bg-background border px-3 py-2 rounded-md">
                        Calculation: 1 <span className="font-semibold text-foreground">{variant.unitType.toLowerCase()}</span> = <span className="font-semibold text-foreground">{formatBaseUnits(numberValue(variant.baseQuantity, 1), variant.baseUnit)}</span>
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3 rounded-lg border p-3.5 bg-muted/10">
                      <h4 className="text-xs font-semibold flex items-center gap-1.5">
                        <IndianRupee className="h-3.5 w-3.5" /> Pricing (₹)
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Buy Rate</label>
                          <Input
                            type="number"
                            className="h-9 text-sm"
                            value={variant.purchasePrice}
                            onChange={(e) => setVariant(variant.rowId, { purchasePrice: numberValue(e.target.value) })}
                            placeholder="40"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Sell Rate</label>
                          <Input
                            type="number"
                            className="h-9 text-sm"
                            value={variant.sellingPrice}
                            onChange={(e) => setVariant(variant.rowId, { sellingPrice: numberValue(e.target.value) })}
                            placeholder="45"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">MRP</label>
                          <Input
                            type="number"
                            className="h-9 text-sm"
                            value={variant.mrp ?? 0}
                            onChange={(e) => setVariant(variant.rowId, { mrp: numberValue(e.target.value) })}
                            placeholder="50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stock & Expiry */}
                    <div className="space-y-3 rounded-lg border p-3.5 bg-muted/10">
                      <h4 className="text-xs font-semibold flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" /> Initial Stock & Expiry
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            Current Stock ({variant.baseUnit})
                          </label>
                          <Input
                            type="number"
                            className="h-9 text-sm"
                            value={variant.stockInBaseUnit}
                            onChange={(e) => setVariant(variant.rowId, { stockInBaseUnit: numberValue(e.target.value) })}
                            placeholder="Stock in base unit"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            Low Alert At ({variant.baseUnit})
                          </label>
                          <Input
                            type="number"
                            className="h-9 text-sm"
                            value={variant.lowStockThresholdInBaseUnit}
                            onChange={(e) => setVariant(variant.rowId, { lowStockThresholdInBaseUnit: numberValue(e.target.value) })}
                            placeholder="Alert qty"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3"/> Expiry Date
                          </label>
                          <Input
                            type="date"
                            className="h-9 text-sm"
                            value={variant.expiryDate || ""}
                            onChange={(e) => setVariant(variant.rowId, { expiryDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer hover:bg-muted p-3 rounded-md border border-transparent hover:border-border transition-all">
                        <Checkbox
                          checked={variant.quickSelect}
                          onCheckedChange={(checked) => setVariant(variant.rowId, { quickSelect: Boolean(checked) })}
                        />
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Show in Quick Billing Panel</p>
                          <p className="text-xs text-muted-foreground">Fast access during billing</p>
                        </div>
                      </label>
                    </div>

                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>

        <div className="bg-background border-t p-4 shrink-0 flex items-center justify-between">
          <div className="text-sm text-muted-foreground hidden md:block">
            {draft.variants.length} variant{draft.variants.length !== 1 ? 's' : ''} configured
          </div>
          <Button
            onClick={submit}
            disabled={isPending || !draft.name.trim() || draft.variants.length === 0}
            className="h-12 px-8 text-base font-bold shadow-sm w-full md:w-auto"
          >
            {isPending ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
