import { Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, AlertCircle, RefreshCw } from "lucide-react";
import CartItem from "./CartItem";
import PeopleAlsoBought from "./PeopleAlsoBought";
import OrderSummary from "./OrderSummary";
import GiftCouponCard from "./GiftCouponCard";
import { useEffect, useRef, useState } from "react";
import { PuffLoader } from "react-spinners";
import { notifications } from "@mantine/notifications";
import { useEffectOnce } from "react-use";
import NotificationBar from "./NotificationBar";
import "../../styles/cart-page.css";

const CartPage = () => {
  const { cartItems = [], fetchCart, total, loading, isError, coupon, isCouponApplied } = useCartStore();
  const orderSectionRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("auto");

  // Show notification only once when total is less than 20000
  useEffectOnce(() => {
    if (total < 20000) {
      notifications.show({
        title: "Earn Gift Coupons 🎟️",
        message: "Get a coupon when you spend over $20,000 and another at $50,000!",
        color: "blue",
        autoClose: false,
      });
    }
  });

  // Dynamic height adjustment to match the order section
  useEffect(() => {
    if (orderSectionRef.current && cartItems.length > 0) {
      // Initial measurement
      const initialHeight = orderSectionRef.current.offsetHeight;
      if (initialHeight > 0) {
        setMaxHeight(`${initialHeight}px`);
      }

      // Set up observer for dynamic changes
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          if (height > 0) {
            setMaxHeight(`${height}px`);
          }
        }
      });

      resizeObserver.observe(orderSectionRef.current);
      return () => resizeObserver.disconnect();
    } else if (cartItems.length === 0) {
      setMaxHeight("auto");
    }
  }, [cartItems.length, coupon, isCouponApplied]); // Added coupon dependencies

  // Show loading spinner while fetching cart
  if (loading) {
    return (
      <div className="wrapper flex-center" style={{ height: "85vh" }}>
        <PuffLoader color="#27ae60" size={80} aria-label="puff-loading" />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="cart-page">
        <NotificationBar />
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Cart
          </motion.h1>
          <ErrorCartUI />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <NotificationBar />
      <div className="container">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Cart
        </motion.h1>
        <div className="cart-layout">
          {cartItems.length === 0 ? (
            <EmptyCartUI />
          ) : (
            <motion.div
              className="cart-items"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ maxHeight }} // Dynamically applied height
            >
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {cartItems.length > 0 && (
            <motion.div
              ref={orderSectionRef}
              className="order-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <OrderSummary />
              <GiftCouponCard />
            </motion.div>
          )}
        </div>
        {cartItems.length > 0 && <PeopleAlsoBought />}
      </div>
    </div>
  );
};

export default CartPage;

const EmptyCartUI = () => (
  <motion.div
    className="empty-cart"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart size={96} color="#6b7280" />
    <h3>Your cart is empty</h3>
    <p>Looks like you haven't added anything to your cart yet.</p>
    <Link to="/properties" className="shop-button">
      Start Shopping
    </Link>
  </motion.div>
);

const ErrorCartUI = () => (
  <motion.div
    className="empty-cart" // Using same class for consistent styling
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <AlertCircle size={96} color="#ef4444" />
    <h3>Unable to Load Cart</h3>
    <p>We couldn't load your cart items. Please check your connection and try again.</p>
    <button
      onClick={() => window.location.reload()}
      className="shop-button" // Using same button class
      style={{ border: 'none', cursor: 'pointer' }}
    >
      <div className="shop-button-svg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RefreshCw size={20} />
        Retry
      </div>
    </button>
  </motion.div>
);