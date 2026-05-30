import { Loader2 } from "lucide-react";

export default function HistoryLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-[var(--history-muted-text)]" />
      <p className="text-[var(--history-muted-text)]">Loading history data...</p>
    </div>
  );
}
