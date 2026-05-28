import { BillHistoryList } from "./history_components/BillHistoryList";
import "./history.css";
export const metadata = {
  title: "Bill History - Smart Kirana Store",
};

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bill History & Returns</h1>
        <p className="text-muted-foreground text-sm">Purane bills dekhein aur items return karein.</p>
      </div>
      
      <div>
        <BillHistoryList />
      </div>
    </div>
  );
}
