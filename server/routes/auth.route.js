// routes/auth.route.js
import express from "express";
import {
  allFav,
  checkAuth,
  forgotPassword,
  getProfile,
  login,
  logout,
  resendVerification,
  resetPassword,
  register,
  restoreSession,
  toFav,
  updateProfile,
  uploadProfileImage,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Export as a function that accepts upload
export const authRoute = (upload) => {
  router.get("/check-auth", verifyToken, checkAuth);
  router.post("/restore-session", restoreSession);
  router.post("/register", register);
  router.post("/login", login);
  router.post("/logout", logout);
  router.post("/verify-email", verifyEmail);
  router.post("/resend-verification", resendVerification);
  router.post("/forgot-password", forgotPassword);
  router.post("/reset-password", resetPassword);
  router.post("/toFav/:rid", verifyToken, toFav);
  router.get("/allFav", verifyToken, allFav);
  router.get("/profile", verifyToken, getProfile);
  router.put("/profile", verifyToken, updateProfile);
  router.post("/profile/upload-image", verifyToken, upload.single("image"), uploadProfileImage);

  return router;
};