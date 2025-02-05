import nodemailer from "nodemailer";
import crypto from "crypto";
import { prisma } from "../config/prismaConfig.js";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: "gmail", // Or use a different email provider
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Function to Generate OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

// Function to Send OTP via Email
export const sendOTP = async (email) => {
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 mins

    // Store OTP in database
    await prisma.otp.create({
        data: {
            email,
            otp,
            expiresAt: expiry,
        },
    });

    // Email Content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return otp;
};

// Function to Verify OTP
export const verifyOTP = async (email, otp) => {
    const storedOTP = await prisma.otp.findFirst({
        where: { email, otp },
        orderBy: { expiresAt: "desc" }, // Get latest OTP
    });

    if (!storedOTP) return false; // No OTP found

    if (new Date() > new Date(storedOTP.expiresAt)) {
        await prisma.otp.deleteMany({ where: { email } }); // Remove expired OTP
        return false; // OTP Expired
    }

    // OTP is valid, delete it from DB
    await prisma.otp.deleteMany({ where: { email } });

    return true;
};
