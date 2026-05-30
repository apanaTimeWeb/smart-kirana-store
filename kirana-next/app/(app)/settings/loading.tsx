import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import "./settings.css";

export default function SettingsLoading() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <Skeleton className="h-10 w-48 mb-2 bg-[var(--settings-muted-bg)]" />
        <Skeleton className="h-5 w-72 bg-[var(--settings-muted-bg)]" />
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="bg-[var(--settings-card-bg)] border-[var(--settings-border)]">
          <CardHeader>
            <Skeleton className="h-7 w-48 bg-[var(--settings-muted-bg)]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full bg-[var(--settings-muted-bg)]" />
              <Skeleton className="h-10 w-full bg-[var(--settings-muted-bg)]" />
            </div>
            <Skeleton className="h-10 w-full bg-[var(--settings-muted-bg)]" />
          </CardContent>
        </Card>
      ))}

      <Skeleton className="h-12 w-full mt-8 bg-[var(--settings-muted-bg)]" />
    </div>
  );
}
