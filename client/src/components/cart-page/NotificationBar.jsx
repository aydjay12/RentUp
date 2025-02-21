import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X } from "lucide-react";
import styles from "./NotificationBar.module.scss";

const NotificationBar = () => {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.notificationBar}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className={styles.content}>
            <Gift className={styles.icon} />
            <p>
              Get a coupon for purchases over <strong>$20,000</strong> and another at{" "}
              <strong>$50,000</strong>!
            </p>
          </div>
          <button className={styles.closeButton} onClick={() => setVisible(false)}>
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBar;
