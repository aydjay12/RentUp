import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/authStore";
import useSnackbarStore from "../../store/useSnackbarStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Cart.css";

const Cart = ({ id }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { toggleCart, cartItems } = useCartStore();
  const [isInCart, setIsInCart] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    const inCart = user && cartItems?.some((item) => item.residency?._id === id || item._id === id);
    setIsInCart(inCart);
  }, [user, id, cartItems]);

  const handleCartToggle = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showSnackbar("You must be logged in to add items to the cart", "error");
      return;
    }
    if (!user?.isVerified) {
      showSnackbar("You must be verified to add items to the cart", "error");
      return navigate("/otp-verification");
    }

    setIsAnimating(true);
    try {
      await toggleCart(id);
      setTimeout(() => setIsAnimating(false), 1000); // Slightly longer for more clear animation
    } catch (error) {
      showSnackbar("Failed to update cart", "error");
      setIsAnimating(false);
    }
  };

  return (
    <motion.div
      className="cart-icon-container"
      onClick={handleCartToggle}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="cart-ripple"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="cart-icon-inner"
        animate={isAnimating ? {
          scale: [1, 1.3, 0.9, 1],
          rotate: [0, 15, -15, 0]
        } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaShoppingCart
          className={`cart-icon ${isInCart ? 'in-cart' : ''}`}
          size={18}
          color={isInCart ? "#27ae60" : "rgba(0,0,0,0.4)"}
        />

        <AnimatePresence>
          {isInCart && (
            <motion.div
              className="cart-check-overlay"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <span className="cart-tooltip">
        {isInCart ? "Remove from Cart" : "Add to Cart"}
      </span>
    </motion.div>
  );
};

export default Cart;