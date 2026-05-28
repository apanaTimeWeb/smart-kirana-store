import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageOpen } from "lucide-react";

type LowStockProduct = {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  lowStockThreshold: number;
  unit: string;
};

interface LowStockListProps {
  products: LowStockProduct[];
}

export function LowStockList({ products }: LowStockListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <PackageOpen className="h-4 w-4" />
          कम स्टॉक वाले सामान
          <span className="text-sm font-normal text-muted-foreground ml-1">(Low Stock)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {products.length > 0 ? (
          <div className="divide-y">
            {products.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
                data-testid={`row-lowstock-${product.id}`}
              >
                <div>
                  <p className="font-semibold text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-sm ${
                      product.currentStock === 0
                        ? "text-[var(--dashboard-lowstock-value)]"
                        : "text-[var(--dashboard-khata-value)]"
                    }`}
                  >
                    {product.currentStock === 0
                      ? "Out of Stock"
                      : `${product.currentStock} ${product.unit} left`}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Min: {product.lowStockThreshold}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <PackageOpen className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm">Sab stock sahi hai</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
