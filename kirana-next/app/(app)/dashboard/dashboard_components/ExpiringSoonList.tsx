import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function ExpiringSoonList({
  products,
}: {
  products: { id: number; name: string; variantName: string; expiryDate: string; daysLeft: number }[];
}) {
  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader className="border-b bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dashboard-expiry-bg)] text-[var(--dashboard-expiry-icon)]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Expiring Soon</CardTitle>
            <p className="text-xs text-muted-foreground">अलेर्ट</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        {products.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Clock className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">No items expiring soon.</p>
          </div>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-sm leading-none">{product.name}</span>
                  <span className="text-xs text-muted-foreground">{product.variantName}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium bg-[var(--dashboard-expiry-bg)] text-[var(--dashboard-expiry-value)] px-2 py-0.5 rounded-md">
                    {product.daysLeft <= 0 ? "Expired" : `${product.daysLeft} days left`}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(product.expiryDate), "dd MMM yyyy")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
