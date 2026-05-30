
import "./stock.css";
import { StockProvider } from "./stock_context/StockContext";
import { StockMainLayout } from "./stock_components/Layout/StockMainLayout";


export default function Products() {
  return (
    <StockProvider>
      <StockMainLayout />
    </StockProvider>
  );
}
