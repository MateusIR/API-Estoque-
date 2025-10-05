import { Router } from "express";
import ReportController from "../controllers/ReportController.js";

const router = Router();

router.get("/stock-levels", ReportController.stockLevels);
router.get("/recent-adjustments", ReportController.recentAdjustments);
router.get("/logs", ReportController.logs);
router.get("/:id", ReportController.get);
router.put("/:id", ReportController.update);
router.delete("/:id", ReportController.delete);

export default router;
