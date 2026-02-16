import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { Modal, Button, Text } from "@mantine/core";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/useCartStore";
import styles from "./ResidencyCard.module.scss";
import { useState } from "react";

const ResidencyCard = ({ residency }) => {
  const { user } = useAuthStore();
  const { cartItems, toggleCart } = useCartStore();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // "add" or "remove"
  const [opened, setOpened] = useState(false);

  const isInCart = cartItems.some((item) => item._id === residency._id);

  const handleToggleCart = async () => {
    if (!user) {
      toast.error("Please login to add residencies to cart", { id: "login" });
      return;
    }

    if (isInCart) {
      setOpened(true);
      return;
    }

    confirmToggle("add");
  };

  const confirmToggle = async (type) => {
    setButtonLoading(true);
    setActionType(type);
    try {
      await toggleCart(residency._id, { skipGlobalLoading: true });
      setOpened(false);
    } finally {
      setButtonLoading(false);
      setActionType("");
    }
  };

  return (
    <>
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

      <Modal
        opened={opened}
        onClose={() => !buttonLoading && setOpened(false)}
        title="Confirm Remove"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        closeOnClickOutside={!buttonLoading}
        closeOnEscape={!buttonLoading}
        withCloseButton={!buttonLoading}
      >
        <Text size="sm" mb="lg">Are you sure you want to remove this property from your cart?</Text>
        <div className={styles.modalActions}>
          <Button
            variant="outline"
            onClick={() => setOpened(false)}
            disabled={buttonLoading}
            className={`${styles.cancelButton} ${buttonLoading ? styles["cancel-btn-no-hover"] : ""}`}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => confirmToggle("remove")}
            disabled={buttonLoading}
            className={`${styles.confirmButton} ${buttonLoading ? styles["remove-btn-no-hover"] : ""}`}
          >
            {buttonLoading ? "Removing..." : "Remove"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ResidencyCard;
