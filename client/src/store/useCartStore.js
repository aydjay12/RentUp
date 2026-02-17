import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useSnackbarStore from "./useSnackbarStore";

export const useCartStore = create((set, get) => ({
  cartItems: [], // Initial empty array
  coupon: null,
  availableCoupons: [],
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  loading: false, // Initial loading state is false, set to true during fetch
  isError: false,
  hasShownError: false,

  getMyCoupon: async () => {
    try {
      const response = await axiosInstance.get("/coupons");
      set({
        availableCoupons: Array.isArray(response.data) ? response.data : [],
      });
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axiosInstance.post("/coupons/validate", { code });
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
      const response = await axiosInstance.get("/cart/all");
      const cartData = Array.isArray(response.data) ? response.data : [];
      set({
        cartItems: cartData,
        loading: false,
        isError: false,
        hasShownError: false,
      });
      get().calculateTotals();
    } catch (error) {
      // If unauthorized, just clear cart and don't show error UI
      if (error.response?.status === 401 || error.response?.status === 403) {
        set({ cartItems: [], loading: false, isError: false });
      } else {
        set({ cartItems: [], loading: false, isError: true });
      }
    }
  },

  clearCart: async () => {
    try {
      await axiosInstance.delete("/cart/clear");
      set({ cartItems: [], coupon: null, total: 0, subtotal: 0, isError: false });
    } catch (error) {
      if (!get().hasShownError) {
        useSnackbarStore.getState().showSnackbar("Failed to clear cart", "error");
        set({ hasShownError: true });
      }
    }
  },

  addToCart: async (rid) => {
    try {
      await axiosInstance.post(`/cart/add/${rid}`);
      useSnackbarStore.getState().showSnackbar("Added to cart", "success");
      await get().fetchCart({ skipGlobalLoading: true });
    } catch (error) {
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Error adding to cart", "error");
    }
  },

  removeFromCart: async (rid) => {
    try {
      await axiosInstance.delete(`/cart/remove/${rid}`);
      useSnackbarStore.getState().showSnackbar("Removed from cart", "success");
      await get().fetchCart({ skipGlobalLoading: true });
    } catch (error) {
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Error removing from cart", "error");
    }
  },

  toggleCart: async (rid, options = {}) => {
    try {
      const response = await axiosInstance.post(`/cart/toggle/${rid}`);
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
      await axiosInstance.put(`/cart/${rid}`, { quantity });
      set((state) => ({
        cartItems: Array.isArray(state.cartItems)
          ? state.cartItems.map((item) =>
            (item && item._id === rid) ? { ...item, quantity } : item
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
      (sum, item) => {
        if (!item) return sum;
        return sum + (item.price || 0) * (item.quantity || 1);
      },
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
