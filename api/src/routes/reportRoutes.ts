import { Router } from "express";
import ReportController from "../controllers/ReportController.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validateMiddleware.js"; 
import {
  recentAdjustmentsQuerySchema,
  logsQuerySchema,
  uuidParamSchema,
  updateReportSchema,
} from "../validators/schemas.js"; 
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/stock-levels", ReportController.stockLevels);
router.get("/recent-adjustments", validateQuery(recentAdjustmentsQuerySchema), ReportController.recentAdjustments); 
router.get("/adjustments/:id", validateParams(uuidParamSchema), ReportController.AdjustmentsByItemId);
router.get("/logs", validateQuery(logsQuerySchema), ReportController.logs);
router.get("/:id", validateParams(uuidParamSchema), ReportController.get); 
router.put("/:id", validateParams(uuidParamSchema), validateBody(updateReportSchema), ReportController.update); 
router.delete("/:id", validateParams(uuidParamSchema), ReportController.delete); 

export default router;