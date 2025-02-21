import "./App.css";
import { useEffect, Suspense } from "react";
import Layout from "./components/pages/Layout";
import {
  Routes,
  Route,
  BrowserRouter,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home/Home";
import About from "./components/about/About";
import Pricing from "./components/pricing/Pricing";
import Contact from "./components/contact/Contact";
import Properties from "./components/properties/properties";
import ScrollToTop from "./components/scrollToTop/scrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "react-toastify/dist/ReactToastify.css";
import Property from "./components/Property/Property";
import Favourites from "./components/Favourites/Favourites";
import Search from "./components/search/Search";
import LayoutAuth from "./components/auth/layout";
import Signup from "./components/auth/signup/Signup";
import Signin from "./components/auth/signin/signin";
import Verified from "./components/auth/verified/Verified";
import ForgotPassword from "./components/auth/forgot-password/ForgotPassword";
import NewPassword from "./components/auth/new-password/NewPassword";
import PasswordSuccess from "./components/auth/password-reset-successful/password-reset-successful";
import OTPVerification from "./components/auth/otp-verification/otp-verification";
import { useAuthStore } from "./store/authStore";
import { MantineProvider } from "@mantine/core";
import { PuffLoader } from "react-spinners";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CartPage from "./components/cart-page/CartPage";
import PurchaseSuccessPage from "./components/purchase-success-page/PurchaseSuccessPage";
import PurchaseCancelPage from "./components/purchase-cancel-page/PurchaseCancelPage";
import AdminPage from "./components/admin-page/AdminPage";
import { useCartStore } from "./store/useCartStore";
import LayoutAdmin from "./components/admin-page/LayoutAdmin";
import LayoutPurchaseStatus from "./components/cart-page/LayoutPurchaseStatus";
import ProfilePage from "./components/profile-page/ProfilePage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  if (isCheckingAuth)
    return (
      <div className="wrapper flexCenter" style={{ minHeight: "100vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (isAuthenticated && !user?.isVerified)
    return <Navigate to="/otp-verification" replace />;

  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  if (isCheckingAuth)
    return (
      <div className="wrapper flexCenter" style={{ minHeight: "100vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (isAuthenticated && !user?.isVerified)
    return <Navigate to="/otp-verification" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  if (isCheckingAuth)
    return (
      <div className="wrapper flexCenter" style={{ minHeight: "100vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );

  if (isAuthenticated && user?.isVerified)
    return <Navigate to="/home" replace />;
  return children;
};

const App = () => {
  const queryClient = new QueryClient();
  const { checkAuth } = useAuthStore();
  const { fetchCart, cartItems } = useCartStore();
  const location = useLocation(); // Track route changes
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch cart on initial load and route changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart, location.pathname]); // Re-fetch when pathname changes

  // Log cart items for debugging
  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems]);

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="wrapper flexCenter" style={{ minHeight: "100vh" }}>
              <PuffLoader color="#27ae60" aria-label="puff-loading" />
            </div>
          }
        >
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/profile-page"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/properties">
                <Route index element={<Properties />} />
                <Route path=":propertyId" element={<Property />} />
              </Route>
              <Route
                path="/favourites"
                element={
                  <ProtectedRoute>
                    <Favourites />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route element={<LayoutPurchaseStatus />}>
              <Route
                path="/purchase-success"
                element={
                  <ProtectedRoute>
                    <PurchaseSuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/purchase-cancel"
                element={
                  <ProtectedRoute>
                    <PurchaseCancelPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route element={<LayoutAdmin />}>
              <Route
                path="/admin-dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminPage />
                  </AdminProtectedRoute>
                }
              />
            </Route>
            <Route element={<LayoutAuth />}>
              <Route
                path="/signup"
                element={
                  <RedirectAuthenticatedUser>
                    <Signup />
                  </RedirectAuthenticatedUser>
                }
              />
              <Route
                path="/signin"
                element={
                  <RedirectAuthenticatedUser>
                    <Signin />
                  </RedirectAuthenticatedUser>
                }
              />
              <Route path="/verified" element={<Verified />} />
              <Route
                path="/forgot-password"
                element={
                  <RedirectAuthenticatedUser>
                    <ForgotPassword />
                  </RedirectAuthenticatedUser>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <RedirectAuthenticatedUser>
                    <NewPassword />
                  </RedirectAuthenticatedUser>
                }
              />
              <Route
                path="/password-reset-successful"
                element={<PasswordSuccess />}
              />
              <Route path="/otp-verification" element={<OTPVerification />} />
            </Route>
          </Routes>
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MantineProvider>
  );
};

// Wrap App with BrowserRouter and GoogleOAuthProvider
const AppWithRouter = () => (
  <GoogleOAuthProvider clientId="your-google-client-id">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);

export default AppWithRouter;