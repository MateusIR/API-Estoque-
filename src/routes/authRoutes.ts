import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { validateBody } from "../middleware/validateMiddleware.js"; 
import { loginSchema, registerSchema } from "../validators/schemas.js";

const router = Router();

router.post("/register", validateBody(registerSchema), UserController.register);
router.post("/login", validateBody(loginSchema), UserController.login);

export default router;
