import { Router } from "express";
import ItemController from "../controllers/ItemController";

const router = Router();

router.post("/", ItemController.create);
router.get("/", ItemController.list);
router.get("/:id", ItemController.get);
router.put("/:id", ItemController.update);
router.delete("/:id", ItemController.delete);
router.post("/:id/adjust", ItemController.adjust);

export default router;
