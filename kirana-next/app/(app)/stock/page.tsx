
import "./stock.css";
import { StockProvider } from "./stock_components/StockContext";
import { StockMainLayout } from "./stock_components/StockMainLayout";


export default function Products() {
  return (
    <StockProvider>
      <StockMainLayout />
    </StockProvider>
  );
}
