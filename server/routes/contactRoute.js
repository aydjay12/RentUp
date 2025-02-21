import express from "express";
import { submitContactForm, getAllContacts, deleteContact } from "../controllers/contactCntrl.js";

const router = express.Router();

router.post("/submit", submitContactForm);
router.get("/all", getAllContacts);
router.delete("/delete/:id", deleteContact); // ✅ New delete route

export { router as contactRoute };
