import { Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import CartItem from "./CartItem";
import PeopleAlsoBought from "./PeopleAlsoBought";
import OrderSummary from "./OrderSummary";
import GiftCouponCard from "./GiftCouponCard";
import { useEffect } from "react";
import styles from "./CartPage.module.scss";
import { PuffLoader } from "react-spinners";
import { notifications } from "@mantine/notifications";
import { useEffectOnce } from "react-use";
import NotificationBar from "./NotificationBar";

const CartPage = () => {
  const { cartItems = [], fetchCart, total, loading } = useCartStore();

  // // Fetch cart items on mount
  // useEffect(() => {
  //   fetchCart();
  // }, [fetchCart]);

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

  // Show loading spinner while fetching cart
  if (loading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  return (
    <div className={styles["cart-page"]}>
      <NotificationBar />
      <div className={styles.container}>
        <h1>Your Cart</h1>
        <div className={styles["cart-layout"]}>
          {cartItems.length === 0 ? (
            <EmptyCartUI />
          ) : (
            <motion.div
              className={styles["cart-items"]}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </motion.div>
          )}

          {cartItems.length > 0 && (
            <motion.div
              className={styles["order-section"]}
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
    className={styles["empty-cart"]}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart size={96} color="#6b7280" />
    <h3>Your cart is empty</h3>
    <p>Looks like you haven't added anything to your cart yet.</p>
    <Link to="/properties" className={styles["shop-button"]}>
      Start Shopping
    </Link>
  </motion.div>
);