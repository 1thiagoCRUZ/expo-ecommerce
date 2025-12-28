import { Router } from "express";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { createProduct, getAllProducts, updateProduct } from "../controllers/product.controller.js";
import { getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { getAllCustomers } from "../controllers/user.controller.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = Router();

// optimization - DRY (Do not repeat your code)
router.use(protectRoute, adminOnly);

// this above means => before you run this methods just always call protectRoute and adminOnly first
router.post('/products', upload.array("images", 3), createProduct);
router.get('/products', getAllProducts);
router.put('/products/:id', upload.array("images", 3), updateProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/customers", getAllCustomers);

router.get("/stats", getDashboardStats);

export default router;