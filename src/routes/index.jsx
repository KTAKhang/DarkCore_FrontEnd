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

  // Khu vực quản trị
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminPage /> },
      { path: "category", element: <CategoryManagement /> },
      { path: "product", element: <ProductManagement /> },
      { path: "staff", element: <StaffManagement /> },
      { path: "staff/create", element: <CreateStaff /> },
      { path: "staff/:id", element: <StaffDetail /> },
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