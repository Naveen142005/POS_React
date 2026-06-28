import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/pages/auth/components/AuthLayout";
import Login from "./components/pages/auth/Login";
import { Register } from "./components/pages/auth/Register";
import Billing from "./components/pages/billing/Billing";
import Dashboard from "./components/pages/dashboard/Dashboard";
import Inventory from "./components/pages/Inventory/Inventory";
import InventoryForm from "./components/pages/InventoryForm/InventoryForm";
import { ItemRequest } from "./components/pages/ItemRequest/ItemRequest";
import ItemRequestForm from "./components/pages/ItemRequestForm/ItemRequestForm";
import SalesReport from "./components/pages/SalesReport/SalesReport";
import SidebarNavigation from "./components/common/SidebarNavigation/SidebarNavigation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route element={<SidebarNavigation />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/add" element={<InventoryForm mode="add" />} />
        <Route
          path="/inventory/edit/:itemCode"
          element={<InventoryForm mode="edit" />}
        />
        <Route path="/item_request" element={<ItemRequest />} />
        <Route path="/sales_reports" element={<SalesReport />} />
        <Route
          path="/item_request_add"
          element={<ItemRequestForm mode="add" />}
        />
        <Route
          path="/item_request_edit/:id"
          element={<ItemRequestForm mode="edit" />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
