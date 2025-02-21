import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/cart"
    : "/api/cart";

const COUPON_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/coupons"
    : "/api/coupons";

export const useCartStore = create((set, get) => ({
  cartItems: [],
  coupon: null,
  availableCoupons: [],
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  loading: true,
  hasShownError: false, // ✅ New state to track if error was shown

  getMyCoupon: async () => {
    try {
      const response = await axios.get(`${COUPON_URL}`);
      set({ availableCoupons: response.data }); // ✅ Store all available coupons
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

  // ✅ Fetch all cart items
  fetchCart: async () => {
    try {
      set({ loading: true });
      const response = await axios.get(`${API_URL}/all`);
      set({
        cartItems: response.data || [],
        loading: false,
        hasShownError: false,
      }); // ✅ Reset error flag on success
      get().calculateTotals();
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ cartItems: [], loading: false });

      // ✅ Show error toast only once
      if (!get().hasShownError) {
        toast.error("Error fetching cart items");
        set({ hasShownError: true }); // ✅ Mark error as shown
      }
    }
  },

  clearCart: async () => {
    try {
      await axios.delete(`${API_URL}/clear`); // ✅ Call backend
      set({ cartItems: [], coupon: null, total: 0, subtotal: 0 });
      if (!get().hasShownError) {
        // toast.success("Cart cleared successfully");
        set({ hasShownError: true });
      }
    } catch (error) {
      if (!get().hasShownError) {
        toast.error("Failed to clear cart");
        set({ hasShownError: true });
      }
    }
  },  

  // ✅ Add to Cart
  addToCart: async (rid) => {
    try {
      const response = await axios.post(`${API_URL}/add/${rid}`);
      set({ cartItems: response.data.cartItems });
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding to cart");
    }
  },

  // ✅ Remove from Cart
  removeFromCart: async (rid) => {
    try {
      // Optimistically update UI
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item._id !== rid),
      }));

      // Call API to remove item
      await axios.delete(`${API_URL}/remove/${rid}`);

      // Recalculate totals after removal
      get().calculateTotals();

      toast.success("Removed from cart");
    } catch (error) {
      // Revert UI if the API call fails
      await get().fetchCart();
      toast.error(error.response?.data?.message || "Error removing from cart");
    }
  },

  // ✅ Toggle Cart (Add/Remove on Click)
  toggleCart: async (rid) => {
    try {
      const response = await axios.post(`${API_URL}/toggle/${rid}`);
      toast.success(response.data.message);

      // ✅ Re-fetch cart to ensure correct state update
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
        cartItems: state.cartItems.map((item) =>
          item._id === rid ? { ...item, quantity } : item
        ),
      }));

      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating quantity");
    }
  },

  calculateTotals: () => {
    const { cartItems, coupon, isCouponApplied } = get();
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    let total = subtotal;

    if (coupon && isCouponApplied) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
