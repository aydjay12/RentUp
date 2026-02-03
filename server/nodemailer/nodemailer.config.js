import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using Gmail SMTP
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // Force IPv4 to avoid IPv6 connection issues
  logger: true, // Log to console
  debug: true, // Include SMTP traffic in the logs
});

export const sender = {
  email: process.env.EMAIL_USER, // Your sender email (e.g., your Gmail)
  name: "RentUp",
};