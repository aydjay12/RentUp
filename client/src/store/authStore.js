import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/auth"
    : "https://rent-up-api.vercel.app/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  message: null,
  favorites: [],
  favoritesLoading: false,
  lastAuthCheck: null,

  // Register user
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // Verify email
  verifyEmail: async (email, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { email, code: token });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Email verification failed";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/resend-verification`, { email });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend verification email";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        lastAuthCheck: Date.now(),
        image: response.data.user.image,
        name: response.data.user.name,
      });
      // Optionally fetch favorites/profile after login
      await get().getAllFav();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // Check authentication status
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        lastAuthCheck: Date.now(),
      });
      await get().getAllFav();
      return response.data;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        error: null,
        lastAuthCheck: Date.now(),
      });
      return null;
    }
  },

  // Logout user
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        favorites: [],
      });
    } catch (error) {
      set({ isLoading: false, error: "Logout failed" });
      throw error;
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ isLoading: false, message: response.data.message });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send reset email";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password`, { token, password });
      set({ isLoading: false, message: response.data.message });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Password reset failed";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // RentUp specific: Toggle favorited residency
  toFav: async (rid) => {
    try {
      const response = await axios.post(`${API_URL}/toFav/${rid}`);
      set((state) => ({
        user: {
          ...state.user,
          favResidenciesID: response.data.user.favResidenciesID,
        },
        favorites: response.data.user.favResidenciesID,
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating favorites");
    }
  },

  // RentUp specific: Get all favorited residencies
  getAllFav: async () => {
    set({ favoritesLoading: true });
    try {
      const response = await axios.get(`${API_URL}/allFav`);
      set({ favorites: response.data, favoritesLoading: false });
    } catch (error) {
      set({ favoritesLoading: false });
      toast.error(error.response?.data?.message || "Error fetching favorites");
    }
  },

  fetchProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      set({ user: response.data.user });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  },

  updateProfile: async (updatedData) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(`${API_URL}/profile`, updatedData);
      set({ user: response.data.user, isLoading: false });
      toast.success(response.data.message || "Profile updated");
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  },

  uploadProfileImage: async (file) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(`${API_URL}/profile/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        user: { ...state.user, image: response.data.secure_url },
        isLoading: false,
      }));
      return response.data.secure_url;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "Failed to upload image");
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
