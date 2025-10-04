import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = Router();

router.post("/", UserController.create);
router.get("/", UserController.list);
router.get("/:id", UserController.get);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
