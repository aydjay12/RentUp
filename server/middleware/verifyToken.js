import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // Import User model

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    }

    // Fetch user profile and exclude password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach full user profile
    req.userId = user._id; // Attach userId separately for convenience

    next();
  } catch (error) {
    console.log("Error in verifyToken middleware", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Middleware to verify if the user is an admin
export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden - Admin access required" });
    }

    next();
  } catch (error) {
    console.log("Error in verifyAdmin ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
