import { Router } from "express";
import ReportController from "../controllers/ReportController.js";

const router = Router();

router.get("/stock-levels", ReportController.stockLevels);
router.get("/recent-adjustments", ReportController.recentAdjustments);
router.get("/logs", ReportController.logs);

export default router;
