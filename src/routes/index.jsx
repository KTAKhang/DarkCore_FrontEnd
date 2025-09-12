import LoginPage from "../pages/HomePage";
import ForgotPassword from "../pages/ForgotPassword";
import NotFoundPage from "../pages/NotFoundPage";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import CategoryManagement from "../pages/Categorymanagement/CategoryManagement";
import ProductManagement from "../pages/Productmanagement/ProductManagement";


export const routes = [
  // Trang login (HomePage)
  {
    path: "/",
    element: <LoginPage />, // login page
  },

  // Trang quên mật khẩu
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // Trang admin (tạm thời để test giao diện)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "category",
        element: <CategoryManagement />,
      },
      {
        path: "product",
        element: <ProductManagement />,
      },
    ],
  },

  // Trang 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
