import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useSnackbarStore from "./useSnackbarStore";

export const useContactStore = create((set, get) => ({
  contacts: [],
  loading: false,
  mutationLoading: false,
  hasShownError: false,

  setContacts: (contacts) => set({ contacts }),

  // ✅ Fetch all contacts
  getAllContacts: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/contact/all");
      set({ contacts: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      // ✅ Show toast only if it hasn't been shown yet
      if (!get().hasShownError) {
        useSnackbarStore.getState().showSnackbar("Failed to fetch messages.", "error");
        set({ hasShownError: true }); // ✅ Mark error as shown
      }
      set({ error: error.message, loading: false });
    }
  },

  // ✅ Submit a contact form
  submitContactForm: async (formData) => {
    set({ mutationLoading: true });
    try {
      await axiosInstance.post("/contact/submit", formData);
      set({ mutationLoading: false });
      useSnackbarStore.getState().showSnackbar("Message sent successfully!", "success");
    } catch (error) {
      set({ mutationLoading: false });
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Failed to send message", "error");
      throw error;
    }
  },

  deleteContact: async (id) => {
    set({ mutationLoading: true });
    try {
      await axiosInstance.delete(`/contact/delete/${id}`);
      set((state) => ({
        contacts: state.contacts.filter((contact) => contact._id !== id),
        mutationLoading: false,
      }));
      useSnackbarStore.getState().showSnackbar("Message deleted successfully", "success");
    } catch (error) {
      set({ mutationLoading: false });
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Failed to delete message", "error");
    }
  },
}));
