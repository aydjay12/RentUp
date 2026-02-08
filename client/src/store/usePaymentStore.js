import { create } from "zustand";
import axios from "axios";
import useSnackbarStore from "./useSnackbarStore";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "./useCartStore";

const stripePromise = loadStripe(
  "pk_test_51QpTLTB17munGA210Wnudrt8Qmlqr6DN9BM4SMhyM4vbaln2XZm8y8RUEm0xcwOF7mJo4wH49gJzD82ElbhTYj8S00X17C97tq"
);

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/payments"
    : "https://rent-up-api.vercel.app/api/payments";

export const usePaymentStore = create((set) => ({
  isProcessing: false,

  handlePayment: async (cartItems, coupon) => {
    // Cart limit check
    if (useCartStore.getState().isCartOverLimit()) {
      useSnackbarStore.getState().showSnackbar("You can only checkout a maximum of 8 properties at a time.", "error");
      return;
    }
    try {
      const stripe = await stripePromise;

      // ✅ Only send couponCode if isCouponApplied is true
      const { isCouponApplied } = useCartStore.getState();
      const couponCode = isCouponApplied && coupon ? coupon.code : null;

      const response = await axios.post(`${API_URL}/create-checkout-session`, {
        residencies: cartItems,
        couponCode, // ✅ Only send if applied
      });

      const session = response.data;
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error("Error:", result.error);
        useSnackbarStore.getState().showSnackbar("Payment failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      useSnackbarStore.getState().showSnackbar("Error processing payment. Please try again.", "error");
    }
  },


  handleCheckoutSuccess: async (sessionId) => {
    const { isProcessing } = usePaymentStore.getState();

    if (isProcessing) return; // ✅ Prevent duplicate calls
    set({ isProcessing: true });

    try {
      const response = await axios.post(`${API_URL}/checkout-success`, {
        sessionId,
      });

      if (response.data.success) {
      } else {
        throw new Error(response.data.message || "Server error");
      }
    } catch (error) {
      console.error("Checkout Success Error:", error);
      useSnackbarStore.getState().showSnackbar(
        error.response?.data?.message || "Error processing order. Try again.", "error"
      );
    } finally {
      set({ isProcessing: false }); // ✅ Reset state after execution
    }
  },
}));
