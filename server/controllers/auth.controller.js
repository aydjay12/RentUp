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

dotenv.config();

const client = new OAuth2Client(
  process.env.CLIENT_ID,
);

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    console.log("userAlreadyExists", userAlreadyExists);

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  const { code } = req.body;

  try {
    const payload = {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: "https://rent-up-gold.vercel.app/auth/google/callback", // Match frontend callback
      grant_type: "authorization_code",
    };

    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { id_token } = tokenResponse.data;

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.CLIENT_ID,
    });

    const payloadResponse = ticket.getPayload();
    const { email, name, picture } = payloadResponse;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        image: picture,
        isVerified: true,
      });
      await user.save();
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Logged in with Google successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error in googleLogin:", error.message);
    if (error.response) {
      console.error("Google API response:", error.response.data);
    }
    res.status(500).json({ success: false, message: "Google Sign-In failed", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
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
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate new OTP
    const newVerificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.verificationToken = newVerificationToken;
    user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    await user.save();

    // Send the new OTP via email
    await sendVerificationEmail(user.email, newVerificationToken);

    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.log("Error in resendVerificationEmail", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email or password is missing
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // If user doesn't exist, return error
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Ensure user has a valid password before comparing
    if (!user.password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(res, user._id);

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Send response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login: ", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong, please try again",
      });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    // domain: undefined // Only set if you set domain when creating the cookie
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset link sent to your email",
      });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
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
      await user.save();
      return res.json({ message: "Removed from favourites", user });
    } else {
      user.favResidenciesID.push(rid);
      await user.save();
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
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, gender, birthday, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, address, gender, birthday, image },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
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
