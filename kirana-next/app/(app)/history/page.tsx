import { HistoryBillListContainer } from "./history_components/HistoryBillListContainer";
import { HistoryProvider } from "./history_components/HistoryContext";
import "./history.css";


export const metadata = {
  title: "Bill History - Smart Kirana Store",
};

export default function HistoryPage() {
  return (
    <HistoryProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bill History & Returns</h1>
          <p className="text-[var(--history-muted-text)] text-sm">Purane bills dekhein aur items return karein.</p>
        </div>
        
        <div>
          <HistoryBillListContainer />
        </div>
      </div>
    </HistoryProvider>
  );
}
