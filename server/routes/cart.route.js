import express from "express";
import { addToCart, removeFromCart, toggleCart, getCartResidencies, updateQuantity, clearCart } from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add/:rid", verifyToken, addToCart);
router.delete("/remove/:rid", verifyToken, removeFromCart);
router.post("/toggle/:rid", verifyToken, toggleCart);
router.get("/all", verifyToken, getCartResidencies);
router.put("/:rid", verifyToken, updateQuantity);
router.delete("/clear", verifyToken, clearCart);

export { router as cartRoute };
