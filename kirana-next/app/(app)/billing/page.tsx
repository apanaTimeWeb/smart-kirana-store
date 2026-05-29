"use client";

import "./billing.css";
import React from "react";
import { useBilling } from "./billing_components/use-billing";
import { ProductGrid } from "./billing_components/ProductGrid";
import { CartPanel } from "./billing_components/CartPanel";
import { MobileBillingView } from "./billing_components/MobileBillingView";
import { KhulaPicker } from "./billing_components/KhulaPicker";
import { WhatsAppDialog } from "./billing_components/WhatsAppDialog";
import { printThermalBill } from "./billing_components/whatsapp-utils";

export default function Billing() {
  const billing = useBilling();

  const productGrid = (
    <ProductGrid
      products={billing.filteredProducts}
      quickProducts={billing.quickProducts}
      isLoading={billing.isLoading}
      search={billing.search}
      setSearch={billing.setSearch}
      filter={billing.filter}
      setFilter={billing.setFilter}
      cartBaseQty={(id) =>
        billing.cart
          .filter((item) => item.productId === id)
          .reduce((sum, item) => sum + item.stockDeltaBaseUnit, 0)
      }
      onProductTap={billing.handleProductTap}
      onRemoveTap={billing.handleProductRemove}
    />
  );

  const cartPanel = (
    <CartPanel
      cart={billing.cart}
      customers={billing.customers}
      discount={billing.discount}
      setDiscount={billing.setDiscount}
      paymentMode={billing.paymentMode}
      setPaymentMode={billing.setPaymentMode}
      selectedCustomerId={billing.selectedCustomerId}
      setSelectedCustomerId={billing.setSelectedCustomerId}
      quickPhone={billing.quickPhone}
      setQuickPhone={billing.setQuickPhone}
      billSuccess={billing.billSuccess}
      enableGST={billing.enableGST}
      setEnableGST={billing.setEnableGST}
      gstRate={billing.gstRate}
      setGstRate={billing.setGstRate}
      subtotal={billing.subtotal}
      taxableValue={billing.taxableValue}
      gstAmount={billing.gstAmount}
      finalAmount={billing.finalAmount}
      cartCount={billing.cartCount}
      isCheckoutPending={billing.createBill.isPending}
      onUpdateQty={billing.updateQty}
      onRemove={billing.removeFromCart}
      onCheckout={billing.handleCheckout}
      onResetCart={billing.resetCart}
    />
  );

  return (
    <>
      {/* ── Desktop layout ─────────────────────────────────────────── */}
      <div className="hidden h-[calc(100dvh-2*1.5rem)] gap-5 md:flex">
        <div className="flex min-w-0 flex-1 flex-col">{productGrid}</div>
        <div className="w-96 shrink-0">{cartPanel}</div>
      </div>

      {/* ── Mobile layout ──────────────────────────────────────────── */}
      <MobileBillingView
        mobileTab={billing.mobileTab}
        setMobileTab={billing.setMobileTab}
        cartCount={billing.cartCount}
        finalAmount={billing.finalAmount}
        productGrid={productGrid}
        cartPanel={cartPanel}
      />

      {/* ── Dialogs ────────────────────────────────────────────────── */}
      <KhulaPicker
        product={billing.khulaProduct}
        open={Boolean(billing.khulaProduct)}
        onOpenChange={(open) => !open && billing.setKhulaProduct(null)}
        onAdd={billing.addKhula}
      />

      <WhatsAppDialog
        billData={billing.whatsappBillData}
        shopName={billing.shopName}
        shopAddress={billing.settings?.shopAddress}
        shopPhone={billing.settings?.shopPhone}
        onClose={() => {
          if (billing.whatsappBillData) {
            printThermalBill(
              billing.whatsappBillData,
              billing.shopName,
              billing.settings?.shopAddress,
              billing.settings?.shopPhone,
              billing.settings?.gstNumber,
              billing.settings?.gstEnabled
            );
          }
          billing.setWhatsappBillData(null);
        }}
      />
    </>
  );
}
