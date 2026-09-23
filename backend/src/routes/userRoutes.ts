import { Router } from "express";
import * as userController from "../controllers/userController.js";

const router = Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

export default router;
