import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useSnackbarStore from "./useSnackbarStore";

export const useResidencyStore = create((set, get) => ({
  residencies: [],
  recommendedResidencies: [],
  loading: false,
  mutationLoading: false,
  hasShownError: false,
  isError: false,
  error: null,

  setResidencies: (residencies) =>
    set({ residencies: Array.isArray(residencies) ? residencies : [] }),

  fetchAllResidencies: async () => {
    set({ loading: true, isError: false, error: null });
    try {
      const response = await axiosInstance.get("/residency/allresd");
      const data = Array.isArray(response.data) ? response.data : [];
      set({ residencies: data, loading: false });
    } catch (error) {
      console.error("Error fetching residencies:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch residencies.";
      set({ residencies: [], loading: false, isError: true, error: errorMsg });
      if (!get().hasShownError) {
        useSnackbarStore.getState().showSnackbar(errorMsg, "error");
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
      const response = await axiosInstance.get(`/residency/${id}`);
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
    set({ mutationLoading: true });
    try {
      const response = await axiosInstance.post("/residency/create", data);
      set((state) => ({
        residencies: [...state.residencies, response.data.residency],
        mutationLoading: false,
      }));
      useSnackbarStore.getState().showSnackbar("Residency created successfully", "success");
    } catch (error) {
      set({ mutationLoading: false });
      useSnackbarStore.getState().showSnackbar(
        error.response?.data?.message || "Failed to create residency", "error"
      );
      throw error;
    }
  },

  removeResidency: async (id) => {
    set({ mutationLoading: true });
    try {
      await axiosInstance.delete(`/residency/remove/${id}`);
      set((state) => ({
        residencies: state.residencies.filter(
          (residency) => residency._id !== id
        ),
        mutationLoading: false,
      }));
      useSnackbarStore.getState().showSnackbar("Residency removed successfully", "success");
    } catch (error) {
      set({ mutationLoading: false });
      useSnackbarStore.getState().showSnackbar(
        error.response?.data?.message || "Failed to remove residency", "error"
      );
      throw error;
    }
  },

  fetchRecommendations: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/residency/recommendations");
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
    set({ mutationLoading: true });
    try {
      const response = await axiosInstance.put(`/residency/update/${id}`, data);
      set((state) => ({
        residencies: state.residencies.map((residency) =>
          residency._id === id ? response.data.residency : residency
        ),
        mutationLoading: false,
      }));
      useSnackbarStore.getState().showSnackbar("Residency updated successfully", "success");
    } catch (error) {
      set({ mutationLoading: false });
      useSnackbarStore.getState().showSnackbar(
        error.response?.data?.message || "Failed to update residency", "error"
      );
      throw error;
    }
  },
}));
