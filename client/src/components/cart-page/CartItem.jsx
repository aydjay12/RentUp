import { useState } from "react";
import { Modal, Button, Text } from "@mantine/core";
import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import styles from "./CartItem.module.scss";

const CartItem = ({ item }) => {
  const { removeFromCart } = useCartStore();
  const [opened, setOpened] = useState(false); // State for the modal

  const handleDelete = () => {
    removeFromCart(item._id);
    setOpened(false); // Close modal after deletion
  };

  return (
    <>
      <div className={styles["cart-item"]}>
        <img
          className={styles["cart-image"]}
          src={item.image}
          alt={item.name}
        />

        <div className={styles["cart-info"]}>
          <p className={styles["cart-title"]}>{item.name}</p>
          <p className={styles["cart-description"]}>{item.description}</p>
        </div>

        {/* <div className={styles["cart-quantity"]}>
        <button
          className={styles["quantity-btn"]}
          onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
        >
          <Minus size={16} />
        </button>
        <p className={styles["quantity-text"]}>{item.quantity || 1}</p>
        <button
          className={styles["quantity-btn"]}
          onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
        >
          <Plus size={16} />
        </button>
      </div> */}

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
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Confirm Delete"
        centered
        className={styles.modalPopup}
      >
        <Text size="sm">Are you sure you want to delete this item?</Text>
        <div className={styles.modalActions}>
          <Button
            color="red"
            onClick={handleDelete}
            className={styles.confirmButton}
          >
            Yes, Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpened(false)}
            className={styles.cancelButton}
          >
            No, Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CartItem;
