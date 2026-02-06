import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { createProduct, getAllProducts, getProductById } from "../controllers/product.controller";

const router = Router();

router.get("/", protectRoute, getAllProducts);
router.get("/:id", protectRoute, getProductById);

export default router;