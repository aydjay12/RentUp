import { create } from "zustand";
import axios from "axios";
import useSnackbarStore from "./useSnackbarStore";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/contact"
    : "https://rent-up-api.vercel.app/api/contact";

export const useContactStore = create((set, get) => ({
  contacts: [],
  loading: false,
  hasShownError: false,

  setContacts: (contacts) => set({ contacts }),

  // ✅ Fetch all contacts
  getAllContacts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/all`);
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
    set({ loading: true });
    try {
      await axios.post(`${API_URL}/submit`, formData);
      set({ loading: false });
      useSnackbarStore.getState().showSnackbar("Message sent successfully!", "success");
    } catch (error) {
      set({ loading: false });
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Failed to send message", "error");
      throw error;
    }
  },

  deleteContact: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      set((state) => ({
        contacts: state.contacts.filter((contact) => contact._id !== id),
        loading: false,
      }));
      useSnackbarStore.getState().showSnackbar("Message deleted successfully", "success");
    } catch (error) {
      set({ loading: false });
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Failed to delete message", "error");
    }
  },
}));
