// useCartStore.js
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.MODE === "development"
    ? "https://rent-up-servers.vercel.app/api/cart"
    : "/api/cart";

const COUPON_URL =
  import.meta.env.MODE === "development"
    ? "https://rent-up-servers.vercel.app/api/coupons"
    : "/api/coupons";

export const useCartStore = create((set, get) => ({
  cartItems: [], // Ensure initial value is an array
  coupon: null,
  availableCoupons: [],
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  loading: true,
  hasShownError: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get(`${COUPON_URL}`);
      set({
        availableCoupons: Array.isArray(response.data) ? response.data : [],
      }); // Guard against non-array
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post(`${COUPON_URL}/validate`, { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: () => {
    set({ isCouponApplied: false, coupon: null });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  fetchCart: async () => {
    try {
      set({ loading: true });
      const response = await axios.get(`${API_URL}/all`);
      const cartData = Array.isArray(response.data) ? response.data : [];
      set({
        cartItems: cartData,
        loading: false,
        hasShownError: false,
      });
      get().calculateTotals();
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ cartItems: [], loading: false }); // Reset to empty array on error
      if (!get().hasShownError) {
        toast.error("Error fetching cart items");
        set({ hasShownError: true });
      }
    }
  },

  clearCart: async () => {
    try {
      await axios.delete(`${API_URL}/clear`);
      set({ cartItems: [], coupon: null, total: 0, subtotal: 0 });
      if (!get().hasShownError) {
        // toast.success("Cart cleared successfully"); // Uncomment if desired
        set({ hasShownError: true });
      }
    } catch (error) {
      if (!get().hasShownError) {
        toast.error("Failed to clear cart");
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
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding to cart");
    }
  },

  removeFromCart: async (rid) => {
    try {
      set((state) => ({
        cartItems: Array.isArray(state.cartItems)
          ? state.cartItems.filter((item) => item._id !== rid)
          : [],
      }));
      await axios.delete(`${API_URL}/remove/${rid}`);
      get().calculateTotals();
      toast.success("Removed from cart");
    } catch (error) {
      await get().fetchCart(); // Revert UI
      toast.error(error.response?.data?.message || "Error removing from cart");
    }
  },

  toggleCart: async (rid) => {
    try {
      const response = await axios.post(`${API_URL}/toggle/${rid}`);
      toast.success(response.data.message);
      await get().fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating cart");
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
      toast.error(error.response?.data?.message || "Error updating quantity");
    }
  },

  calculateTotals: () => {
    const { cartItems, coupon, isCouponApplied } = get();
    const itemsArray = Array.isArray(cartItems) ? cartItems : []; // Guard against non-array
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
}));
