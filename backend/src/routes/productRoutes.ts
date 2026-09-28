import { Router } from "express";
import upload from "../middleware/uploadMiddleware.js";

import { protect } from "../middleware/customAuthMiddleware.js";
import * as productController from "../controllers/productController.js";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/my", protect, productController.getMyProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  protect,
  upload.single("image"),
  productController.createProduct,
);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  productController.updateProduct,
);
router.delete("/:id", protect, productController.deleteProduct);

export default router;
