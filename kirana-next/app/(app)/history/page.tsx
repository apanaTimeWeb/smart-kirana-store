import { BillHistoryList } from "./history_components/BillHistoryList";
import "./history.css";
export const metadata = {
  title: "Bill History - Smart Kirana Store",
};

export default function HistoryPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Bill History & Returns</h1>
        <p className="text-muted-foreground text-sm">Purane bills dekhein aur items return karein.</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <BillHistoryList />
      </div>
    </div>
  );
}
