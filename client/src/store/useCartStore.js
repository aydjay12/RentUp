// useCartStore.js
import { create } from "zustand";
import axios from "axios";
import useSnackbarStore from "./useSnackbarStore";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/cart"
    : "https://rent-up-api.vercel.app/api/cart";

const COUPON_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/coupons"
    : "https://rent-up-api.vercel.app/api/coupons";

export const useCartStore = create((set, get) => ({
  cartItems: [], // Initial empty array
  coupon: null,
  availableCoupons: [],
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  loading: false, // Initial loading state is false, set to true during fetch
  hasShownError: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get(`${COUPON_URL}`);
      set({
        availableCoupons: Array.isArray(response.data) ? response.data : [],
      });
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post(`${COUPON_URL}/validate`, { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      useSnackbarStore.getState().showSnackbar("Coupon applied successfully", "success");
    } catch (error) {
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Failed to apply coupon", "error");
    }
  },

  removeCoupon: () => {
    set({ isCouponApplied: false, coupon: null });
    get().calculateTotals();
    useSnackbarStore.getState().showSnackbar("Coupon removed", "success");
  },

  fetchCart: async (options = {}) => {
    try {
      if (!options.skipGlobalLoading) {
        set({ loading: true });
      }
      const response = await axios.get(`${API_URL}/all`);
      const cartData = Array.isArray(response.data) ? response.data : [];
      set({
        cartItems: cartData,
        loading: false,
        hasShownError: false,
      });
      get().calculateTotals();
    } catch (error) {
      set({ cartItems: [], loading: false });
      // Error handling moved to CartPage.jsx
    }
  },

  clearCart: async () => {
    try {
      await axios.delete(`${API_URL}/clear`);
      set({ cartItems: [], coupon: null, total: 0, subtotal: 0 });
      if (!get().hasShownError) {
        // useSnackbarStore.getState().showSnackbar("Cart cleared successfully", "success");
        set({ hasShownError: true });
      }
    } catch (error) {
      if (!get().hasShownError) {
        useSnackbarStore.getState().showSnackbar("Failed to clear cart", "error");
        set({ hasShownError: true });
      }
    }
  },

  addToCart: async (rid) => {
    try {
      const response = await axios.post(`${API_URL}/add/${rid}`);
      const cartData = Array.isArray(response.data.cartItems)
        ? response.data.cartItems
        : [];
      set({ cartItems: cartData });
      useSnackbarStore.getState().showSnackbar("Added to cart", "success");
    } catch (error) {
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Error adding to cart", "error");
    }
  },

  removeFromCart: async (rid) => {
    try {
      await axios.delete(`${API_URL}/remove/${rid}`);
      set((state) => ({
        cartItems: Array.isArray(state.cartItems)
          ? state.cartItems.filter((item) => item._id !== rid)
          : [],
      }));
      get().calculateTotals();
      useSnackbarStore.getState().showSnackbar("Removed from cart", "success");
    } catch (error) {
      await get().fetchCart();
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Error removing from cart", "error");
    }
  },

  toggleCart: async (rid, options = {}) => {
    try {
      const response = await axios.post(`${API_URL}/toggle/${rid}`);
      useSnackbarStore.getState().showSnackbar(response.data.message, "success");
      await get().fetchCart(options);
    } catch (error) {
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Error updating cart", "error");
    }
  },

  updateQuantity: async (rid, quantity) => {
    if (quantity < 1) {
      await get().removeFromCart(rid);
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${rid}`, { quantity });
      set((state) => ({
        cartItems: Array.isArray(state.cartItems)
          ? state.cartItems.map((item) =>
            item._id === rid ? { ...item, quantity } : item
          )
          : [],
      }));
      get().calculateTotals();
    } catch (error) {
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Error updating quantity", "error");
    }
  },

  calculateTotals: () => {
    const { cartItems, coupon, isCouponApplied } = get();
    const itemsArray = Array.isArray(cartItems) ? cartItems : [];
    const subtotal = itemsArray.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    let total = subtotal;

    if (coupon && isCouponApplied) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },

  // Utility to check cart limit
  isCartOverLimit: () => {
    const { cartItems } = get();
    return Array.isArray(cartItems) && cartItems.length > 8;
  },
}));
