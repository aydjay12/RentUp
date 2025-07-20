// useResidencyStore.js
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/residency"
    : "https://rentupgold.onrender.com/api/residency";

export const useResidencyStore = create((set, get) => ({
  residencies: [], // Always initialize as array
  recommendedResidencies: [],
  loading: false,
  hasShownError: false,
  isError: false, // Add isError to track fetch failures

  setResidencies: (residencies) =>
    set({ residencies: Array.isArray(residencies) ? residencies : [] }),

  fetchAllResidencies: async () => {
    set({ loading: true, isError: false });
    try {
      const response = await axios.get(`${API_URL}/allresd`);
      const data = Array.isArray(response.data) ? response.data : [];
      set({ residencies: data, loading: false });
    } catch (error) {
      console.error("Error fetching residencies:", error);
      set({ residencies: [], loading: false, isError: true }); // Reset to empty array on error
      if (!get().hasShownError) {
        toast.error("Failed to fetch residencies.");
        set({ hasShownError: true });
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
      const response = await axios.post(`${API_URL}/create`, data);
      set((state) => ({
        residencies: [...state.residencies, response.data.residency],
        loading: false,
      }));
      toast.success("Residency created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Failed to create residency"
      );
      throw error;
    }
  },

  removeResidency: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/remove/${id}`);
      set((state) => ({
        residencies: state.residencies.filter(
          (residency) => residency._id !== id
        ),
        loading: false,
      }));
      toast.success("Residency removed successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Failed to remove residency"
      );
      throw error;
    }
  },

  fetchRecommendations: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/recommendations`);
      set({
        recommendedResidencies: Array.isArray(response.data)
          ? response.data
          : [],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      set({ recommendedResidencies: [], loading: false });
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
      toast.error(
        error.response?.data?.message || "Failed to update residency"
      );
      throw error;
    }
  },
}));
