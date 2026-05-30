
import "./stock.css";
import { StockProvider } from "./stock_components/Contexts/StockContext";
import { StockMainLayout } from "./stock_components/Layout/StockMainLayout";


export default function Products() {
  return (
    <StockProvider>
      <StockMainLayout />
    </StockProvider>
  );
}
