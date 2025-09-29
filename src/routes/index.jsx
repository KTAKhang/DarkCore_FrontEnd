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
import CreateStaff from "../pages/Staffmanagement/CreateStaff";
import StaffDetail from "../pages/Staffmanagement/StaffDetail";
import ShowAllProduct from "../pages/CustomerVIew/ShowAllProduct";
import ProductDetail from "../pages/CustomerVIew/ProductDetail";

import WishlistPage from "../pages/CustomerVIew/WishlistPage";

import ProfileManagement from "../pages/ProfileManagement/ProfileManagerment";
import UpdatePassword from "../pages/ProfileManagement/UpdatePassword";
import PrivateRoute from "../components/PrivateRouter";
import CustomerLayout from "../layout/CustomerLayout";


export const routes = [
  // Trang chủ
  {
    path: "/",
    element: <HomePage />,
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
    path: "/customer",
    element: (
      <PrivateRoute requiredRole="customer">
        <CustomerLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "profile", element: <ProfileManagement /> },
      { path: "change-password", element: <UpdatePassword /> },
    ],
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
      { path: "category", element: <CategoryManagement /> },
      { path: "product", element: <ProductManagement /> },
      { path: "staff", element: <StaffManagement /> },
      { path: "staff/create", element: <CreateStaff /> },
      { path: "staff/:id", element: <StaffDetail /> },
      { path: "profile", element: <ProfileManagement /> },
      { path: "change-password", element: <UpdatePassword /> },
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