import express from "express";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getCoupon);
router.post("/validate", verifyToken, validateCoupon);

export { router as couponRoute };
