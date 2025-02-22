import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  loginWithGoogle: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/google-login`, {
        code, // Send authorization code
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success("Logged in with Google successfully");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in with Google",
        isLoading: false,
      });
      throw error;
    }
  },
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  resendVerificationEmail: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/resend-otp`, { email });
      set({ isLoading: false });
      return response.data; // Return response to check if it worked
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error resending OTP",
        isLoading: false,
      });
      throw error;
    }
  },  

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },

  toFav: async (rid) => {
    try {
      const response = await axios.post(`${API_URL}/toFav/${rid}`);

      set((state) => ({
        user: {
          ...state.user,
          favResidenciesID: response.data.user.favResidenciesID,
        },
        favourites: response.data.user.favResidenciesID, // Update favourites list
      }));

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating favourites");
    }
  },

  getAllFav: async () => {
    try {
      const response = await axios.get(`${API_URL}/allFav`);
      
      // // Log the response for debugging
      // console.log("Favourites Fetched:", response.data);
  
      // Update the favourites state with the response data (array of favourite IDs)
      set({ favourites: response.data });
    } catch (error) {
      // Handle errors
      console.error("Error fetching favourites:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Error fetching favourites");
    }
  },

  fetchProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      set({ user: response.data });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  },

  updateProfile: async (updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, updatedData);
      set({ user: response.data.user });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  uploadProfileImage: async (file) => {
    set({ isLoading: true, error: null });
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${API_URL}/profile/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
      return response.data.secure_url; // Return Cloudinary URL
    } catch (error) {
      console.error("Error uploading image:", error);
      set({ error: "Failed to upload image", isLoading: false });
      toast.error(error.response?.data?.message || "Failed to upload image");
      throw error;
    }
  },

}));
