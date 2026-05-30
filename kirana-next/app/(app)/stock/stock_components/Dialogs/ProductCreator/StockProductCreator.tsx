"use client";

// StockProductCreator.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Refactored Simple Mobile-First "Naya Product Add" Dialog
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Zap, Package, Scale, Factory, Barcode, CalendarDays, MapPin } from "lucide-react";
import { StockProductCreatorProvider, useStockProductCreator } from "../../../stock_context/StockProductCreatorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function StockProductCreatorInner() {
  const { 
    isAddOpen, handleOpenChange, isCreating,
    name, setName,
    barcode, setBarcode,
    unitType, handleUnitChange,
    bulkConversionRate, setBulkConversionRate,
    buyPrice, setBuyPrice,
    sellPrice, setSellPrice,
    initialStock, setInitialStock,
    expiryDate, setExpiryDate,
    location, setLocation,
    errors, isValid, handleSubmit 
  } = useStockProductCreator();

  return (
    <Dialog open={isAddOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl rounded-t-2xl rounded-b-none mt-auto sm:mt-0">
        
        {/* Header */}
        <DialogHeader className="bg-[var(--stock-card-bg)] px-5 py-4 border-b shrink-0 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Naya Product</DialogTitle>
              <p className="text-sm text-gray-500 mt-0.5">
                Fast 2-click product entry
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="p-5 space-y-6">
            
            {/* 1. Name & Barcode */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Product Ka Naam <span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="e.g. Maggi 70g, Aashirvaad Atta 5kg" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-lg shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Barcode className="h-4 w-4" /> Barcode (Optional)
                </Label>
                <div className="relative">
                  <Input 
                    placeholder="Scan karein ya type karein..." 
                    value={barcode} 
                    onChange={(e) => setBarcode(e.target.value)}
                    className="h-11 pl-10"
                  />
                  <Barcode className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 2. Unit Type (Tap Buttons) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Kaisa Bikta Hai? <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleUnitChange("PACKET")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${unitType === "PACKET" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-blue-200"}`}
                >
                  <Package className="h-6 w-6 mb-1.5" />
                  <span className="text-xs font-semibold">Packet/Piece</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitChange("KG")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${unitType === "KG" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 bg-white text-gray-600 hover:border-amber-200"}`}
                >
                  <Scale className="h-6 w-6 mb-1.5" />
                  <span className="text-xs font-semibold">Khula (KG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitChange("BORA")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${unitType === "BORA" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 bg-white text-gray-600 hover:border-purple-200"}`}
                >
                  <Factory className="h-6 w-6 mb-1.5" />
                  <span className="text-xs font-semibold">Bora/Bulk</span>
                </button>
              </div>
            </div>

            {/* Bulk Conversion Prompt */}
            {unitType === "BORA" && (
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-2">
                <Label className="text-sm font-bold text-purple-800">1 Bora/Box me kitna KG/Piece hai? <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  placeholder="e.g. 50" 
                  value={bulkConversionRate} 
                  onChange={(e) => setBulkConversionRate(e.target.value !== "" ? Number(e.target.value) : "")}
                  className="h-11 bg-white border-purple-200 focus-visible:ring-purple-500"
                />
                <p className="text-xs text-purple-600 font-medium">Bora kholne par stock exact grams me automatically update hoga.</p>
              </div>
            )}

            {/* 3. Rates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Kharid (Buy) ₹</Label>
                <Input 
                  type="number"
                  placeholder="0.00" 
                  value={buyPrice} 
                  onChange={(e) => setBuyPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Bikri (Sell) ₹ <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  placeholder="0.00" 
                  value={sellPrice} 
                  onChange={(e) => setSellPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                  className="h-11 border-blue-200 bg-blue-50/30"
                />
              </div>
            </div>

            <div className="h-px bg-gray-200 my-2" />

            {/* 4. Stock & Expiry */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Current Stock <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  placeholder="Qty" 
                  value={initialStock} 
                  onChange={(e) => setInitialStock(e.target.value !== "" ? Number(e.target.value) : "")}
                  className="h-11 font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Expiry Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input 
                    type="date"
                    value={expiryDate} 
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="h-11 pl-9 text-sm"
                  />
                  <CalendarDays className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* 5. Location */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> Kahan Rakha Hai? (Location)
              </Label>
              <Input 
                placeholder="e.g. Fridge ke paas, Rack 3..." 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="h-11"
              />
            </div>
            
            {/* Bottom padding for scroll */}
            <div className="h-4" />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-white border-t p-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-10 space-y-3">
          {!isValid && errors.length > 0 && (
            <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg font-medium border border-red-100 flex flex-col gap-1">
              {errors.map((err, i) => (
                <span key={i}>• {err}</span>
              ))}
            </div>
          )}
          
          <Button 
            className="w-full h-12 text-lg font-bold rounded-xl shadow-sm"
            disabled={!isValid || isCreating}
            onClick={handleSubmit}
          >
            {isCreating ? "Saving..." : "Save Product"}
          </Button>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}

// Exported component
export function StockProductCreator() {
  return (
    <StockProductCreatorProvider>
      <StockProductCreatorInner />
    </StockProductCreatorProvider>
  );
}
