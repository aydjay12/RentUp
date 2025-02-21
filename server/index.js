// index.js (server-side)
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { residencyRoute } from "./routes/residencyRoute.js";
import { contactRoute } from "./routes/contactRoute.js";
import { connectDB } from "./db/connectDB.js";
import { authRoute } from "./routes/auth.route.js"; // Note: .route.js, not .routes.js as in your question
import path from "path";
import { cartRoute } from "./routes/cart.route.js";
import { couponRoute } from "./routes/coupon.route.js";
import { paymentRoute } from "./routes/payment.route.js";
import { analyticsRoute } from "./routes/analytics.route.js";
import multer from "multer";
import fs from "fs/promises"; // Import fs for directory creation
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(cors({ origin: "https://rent-up-gold.vercel.app", credentials: true }));
app.use(express.json({ limit: "10mb" }));

const __dirname = path.resolve();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch((err) => {
  console.error("Error creating uploads directory:", err);
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes (pass upload to authRoute)
app.use("/api/auth", authRoute(upload));
app.use("/api/residency", residencyRoute);
app.use("/api/contact", contactRoute);
app.use("/api/cart", cartRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/analytics", analyticsRoute);

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});