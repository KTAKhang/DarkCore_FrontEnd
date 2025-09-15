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

export const routes = [
  // Trang login (HomePage)
  {
    path: "/",
    element: <HomePage />, // login page
  },
  {
    path: "/login",
    element: <LoginPage />, // login page
  },
  {
    path: "/cart",
    element: <CartPage />, // login page
  },

  // Khu vực quản trị
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminPage /> },
      { path: "category", element: <CategoryManagement /> },
      { path: "product", element: <ProductManagement /> },
    ],
    // element: (
    //   <PrivateRoute requiredRole="ADMIN">
    //     <AdminLayout />
    //   </PrivateRoute>
    // ),
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
