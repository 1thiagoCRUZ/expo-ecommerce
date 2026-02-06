import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { createReview, deleteReview } from "../controllers/review.controller";

const router = Router();

router.post("/", protectRoute, createReview);
router.delete("/:reviewId", protectRoute, deleteReview);

export default router;