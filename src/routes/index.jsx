import HomePage from "../pages/HomePage";
import ForgotPassword from "../pages/ForgotPassword";
import NotFoundPage from "../pages/NotFoundPage";


export const routes = [
  // Trang login (HomePage)
  {
    path: "/",
    element: <HomePage />, // login page
  },

  // Trang quên mật khẩu
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },


  // Trang 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
