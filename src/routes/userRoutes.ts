import { Router } from "express";
import { syncUser } from "../controllers/userController.js";
import { clerkMiddleware } from "@clerk/express";
const router = Router();

// protected route
router.post("/sync", clerkMiddleware(), syncUser);

export default router;
