import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import styles from "./GiftCouponCard.module.scss";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const { coupon, availableCoupons, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = async () => {
    if (!userInputCode) return;
    setIsApplying(true);
    try {
      await applyCoupon(userInputCode);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  return (
    <motion.div
      className={styles["gift-card"]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={styles["input-container"]}>
        <label htmlFor="voucher">Do you have a voucher or gift card?</label>
        <input
          type="text"
          id="voucher"
          placeholder="Enter code here"
          value={userInputCode}
          onChange={(e) => setUserInputCode(e.target.value)}
          required
        />
      </div>

      <motion.button
        type="button"
        className={styles["button"]}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleApplyCoupon}
        disabled={isApplying}
      >
        {isApplying ? "Applying coupon" : "Apply Code"}
      </motion.button>

      {isCouponApplied && coupon && (
        <div className={styles["applied-coupon"]}>
          <h3>Applied Coupon</h3>
          <p>
            {coupon.code} - {coupon.discountPercentage}% off
          </p>

          <motion.button
            type="button"
            className={styles["remove-button"]}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}

      {availableCoupons.length > 0 && (
        <div className={styles["available-coupons"]}>
          <h3>Your Available Coupons:</h3>
          {availableCoupons.map((c) => (
            <p key={c.code}>
              {c.code} - {c.discountPercentage}% off
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
