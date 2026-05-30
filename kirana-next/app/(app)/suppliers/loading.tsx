import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SuppliersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <Skeleton className="h-8 w-40 bg-[var(--supplier-muted-bg-50)]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-full sm:w-64 bg-[var(--supplier-muted-bg-50)]" />
          <Skeleton className="h-10 w-32 hidden sm:block bg-[var(--supplier-muted-bg-50)]" />
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--supplier-border)] bg-[var(--supplier-card-bg)] overflow-hidden">
        <div className="p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full bg-[var(--supplier-muted-bg-50)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
