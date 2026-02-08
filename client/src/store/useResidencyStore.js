// useResidencyStore.js
import { create } from "zustand";
import axios from "axios";
import useSnackbarStore from "./useSnackbarStore";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/residency"
    : "https://rent-up-api.vercel.app/api/residency";

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
        useSnackbarStore.getState().showSnackbar("Failed to fetch residencies.", "error");
        set({ hasShownError: true });
      }
    }
  },

  fetchResidencyById: async (id) => {
    if (!id) {
      console.error("fetchResidencyById: ID is undefined!");
      useSnackbarStore.getState().showSnackbar("Invalid residency ID", "error");
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
      useSnackbarStore.getState().showSnackbar("Error fetching residency details", "error");
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
      useSnackbarStore.getState().showSnackbar("Residency created successfully", "success");
    } catch (error) {
      set({ loading: false });
      useSnackbarStore.getState().showSnackbar(
        error.response?.data?.message || "Failed to create residency", "error"
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
      useSnackbarStore.getState().showSnackbar("Residency removed successfully", "success");
    } catch (error) {
      set({ loading: false });
      useSnackbarStore.getState().showSnackbar(
        error.response?.data?.message || "Failed to remove residency", "error"
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
      useSnackbarStore.getState().showSnackbar("Failed to fetch recommendations", "error");
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
      useSnackbarStore.getState().showSnackbar("Residency updated successfully", "success");
    } catch (error) {
      set({ loading: false });
      useSnackbarStore.getState().showSnackbar(
        error.response?.data?.message || "Failed to update residency", "error"
      );
      throw error;
    }
  },
}));
