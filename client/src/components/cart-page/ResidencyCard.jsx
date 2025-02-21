import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/useCartStore";
import styles from "./ResidencyCard.module.scss";

const ResidencyCard = ({ residency }) => {
  const { user } = useAuthStore();
  const { cartItems, toggleCart } = useCartStore();

  const isInCart = cartItems.some((item) => item._id === residency._id);

  const handleToggleCart = () => {
    if (!user) {
      toast.error("Please login to add residencies to cart", { id: "login" });
      return;
    }
    toggleCart(residency._id);
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
        >
          <ShoppingCart size={22} />
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ResidencyCard;
