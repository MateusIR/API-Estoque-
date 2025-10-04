import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { validateBody } from "../middleware/validateMiddleware.js";
import { createUserSchema, updateUserSchema } from "../validators/schemas.js";

const router = Router();

router.post("/", validateBody(createUserSchema), UserController.create);
router.get("/", UserController.list);
router.get("/:id", UserController.get);
router.put("/:id", validateBody(updateUserSchema), UserController.update);
router.delete("/:id", UserController.delete);

export default router;
