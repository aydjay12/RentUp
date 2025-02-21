import mongoose from "mongoose";

const residencySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    image: { type: String, required: true },
    facilities: { type: mongoose.Schema.Types.Mixed }, // JSON object
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Default is null until owned
    owned: { type: Boolean, default: false }, // ✅ New field to track ownership
  },
  { timestamps: true }
);

export const Residency = mongoose.model("Residency", residencySchema);
