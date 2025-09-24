import AllRoutes from "./components/AllRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <AllRoutes />
        <ToastContainer />
      </WishlistProvider>
    </AuthProvider>
  );
}
