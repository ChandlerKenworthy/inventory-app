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
import Breadcrumbs from "./components/Breadcrumbs";
import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom";

const RootLayout = () => (
  <div className="app-layout">
    <nav className="top-nav">
      <Breadcrumbs />
    </nav>
    <main className="content">
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "inventory",
        element: <InventoryPage />,
        handle: { crumb: () => "Inventory" }
      },
      { 
        path: "customers", 
        handle: { crumb: () => <Link to="/customers">Customers</Link> },
        children: [
          { index: true, element: <CustomersPage /> },
          { path: ":id", element: <SingleCustomerPage />, handle: { crumb: () => "Customer Details" } }
        ]
      },
      { 
        path: "products", 
        handle: { crumb: () => <Link to="/products">Products</Link> },
        children: [
          { index: true, element: <ProductsPage /> },
          { path: ":id", element: <SingleProductPage />, handle: { crumb: () => "Product Details" } }
        ]
      },
      { 
        path: "orders", 
        handle: { crumb: () => <Link to="/orders">Orders</Link> },
        children: [
          { index: true, element: <OrdersPage /> },
          { path: "new", element: <NewOrderPage />, handle: { crumb: () => "New Order" } },
          { path: ":id", element: <SingleOrderPage />, handle: { crumb: () => "Order Details" } }
        ]
      },
      { path: "query", element: <CustomQueryPage />, handle: { crumb: () => "Query" } },
      { path: "status", element: <StatusPage />, handle: { crumb: () => "System Status" } },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
