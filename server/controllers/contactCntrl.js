import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message, subject } = req.body;

  // Validate input
  if (!name || !email || !message || !subject) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Save the contact form data to the database
    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        message,
        subject,
      },
    });

    res.status(201).json({
      message: "Contact form submitted successfully",
      data: contactForm,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const contacts = await prisma.contactForm.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
