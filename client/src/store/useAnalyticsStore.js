import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/analytics"
    : "https://rentupgold.onrender.com/api/analytics";

export const useAnalyticsStore = create((set, get) => ({
  analyticsData: { users: 0, products: 0, totalSales: 0, totalRevenue: 0 },
  dailySalesData: [],
  loading: false,
  error: null,
  hasShownError: false,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(API_URL);
      const { analyticsData, dailySalesData } = response.data;

      set({
        analyticsData: {
          users: analyticsData?.users || 0,
          products: analyticsData?.products || 0,
          totalSales: analyticsData?.totalSales || 0,
          totalRevenue: analyticsData?.totalRevenue || 0,
        },
        dailySalesData: dailySalesData || [],
        loading: false,
        hasShownError: false, // ✅ Reset error flag on success
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);

      // ✅ Show toast only if it hasn't been shown yet
      if (!get().hasShownError) {
        toast.error("Failed to fetch analytics data.");
        set({ hasShownError: true }); // ✅ Mark error as shown
      }

      set({ error: error.message, loading: false });
    }
  },
}));
