import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middleware/customAuthMiddleware.js";

const router = Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", protect, userController.me);

export default router;
