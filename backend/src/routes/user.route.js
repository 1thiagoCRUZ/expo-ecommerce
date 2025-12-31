import { Router } from "express";
import { addAddress, addToWishlist, deleteAddress, getAddresses, getWishlist, removeFromWishlist, updateAddress } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware";

const router = Router();

router.use(protectRoute);

// address routes
router.post("/adresses", addAddress);
router.get("/adresses", getAddresses);
router.put("/adresses/:addressId", updateAddress);
router.delete("/adresses/:addressId", deleteAddress);

// wishlist routes
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);
router.get("/wishlist/", getWishlist);

export default router;