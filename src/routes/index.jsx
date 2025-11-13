import LoginPage from "../pages/LoginPage";
import ForgotPassword from "../pages/ForgotPassword";
import NotFoundPage from "../pages/NotFoundPage";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import AdminLayout from "../layout/AdminLayout";
import AdminPage from "../pages/AdminPage";
import RepairPage from "../pages/RepairPage";
import CategoryManagement from "../pages/Categorymanagement/CategoryManagement";
import ProductManagement from "../pages/Productmanagement/ProductManagement";
import CustomerDetail from "../pages/CustomerManagement/CustomerDetail";
import CustomerManagement from "../pages/CustomerManagement/CustomerManagement";
import OrderManagement from "../pages/OrderManagement/OrderManagement";
import NewsManagement from "../pages/NewsManagement/NewsManagement";
import ContactManagement from "../pages/ContactManagement/ContactManagement";


//Repair customer client
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
import ShowAllProduct from "../pages/CustomerVIew/ShowAllProduct";
import ProductDetail from "../pages/CustomerVIew/ProductDetail";
import WishlistPage from "../pages/CustomerVIew/WishlistPage";
import OrderHistory from "../pages/CustomerVIew/OrderHistory";
import NewsPage from "../pages/CustomerVIew/NewsPage";
import ProfileManagement from "../pages/ProfileManagement/ProfileManagerment";
import UpdatePassword from "../pages/ProfileManagement/UpdatePassword";
import PrivateRoute from "../components/PrivateRouter";
import CustomerLayout from "../layout/CustomerLayout";
import ContactPage from "../pages/CustomerVIew/ContactPage";
import ContactHistory from "../pages/CustomerVIew/ContactHistory";
import DiscountListPage from "../pages/UserDiscount/DiscountListPage";
import AdminDiscountPage from "../pages/DiscountManagement/AdminDiscountPage";
import OrderReviewPage from "../pages/ProductReview/OrderReviewPage";
import ProductReviewManagement from "../pages/ProductReview/ProductReviewManagement";
import AdminProductReviewDetailPage from "../pages/ProductReview/AdminProductReviewDetailPage";
import AboutUsManagement from "../pages/AboutUsManagement/AboutUsManagerment";
import CreateAboutUs from "../pages/AboutUsManagement/CreateAboutUs";
import UpdateAboutUs from "../pages/AboutUsManagement/UpdateAboutUs";
import ShowAboutUs from "../pages/CustomerVIew/ShowAboutUs";
import FoundersManagement from "../pages/FoundersManagement/FoundersManagement";
import FinanceLayout from "../layout/FinanceLayout";
import StaffOrderManagement from "../pages/StaffOrderManagement/OrderManagement";
import StaffReviewManagement from "../pages/StaffReviewManagement/StaffReviewManagement";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentResultPage from "../pages/PaymentResultPage";
import StaffProductManagement from "../pages/StaffProduct/StaffProductManagement";

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
  // THÊM: Trang tin tức cho customer (public, chỉ published news)
  {
    path: "/news",
    element: <NewsPage />,
  },
  {
    path: "/about",
    element: <ShowAboutUs />,
  },
  // Route public cho payment result (VNPay callback)
  {
    path: "/payment-result",
    element: <PaymentResultPage />,
  },
  // THÊM: Trang mã giảm giá cho user (public)
  {
    path: "/discounts",
    element: <DiscountListPage />,
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
      { path: "repair", element: <RepairPage /> },
      { path: "profile", element: <ProfileManagement /> },
      { path: "change-password", element: <UpdatePassword /> },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "orders",
        element: <OrderHistory />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "payment-result",
        element: <PaymentResultPage />,
      },
      {
        path: "contact/history",
        element: <ContactHistory />,
      },
      { path: "review/:id", element: <OrderReviewPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },

  {
    path: "/sale-staff",
    element: (
      <PrivateRoute requiredRole="sales-staff">
        <FinanceLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "order", element: <StaffOrderManagement /> },


      { path: "product", element: <StaffProductManagement /> },


      { path: "change-password", element: <UpdatePassword /> },
      { path: "profile", element: <ProfileManagement /> },
      { path: "review", element: <StaffReviewManagement /> },


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
      { path: "repair", element: <RepairAdminHub /> },
      { path: "repair/requests", element: <RepairAdminRequests /> },
      { path: "repair/requests/:id", element: <RepairAdminRequestDetail /> },
      { path: "repair/services", element: <RepairAdminServices /> },
      { path: "category", element: <CategoryManagement /> },
      { path: "product", element: <ProductManagement /> },
      { path: "customer", element: <CustomerManagement /> },
      { path: "customer/:id", element: <CustomerDetail /> },
      { path: "order", element: <OrderManagement /> },
      { path: "profile", element: <ProfileManagement /> },
      { path: "review", element: <ProductReviewManagement /> },
      { path: "review/:id", element: <AdminProductReviewDetailPage /> },
      { path: "change-password", element: <UpdatePassword /> },
      { path: "news", element: <NewsManagement /> },
      { path: "contact", element: <ContactManagement /> },
      { path: "discounts", element: <AdminDiscountPage /> },
      { path: "about-us", element: <AboutUsManagement /> },
      { path: "about-us/create", element: <CreateAboutUs /> },
      { path: "about-us/update", element: <UpdateAboutUs /> },
      { path: "founders", element: <FoundersManagement /> },
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
      { path: "change-password", element: <UpdatePassword /> },
      { path: "profile", element: <ProfileManagement /> },
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