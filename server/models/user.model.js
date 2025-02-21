import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    image: {
      type: String,
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        residency: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Residency",
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bookedVisits: {
      type: [mongoose.Schema.Types.Mixed], // Replacing JSON array
      default: [],
    },
    favResidenciesID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Residency",
      },
    ],
    ownedResidencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Residency",
      },
    ],
    password: {
      type: String,
    },
    address: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", ""],
      default: "",
    },
    birthday: {
      type: Date,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
