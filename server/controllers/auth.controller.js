import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../nodemailer/emails.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs/promises"; // Import fs for file cleanup
import dotenv from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";

dotenv.config();

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      verificationToken,
      verificationTokenExpiresAt,
    });

    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({
      email,
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    await sendWelcomeEmail(user.email, user.username || user.name);

    const token = generateTokenAndSetCookie(res, user._id, user.rememberMe);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error in verifyEmail controller:", error);
    res.status(500).json({ success: false, message: "Email verification failed" });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({ success: true, message: "Verification code resent successfully" });
  } catch (error) {
    console.error("Error in resendVerificationEmail:", error);
    res.status(500).json({ success: false, message: "Failed to resend verification code" });
  }
};

export const login = async (req, res) => {
  const { email, password, rememberMe, role } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "No user found" });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ success: false, message: "No user found" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    user.lastLogin = Date.now();
    user.rememberMe = rememberMe || false;
    await user.save({ validateBeforeSave: false });

    const token = generateTokenAndSetCookie(res, user._id, user.rememberMe);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        rememberMe: user.rememberMe,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await User.findByIdAndUpdate(decoded.userId, { revokedAt: new Date() });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with that email address" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/new-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: "Failed to send reset link" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ success: false, message: "Authentication check failed" });
  }
};

export const restoreSession = async (req, res) => {
  const { auth_token } = req.body;
  console.log("Restore session called with token length:", auth_token ? auth_token.length : 0);

  if (!auth_token) {
    return res.status(400).json({ success: false, message: "No token provided" });
  }

  try {
    console.log("Attempting to verify token...");
    const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
    console.log("Token verified, userId:", decoded.userId);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("User not found for userId:", decoded.userId);
      return res.status(400).json({ success: false, message: "User not found" });
    }

    console.log("User found, setting cookie...");
    // Set the cookie as in login
    generateTokenAndSetCookie(res, user._id, user.rememberMe);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Restore session error:", error.message);
    console.error("Error stack:", error.stack);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const toFav = asyncHandler(async (req, res) => {
  const { rid } = req.params;

  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.favResidenciesID.findIndex(
      (fav) => fav.toString() === rid
    );

    if (index !== -1) {
      user.favResidenciesID.splice(index, 1);
      await user.save({ validateBeforeSave: false });
      return res.json({ message: "Removed from favourites", user });
    } else {
      user.favResidenciesID.push(rid);
      await user.save({ validateBeforeSave: false });
      return res.json({ message: "Added to favourites", user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const allFav = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("favResidenciesID");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favResidenciesID);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const getProfile = asyncHandler(async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export const updateProfile = async (req, res) => {
  try {
    const { username, name, phone, address, gender, birthday, image } = req.body;
    const finalName = name || username;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { username, name: finalName, phone, address, gender, birthday, image },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Upload image to Cloudinary
export const uploadProfileImage = asyncHandler(async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Upload file buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_pics",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer); // Use buffer from memory storage
    });

    res.json({ secure_url: result.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
