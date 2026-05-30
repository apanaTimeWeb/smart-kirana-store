"use client";

import "./suppliers.css";
import { SuppliersProvider } from "./suppliers_components/SuppliersContext";
import { SuppliersMainLayout } from "./suppliers_components/SuppliersMainLayout";

export default function Suppliers() {
  return (
    <SuppliersProvider>
      <SuppliersMainLayout />
    </SuppliersProvider>
  );
}
