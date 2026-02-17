import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useSnackbarStore from "./useSnackbarStore";

// Token management for iOS/cross-origin compatibility
const TOKEN_KEY = "auth_token";

const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

const setStoredToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Failed to store token:", error);
  }
};

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
      const response = await axiosInstance.post("/auth/register", userData);
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
      const response = await axiosInstance.post("/auth/verify-email", { email, code: token });
      // Store token for iOS/cross-origin compatibility
      if (response.data.token) {
        setStoredToken(response.data.token);
      }
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
      const response = await axiosInstance.post("/auth/resend-verification", { email });
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
      const response = await axiosInstance.post("/auth/login", credentials);
      // Store token for iOS/cross-origin compatibility
      if (response.data.token) {
        setStoredToken(response.data.token);
      }
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
      const response = await axiosInstance.get("/auth/check-auth");
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
      await axiosInstance.post("/auth/logout");
      // Clear stored token
      setStoredToken(null);
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
      const response = await axiosInstance.post("/auth/forgot-password", { email });
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
      const response = await axiosInstance.post("/auth/reset-password", { token, password });
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
    const previousFavs = get().favorites;
    const isAlreadyFav = previousFavs.includes(rid);

    // Optimistic toggle
    const nextFavs = isAlreadyFav
      ? previousFavs.filter(id => id !== rid)
      : [...previousFavs, rid];

    set((state) => ({
      user: {
        ...state.user,
        favResidenciesID: nextFavs,
      },
      favorites: nextFavs,
    }));

    try {
      const response = await axiosInstance.post(`/auth/toFav/${rid}`);
      // Success - update with actual server data just in case
      set((state) => ({
        user: {
          ...state.user,
          favResidenciesID: response.data.user.favResidenciesID,
        },
        favorites: response.data.user.favResidenciesID,
      }));
      useSnackbarStore.getState().showSnackbar(response.data.message, "success");
    } catch (error) {
      // Revert if failed
      set((state) => ({
        user: {
          ...state.user,
          favResidenciesID: previousFavs,
        },
        favorites: previousFavs,
      }));
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Error updating favorites", "error");
    }
  },

  // RentUp specific: Get all favorited residencies
  getAllFav: async () => {
    set({ favoritesLoading: true });
    try {
      const response = await axiosInstance.get("/auth/allFav");
      set({ favorites: response.data, favoritesLoading: false });
    } catch (error) {
      set({ favoritesLoading: false });
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Error fetching favorites", "error");
    }
  },

  fetchProfile: async () => {
    try {
      const response = await axiosInstance.get("/auth/profile");
      set({ user: response.data.user });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  },

  updateProfile: async (updatedData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put("/auth/profile", updatedData);
      set({ user: response.data.user, isLoading: false });
      useSnackbarStore.getState().showSnackbar(response.data.message || "Profile updated", "success");
    } catch (error) {
      set({ isLoading: false });
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Failed to update profile", "error");
    }
  },

  uploadProfileImage: async (file) => {
    set({ isLoading: true });
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axiosInstance.post("/auth/profile/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        user: { ...state.user, image: response.data.secure_url },
        isLoading: false,
      }));
      return response.data.secure_url;
    } catch (error) {
      set({ isLoading: false });
      useSnackbarStore.getState().showSnackbar(error.response?.data?.message || "Failed to upload image", "error");
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
