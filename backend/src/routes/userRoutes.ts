import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { clerkMiddleware } from "@clerk/express";
const router = Router();

// protected route
router.post("/sync", clerkMiddleware(), userController.syncUser);

export default router;
