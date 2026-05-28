import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LowStockListProps {
  isLoading: boolean;
  products: { id: number; name: string; category: string; currentStock: number; stockInBaseUnit: number; unit: string }[];
}

export function LowStockList({ isLoading, products }: LowStockListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Low Stock Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-5">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-10 w-full" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="divide-y">
            {products.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/20"
                data-testid={`row-lowstock-${product.id}`}
              >
                <div>
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <Badge
                  className={cn(
                    "text-[10px] font-medium",
                    product.currentStock === 0 || product.stockInBaseUnit <= 0
                      ? "bg-[var(--reports-badge-out-bg)] text-[var(--reports-badge-out-text)] border-[var(--reports-badge-out-border)]"
                      : "bg-[var(--reports-badge-low-bg)] text-[var(--reports-badge-low-text)] border-[var(--reports-badge-low-border)]"
                  )}
                >
                  {product.currentStock === 0 || product.stockInBaseUnit <= 0
                    ? "Out of Stock"
                    : `${product.currentStock} ${product.unit} left`}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <AlertTriangle className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">Sab stock sahi level par hai.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
