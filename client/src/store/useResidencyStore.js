import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:8000/api/residency" : "/api/residency";

export const useResidencyStore = create((set, get) => ({
  residencies: [],
  recommendedResidencies: [],
  loading: false,
  hasShownError: false,

  setResidencies: (residencies) => set({ residencies }),

  fetchAllResidencies: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/allresd`);
      set({ residencies: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching residencies:", error);
      set({ loading: false });
      // ✅ Show toast only if it hasn't been shown yet
      if (!get().hasShownError) {
        toast.error("Failed to fetch residencies.");
        set({ hasShownError: true }); // ✅ Mark error as shown
      }
    }
  },
  fetchResidencyById: async (id) => {
    if (!id) {
      console.error("fetchResidencyById: ID is undefined!");
      toast.error("Invalid residency ID");
      return null;
    }
  
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error fetching residency:", error);
      set({ loading: false });
      toast.error("Error fetching residency details");
      return null;
    }
  },
  

  createResidency: async (data) => {
    set({ loading: true });
    try {
      // Send data directly without wrapping it in an object
      const response = await axios.post(`${API_URL}/create`, data);
      set((state) => ({
        residencies: [...state.residencies, response.data.residency],
        loading: false,
      }));
      toast.success("Residency created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to create residency");
      throw error;
    }
  },
  

  removeResidency: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/remove/${id}`);
      set((state) => ({
        residencies: state.residencies.filter((residency) => residency._id !== id),
        loading: false,
      }));
      toast.success("Residency removed successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to remove residency");
      throw error;
    }
  },

  fetchRecommendations: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/recommendations`);
      set({ recommendedResidencies: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      set({ loading: false });
      toast.error("Failed to fetch recommendations");
    }
  },

  updateResidency: async (id, data) => {
    set({ loading: true });
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, data);
      
      set((state) => ({
        residencies: state.residencies.map((residency) =>
          residency._id === id ? response.data.residency : residency
        ),
        loading: false,
      }));
  
      toast.success("Residency updated successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to update residency");
      throw error;
    }
  },
  
}));
