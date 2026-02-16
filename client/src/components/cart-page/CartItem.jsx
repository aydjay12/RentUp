import { useState } from "react";
import { Modal, Button, Text } from "@mantine/core";
import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { motion } from "framer-motion";
import styles from "./CartItem.module.scss";

const CartItem = ({ item }) => {
  const { removeFromCart } = useCartStore();
  const [opened, setOpened] = useState(false); // State for the modal
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeFromCart(item._id);
      setOpened(false); // Only close modal after deletion is successful
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, x: -100, transition: { duration: 0.3 } }}
      className={styles["cart-item"]}
    >
      <img
        className={styles["cart-image"]}
        src={item.image}
        alt={item.name}
      />

      <div className={styles["cart-info"]}>
        <p className={styles["cart-title"]}>{item.name}</p>
        <p className={styles["cart-description"]}>{item.description}</p>
      </div>

      <p className={styles["cart-price"]}>${item.price}</p>

      <div className={styles["cart-actions"]}>
        <button
          className={styles["remove-btn"]}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpened(true); // Open modal
          }}
        >
          <Trash size={20} />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={() => !isDeleting && setOpened(false)}
        title="Confirm Remove"
        centered
        className={styles.modalPopup}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        closeOnClickOutside={!isDeleting}
        closeOnEscape={!isDeleting}
        withCloseButton={!isDeleting}
      >
        <Text size="sm">Are you sure you want to remove this item from your cart?</Text>
        <div className={styles.modalActions}>
          <Button
            color="red"
            onClick={handleDelete}
            className={`${styles.confirmButton} ${isDeleting ? styles["remove-btn-no-hover"] : ""}`}
            disabled={isDeleting}
          >
            {isDeleting ? "Removing..." : "Remove"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpened(false)}
            className={styles.cancelButton}
            disabled={isDeleting}
          >
            No, Cancel
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default CartItem;
