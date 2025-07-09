import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "../page/Login";
import Dashboard from "../page/Dashboard";
import Orders from "../page/Orders";
import MenuItems from "../page/MenuItems";
import Categories from "../page/Categories";
import Register from "../page/Register";
import SalesReport from "../page/SalesReport";
// import Invoice from '../page/Invoice';
import OrderHistory from "../page/OrderHistory";
import InvoicePage from "../page/InvoicePage";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Listen for token changes (optional: better with context or events)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
<BrowserRouter>
  <Routes>
    {!isAuthenticated ? (
      <>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </>
    ) : (
      <>
        {/* ✅ Redirect root to /dashboard when logged in */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route
          path="/dashboard"
          element={<Dashboard setIsAuthenticated={setIsAuthenticated} />}
        >
          <Route path="orders" element={<Orders />} />
          <Route path="orders_history" element={<OrderHistory />} />
          <Route path="menu-items" element={<MenuItems />} />
          <Route path="categories" element={<Categories />} />
          <Route path="invoice/:orderId" element={<InvoicePage />} />
          <Route path="sales_report" element={<SalesReport />} />
          <Route path="*" element={<Navigate to="/dashboard/orders" />} />
        </Route>
      </>
    )}
  </Routes>
</BrowserRouter>

  );
};

export default AppRoutes;
