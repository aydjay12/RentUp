import { ArrowRight, CheckCircle, HandHeart, OctagonX } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import styles from "./PurchaseSuccessPage.module.scss";
import { usePaymentStore } from "../../store/usePaymentStore";
import { useCartStore } from "../../store/useCartStore"; // ✅ Import useCartStore
import { PuffLoader } from "react-spinners";
import { useAuthStore } from "../../store/authStore";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const { handleCheckoutSuccess } = usePaymentStore();
  const { clearCart, cartItems } = useCartStore(); // ✅ Get clearCart function
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    const authToken = new URLSearchParams(window.location.search).get(
      "auth_token"
    );

    async function restoreAndProceed() {
      if (!isAuthenticated && authToken) {
        try {
          await fetch("/api/auth/restore-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ auth_token: authToken }),
          });
          await checkAuth();
        } catch (e) {
          setError("Could not restore session after payment. Please sign in again.");
          setIsProcessing(false);
          return;
        }
      }
      if (sessionId) {
        handleCheckoutSuccess(sessionId)
          .then(() => clearCart())
          .catch((err) => setError(err.message))
          .finally(() => setIsProcessing(false));
      } else {
        setError("No session ID found in the URL");
        setIsProcessing(false);
      }
    }
    restoreAndProceed();
  }, [handleCheckoutSuccess, clearCart, isAuthenticated, checkAuth]);

  if (isProcessing) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <OctagonX className={styles.icon} />
          </div>
          <h1 className={styles.title}>Oops!</h1>
          <p className={styles.text}>{error}</p>
          <p className={styles.note}>
            Please ensure you have a valid session ID before proceeding.
          </p>

          <div className={styles.actions}>
            <Link to="/" className={styles.continueButton}>
              Go Home <ArrowRight size={18} className={styles.buttonIcon} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        numberOfPieces={700}
        recycle={false}
      />
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <CheckCircle className={styles.icon} />
        </div>
        <h1 className={styles.title}>Purchase Successful!</h1>
        <p className={styles.text}>
          Thank you for your order. We're processing it now.
        </p>
        <p className={styles.note}>
          Check your email for order details and updates.
        </p>

        <div className={styles.actions}>
          {/* <button className={styles.trustButton}>
            <HandHeart size={18} className={styles.buttonIcon} />
            Thanks for trusting us!
          </button> */}
          <Link to={"/properties"} className={styles.continueButton}>
            Continue{" "}
            <ArrowRight size={18} className={styles.buttonIcon} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
