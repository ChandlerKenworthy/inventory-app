import { BrowserRouter, Routes, Route } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import StatusPage from "./pages/StatusPage";
import SingleProductPage from "./pages/SingleProductPage";
import NewOrderPage from "./pages/NewOrderPage";
import CustomQueryPage from "./pages/CustomQueryPage";
import SingleCustomerPage from "./pages/SingleCustomerPage";
import SingleOrderPage from "./pages/SingleOrderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<SingleProductPage />} />
        <Route path="/customers/:id" element={<SingleCustomerPage />} />
        <Route path="/query" element={<CustomQueryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/new" element={<NewOrderPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/orders/:id" element={<SingleOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
