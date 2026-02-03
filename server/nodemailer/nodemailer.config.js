import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using Gmail SMTP
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("Nodemailer Configured. User:", process.env.EMAIL_USER ? "Set" : "Not Set");

export const sender = {
  email: process.env.EMAIL_USER, // Your sender email (e.g., your Gmail)
  name: "RentUp",
};