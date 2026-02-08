import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/authStore";
import useSnackbarStore from "../../store/useSnackbarStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Cart.css";

const Cart = ({ id }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { toggleCart, cartItems, fetchCart } = useCartStore();
  const [cartColor, setCartColor] = useState("black");
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    const inCart = user && cartItems?.some((item) => item.residency?._id === id || item._id === id);
    setIsInCart(inCart);
    setCartColor(inCart ? "green" : "black");
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

    try {
      await toggleCart(id);
    } catch (error) {
      showSnackbar("Failed to update cart", "error");
    }
  };

  const cartVariants = {
    initial: { scale: 1, rotate: 0 },
    clicked: {
      scale: [1, 1.2, 0.9, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="cart-icon-container"
      onClick={handleCartToggle}
      initial="initial"
      animate="initial"
      whileTap="clicked"
      variants={cartVariants}
    >
      <FaShoppingCart className="cart-icon" size={18} color={cartColor} cursor="pointer" />
      <span
        className="cart-tooltip"
        style={{ backgroundColor: cartColor }} // Dynamic background color
      >
        {isInCart ? "Remove from Cart" : "Add to Cart"}
      </span>
    </motion.div>
  );
};

export default Cart;