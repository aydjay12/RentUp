import express from "express";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, async (req, res) => {
	try {
		const analyticsData = await getAnalyticsData();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		const dailySalesData = await getDailySalesData(startDate, endDate);

		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export { router as analyticsRoute };
