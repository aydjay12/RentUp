import express from "express";
import jwtCheck from "../config/auth0Config.js";
import { submitContactForm } from "../controllers/contactCntrl.js";

const router = express.Router();

router.post("/submit", jwtCheck, submitContactForm);

export { router as contactRoute };