import { Router } from "express";
import * as commentController from "../controllers/commentController.js";
import { protect } from "../middleware/customAuthMiddleware.js";
const router = Router();
// create a new comment
router.post("/:productId", protect, commentController.createComment);
// delete
router.delete("/:commentId", protect, commentController.deleteComment);
export default router;
