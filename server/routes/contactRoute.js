import express from "express";
import jwtCheck from "../config/auth0Config.js";
import { submitContactForm, getAllContacts } from "../controllers/contactCntrl.js";

const router = express.Router();

router.post("/submit", submitContactForm);
router.get("/all", getAllContacts); // New route to fetch all contacts

export { router as contactRoute };
