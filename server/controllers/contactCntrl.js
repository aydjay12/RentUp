import asyncHandler from "express-async-handler";
import { ContactForm } from "../models/contactForm.model.js";

// ✅ Submit contact form
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Save the contact form data to the database
    const contactForm = new ContactForm({
      name,
      email,
      subject,
      message,
    });

    await contactForm.save();

    res.status(201).json({
      message: "Contact form submitted successfully",
      data: contactForm,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get all contact forms
export const getAllContacts = asyncHandler(async (req, res) => {
  try {
    const contacts = await ContactForm.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete a contact message
export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await ContactForm.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    await contact.deleteOne();
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

