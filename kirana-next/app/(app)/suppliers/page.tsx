"use client";

import "./suppliers.css";
import { SuppliersProvider } from "./context/SuppliersContext";
import { SuppliersMainLayout } from "./components/Layout/SuppliersMainLayout";

export default function Suppliers() {
  return (
    <SuppliersProvider>
      <SuppliersMainLayout />
    </SuppliersProvider>
  );
}
