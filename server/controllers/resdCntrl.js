import asyncHandler from "express-async-handler";
import { Residency } from "../models/residency.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

// ✅ Function to create a residency using Mongoose
export const createResidency = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      status,
      type,
      address,
      country,
      city,
      facilities,
      image,
    } = req.body;

    // Get the authenticated user's ID from middleware
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let cloudinaryResponse = null;
    if (image) {
      // Upload image to Cloudinary
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "residencies",
      });
    }

    // Create new residency
    const residency = await Residency.create({
      title,
      description,
      price,
      status,
      type,
      address,
      country,
      city,
      facilities,
      image: cloudinaryResponse?.secure_url || "",
      owner: user._id, // Assign admin as owner
    });

    res
      .status(201)
      .json({ message: "Residency created successfully", residency });
  } catch (error) {
    console.error("Error in createResidency controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Function to get all residencies using Mongoose
export const getAllResidencies = asyncHandler(async (req, res) => {
  try {
    const residencies = await Residency.find().sort({ createdAt: -1 });
    res.status(200).send(residencies);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// ✅ Function to get a specific residency by ID using Mongoose
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await Residency.findById(id);
    if (!residency) {
      return res.status(404).send({ message: "Residency not found" });
    }
    res.status(200).send(residency);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// ✅ Function to delete a residency using Mongoose
export const removeResidency = asyncHandler(async (req, res) => {
  try {
    const residency = await Residency.findById(req.params.id);

    if (!residency) {
      return res.status(404).json({ message: "Residency not found" });
    }

    // Delete image from Cloudinary if it exists
    if (residency.image) {
      const publicId = residency.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`residencies/${publicId}`);
        console.log("Deleted image from Cloudinary");
      } catch (error) {
        console.log("Error deleting image from Cloudinary", error);
      }
    }

    // Delete the residency
    await Residency.findByIdAndDelete(req.params.id);

    // Remove residency from user's ownedResidencies array
    await User.updateMany({}, { $pull: { ownedResidencies: req.params.id } });

    res.json({ message: "Residency deleted successfully" });
  } catch (error) {
    console.error("Error in removeResidency controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export const getRecommendedResidencies = asyncHandler(async (req, res) => {
  try {
    const recommendations = await Residency.aggregate([
      { $sample: { size: 4 } }, // Get 4 random residencies
      {
        $project: {
          _id: 1,
          title: 1, // Fix field name from 'name' to 'title'
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error in getRecommendedResidencies:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export const updateResidency = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      status,
      type,
      address,
      country,
      city,
      facilities,
      image,
    } = req.body;

    const residency = await Residency.findById(id);

    if (!residency) {
      return res.status(404).json({ message: "Residency not found" });
    }

    let updatedImage = residency.image;
    if (image && image !== residency.image) {
      // Delete previous image from Cloudinary
      if (residency.image) {
        const publicId = residency.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`residencies/${publicId}`);
      }

      // Upload new image
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "residencies",
      });
      updatedImage = cloudinaryResponse.secure_url;
    }

    // Update residency details
    const updatedResidency = await Residency.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        status,
        type,
        address,
        country,
        city,
        facilities,
        image: updatedImage,
      },
      { new: true } // Return updated residency
    );

    res.json({
      message: "Residency updated successfully",
      residency: updatedResidency,
    });
  } catch (error) {
    console.error("Error updating residency:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

