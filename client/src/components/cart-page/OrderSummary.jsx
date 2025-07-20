import { motion } from "framer-motion";
import { useCartStore } from "../../store/useCartStore";
import { usePaymentStore } from "../../store/usePaymentStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import styles from "./OrderSummary.module.scss";
import { useState } from "react";

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cartItems } = useCartStore();
  const { handlePayment } = usePaymentStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await handlePayment(cartItems, coupon);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <motion.div
      className={styles["order-summary"]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className={styles["title"]}>Order Summary</p>

      <div className={styles["summary-details"]}>
        <div className={styles["row"]}>
          <span>Original Price</span>
          <span className={styles["value"]}>${formattedSubtotal}</span>
        </div>

        {savings > 0 && (
          <div className={styles["row"]}>
            <span>Savings</span>
            <span className={`${styles["value"]} ${styles["savings"]}`}>-${formattedSavings}</span>
          </div>
        )}

        {coupon && isCouponApplied && (
          <div className={styles["row"]}>
            <span>Coupon ({coupon.code})</span>
            <span className={`${styles["value"]} ${styles["coupon"]}`}>
              -{coupon.discountPercentage}%
            </span>
          </div>
        )}

        <div className={`${styles["row"]} ${styles["total"]}`}>
          <span>Total</span>
          <span className={styles["value"]}>${formattedTotal}</span>
        </div>
      </div>

      <motion.button
        className={styles["checkout-btn"]}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCheckout}
        disabled={isCheckingOut}
      >
        {isCheckingOut ? "Checking out" : "Proceed to Checkout"}
      </motion.button>

      <div className={styles["or-text"]}>or</div>

      <Link to="/properties" className={styles["continue-shopping"]}>
        Continue Shopping
        <MoveRight size={16} />
      </Link>
    </motion.div>
  );
};

export default OrderSummary;
