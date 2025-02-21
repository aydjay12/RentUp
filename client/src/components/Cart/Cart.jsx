import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = ({ id }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { toggleCart, cartItems, fetchCart } = useCartStore(); // ✅ Include fetchCart
  const [cartColor, setCartColor] = useState("black");
  const navigate = useNavigate();

  // ✅ Update cart icon color when cartItems change
  useEffect(() => {
    if (user && cartItems?.some((item) => item.residency?._id === id || item._id === id)) {
      setCartColor("green");
    } else {
      setCartColor("black");
    }
  }, [user, id, cartItems]);

  const handleCartToggle = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("You must be logged in to add items to the cart", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (!user?.isVerified) {
      toast.error("You must be verified to add items to the cart", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return navigate("/otp-verification");
    }

    try {
      await toggleCart(id);
    } catch (error) {
      toast.error("Failed to update cart", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div
      className="cart-icon"
      whileTap={{ scale: 0.8 }}
      onClick={handleCartToggle}
    >
      <FaShoppingCart size={18} color={cartColor} cursor="pointer" />
    </motion.div>
  );
};

export default Cart;
