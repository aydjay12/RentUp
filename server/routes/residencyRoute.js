import express from "express";
import { createResidency, getAllResidencies, getRecommendedResidencies, getResidency, removeResidency, updateResidency } from "../controllers/resdCntrl.js";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/create", verifyToken, verifyAdmin, createResidency)
router.get("/allresd", getAllResidencies)
router.get("/recommendations", getRecommendedResidencies)
router.get("/:id", getResidency)
router.delete("/remove/:id", verifyToken, verifyAdmin, removeResidency);
router.put("/update/:id", verifyToken, verifyAdmin, updateResidency);

export {router as residencyRoute}