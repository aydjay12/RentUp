import { User } from "../models/user.model.js";
import { Residency } from "../models/residency.model.js";
import asyncHandler from "express-async-handler";

// ✅ Add to Cart
export const addToCart = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if residency exists
    const residency = await Residency.findById(rid);
    if (!residency) return res.status(404).json({ message: "Residency not found" });

    // Check if already in cart
    const alreadyInCart = user.cartItems.some(item => item.residency.toString() === rid);
    if (alreadyInCart) return res.status(400).json({ message: "Residency already in cart" });

    // Add residency to cart
    user.cartItems.push({ residency: rid });
    await user.save();
    res.json({ message: "Added to cart", cart: user.cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Remove from Cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cartItems = user.cartItems.filter(item => item.residency.toString() !== rid);
    await user.save();
    res.json({ message: "Removed from cart", cart: user.cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Toggle Cart (Add/Remove on click)
export const toggleCart = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", type: "error" });

    const index = user.cartItems.findIndex(item => item.residency.toString() === rid);

    if (index !== -1) {
      user.cartItems.splice(index, 1);
      await user.save();
      return res.json({ message: "Removed from cart", type: "success", cart: user.cartItems });
    } else {
      const residency = await Residency.findById(rid);
      if (!residency) return res.status(404).json({ message: "Residency not found", type: "error" });

      user.cartItems.push({ residency: rid });
      await user.save();
      return res.json({ message: "Added to cart", type: "success", cart: user.cartItems });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
});

// ✅ Get All Residencies in Cart
export const getCartResidencies = asyncHandler(async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate("cartItems.residency");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out items where residency is null (e.g. residency was deleted)
    // and map to include quantity if needed (though currently frontend mostly uses residency props)
    const cartItems = user.cartItems
      .filter(item => item.residency !== null)
      .map(item => ({
        ...item.residency.toObject(),
        quantity: item.quantity
      }));

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { quantity } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cartItem = user.cartItems.find((item) => item.residency.toString() === rid);

    if (!cartItem) return res.status(404).json({ message: "Residency not in cart" });

    if (quantity === 0) {
      user.cartItems = user.cartItems.filter((item) => item.residency.toString() !== rid);
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();
    res.json({ message: "Cart updated", cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Clear Cart
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cartItems = []; // ✅ Clear all cart items
    await user.save();

    res.json({ message: "Cart cleared successfully", cart: user.cartItems });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
});


