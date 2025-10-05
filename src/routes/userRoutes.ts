import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { validateBody, validateParams } from "../middleware/validateMiddleware.js"; 
import { createUserSchema, updateUserSchema, uuidParamSchema } from "../validators/schemas.js"; 

const router = Router();

router.post("/", validateBody(createUserSchema), UserController.create);
router.get("/", UserController.list);
router.get("/:id", validateParams(uuidParamSchema), UserController.get); 
router.put("/:id", validateParams(uuidParamSchema), validateBody(updateUserSchema), UserController.update); // Adicionado
router.delete("/:id", validateParams(uuidParamSchema), UserController.delete);

export default router;