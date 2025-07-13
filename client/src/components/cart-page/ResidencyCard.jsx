import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/useCartStore";
import styles from "./ResidencyCard.module.scss";
import { useState } from "react";

const ResidencyCard = ({ residency }) => {
  const { user } = useAuthStore();
  const { cartItems, toggleCart } = useCartStore();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // "add" or "remove"

  const isInCart = cartItems.some((item) => item._id === residency._id);

  const handleToggleCart = async () => {
    if (!user) {
      toast.error("Please login to add residencies to cart", { id: "login" });
      return;
    }
    setButtonLoading(true);
    setActionType(isInCart ? "remove" : "add");
    try {
      await toggleCart(residency._id, { skipGlobalLoading: true });
    } finally {
      setButtonLoading(false);
      setActionType("");
    }
  };

  return (
    <div className={styles["residency-card"]}>
      <div className={styles["image-container"]}>
        <img src={residency.image} alt="Residency" />
        <div className={styles["overlay"]} />
      </div>

      <div className={styles["content"]}>
        <h5>{residency.name}</h5>
        <p className={styles["price"]}>${residency.price}</p>

        <button
          className={`${styles["add-to-cart"]} ${isInCart ? styles["in-cart"] : ""}`}
          onClick={handleToggleCart}
          disabled={buttonLoading}
        >
          {buttonLoading
            ? actionType === "add"
              ? "Adding to cart"
              : "Removing from cart"
            : isInCart
            ? "Remove from Cart"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ResidencyCard;
