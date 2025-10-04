import { Router } from "express";
import ItemController from "../controllers/ItemController.js";
import { validateBody } from "../middleware/validateMiddleware.js";
import { createItemSchema, updateItemSchema, adjustStockSchema } from "../validators/schemas.js";

const router = Router();

router.post("/", validateBody(createItemSchema), ItemController.create);
router.get("/", ItemController.list);
router.get("/:id", ItemController.get);
router.put("/:id", validateBody(updateItemSchema), ItemController.update);
router.delete("/:id", ItemController.delete);

// adjust exige userId no body;
router.post("/:id/adjust", validateBody(adjustStockSchema), ItemController.adjust);

export default router;
