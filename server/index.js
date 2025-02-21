// index.js (root-level)
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { residencyRoute } from "./routes/residencyRoute.js";
import { contactRoute } from "./routes/contactRoute.js";
import { connectDB } from "./db/connectDB.js";
import { authRoute } from "./routes/auth.route.js";
import path from "path";
import { cartRoute } from "./routes/cart.route.js";
import { couponRoute } from "./routes/coupon.route.js";
import { paymentRoute } from "./routes/payment.route.js";
import { analyticsRoute } from "./routes/analytics.route.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
  cors({ origin: "https://rentupgold.onrender.com", credentials: true })
);
app.use(express.json({ limit: "10mb" }));

const __dirname = path.resolve();

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/auth", authRoute(upload));
app.use("/api/residency", residencyRoute);
app.use("/api/contact", contactRoute);
app.use("/api/cart", cartRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/analytics", analyticsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
