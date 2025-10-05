import { Router } from "express";
import ItemController from "../controllers/ItemController.js";
import { validateBody, validateParams } from "../middleware/validateMiddleware.js"; 
import { createItemSchema, updateItemSchema, adjustStockSchema, uuidParamSchema } from "../validators/schemas.js"; 

const router = Router();

router.post("/", validateBody(createItemSchema), ItemController.create);
router.get("/", ItemController.list);
router.get("/:id", validateParams(uuidParamSchema), ItemController.get);
router.put("/:id", validateParams(uuidParamSchema), validateBody(updateItemSchema), ItemController.update); 
router.delete("/:id", validateParams(uuidParamSchema), ItemController.delete); 

router.post("/:id/adjust", validateParams(uuidParamSchema), validateBody(adjustStockSchema), ItemController.adjust); 

export default router;