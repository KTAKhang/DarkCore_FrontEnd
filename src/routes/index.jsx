import LoginPage from "../pages/LoginPage";
import ForgotPassword from "../pages/ForgotPassword";
import NotFoundPage from "../pages/NotFoundPage";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import AdminLayout from "../layout/AdminLayout";
import AdminPage from "../pages/AdminPage";
import CategoryManagement from "../pages/Categorymanagement/CategoryManagement";
import ProductManagement from "../pages/Productmanagement/ProductManagement";
import StaffManagement from "../pages/Staffmanagement/StaffManagement";
import RepairLandingPage from "../pages/Repair/RepairLandingPage";
import RepairRequestPage from "../pages/Repair/RepairRequestPage";
import RepairHistoryPage from "../pages/Repair/RepairHistoryPage";
import RepairAdminHub from "../pages/Repair/Admin/RepairAdminHub";
import RepairAdminRequests from "../pages/Repair/Admin/RepairAdminRequests";
import RepairAdminServices from "../pages/Repair/Admin/RepairAdminServices";
import RepairAdminRequestDetail from "../pages/Repair/Admin/RepairAdminRequestDetail";

// Repair Staff imports
import RepairStaffLayout from "../layout/RepairStaffLayout";
import RepairStaffDashboard from "../pages/Repair/Staff/RepairStaffDashboard";
import RepairStaffJobs from "../pages/Repair/Staff/RepairStaffJobs";
import RepairStaffJobDetail from "../pages/Repair/Staff/RepairStaffJobDetail";
import RepairStaffServices from "../pages/Repair/Staff/RepairStaffServices";

// Removed standalone staff pages; create/detail handled via modals in StaffManagement


import ShowAllProduct from "../pages/CustomerVIew/ShowAllProduct";
import ProductDetail from "../pages/CustomerVIew/ProductDetail";

import WishlistPage from "../pages/CustomerVIew/WishlistPage";

import ProfileManagement from "../pages/ProfileManagement/ProfileManagerment";
import UpdatePassword from "../pages/ProfileManagement/UpdatePassword";
import PrivateRoute from "../components/PrivateRouter";



export const routes = [
  // Trang chủ
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/repair",
    element: <RepairLandingPage />,
  },
  {
    path: "/repair/history",
    element: (
      <PrivateRoute>
        <RepairHistoryPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/repair/create",
    element: (
      <PrivateRoute requiredRole="customer">
        <RepairRequestPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },

  // Trang sản phẩm khách hàng
  {
    path: "/products",
    element: <ShowAllProduct />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
  {
    path: "/wishlist",
    element: <WishlistPage />,
  },

  // Khu vực quản trị
  {
    path: "/admin",
    element: (
      <PrivateRoute requiredRole="admin">
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <AdminPage /> },
      { path: "repair", element: <RepairAdminHub /> },
      { path: "repair/requests", element: <RepairAdminRequests /> },
      { path: "repair/requests/:id", element: <RepairAdminRequestDetail /> },
      { path: "repair/services", element: <RepairAdminServices /> },
      { path: "category", element: <CategoryManagement /> },
      { path: "product", element: <ProductManagement /> },
      { path: "staff", element: <StaffManagement /> },

     
      { path: "profile", element: <ProfileManagement /> },
      { path: "change-password", element: <UpdatePassword /> },

    ],
  },

  // Khu vực Repair Staff
  {
    path: "/staff",
    element: (
      <PrivateRoute requiredRole="repair-staff">
        <RepairStaffLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <RepairStaffDashboard /> },
      { path: "jobs", element: <RepairStaffJobs /> },
      { path: "jobs/:id", element: <RepairStaffJobDetail /> },
      { path: "services", element: <RepairStaffServices /> },
    ],
  },

  // Trang quên mật khẩu
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  // Trang 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
];