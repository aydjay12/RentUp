import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
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
      type: [mongoose.Schema.Types.Mixed],
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
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    rememberMe: {
      type: Boolean,
      default: false,
    },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
