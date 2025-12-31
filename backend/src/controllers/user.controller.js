import { UserService } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";

const userService = new UserService(new UserRepository());

export async function getAllCustomers(_, res) {
  try {
    const users = await userService.getAllCustomers();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addAddress(req, res) {
  try {
    await userService.addAddress(req.user, req.body);
    res.status(201).json({ message: "Address added successfully" });
  } catch (err) {
    if (err.message === "MISSING_REQUIRED_ADDRESS_FIELDS") {
      return res.status(400).json({ error: "Missing required address fields" });
    }
    res.status(500).json({ error: "Internal server error" });
  }

}

export async function getAddresses(req, res) {
  try {
    const addresses = await userService.getAddresses(req.user);
    res.status(200).json({ addresses });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateAddress(req, res) {
  try {
    await userService.updateAddress(
      req.user,
      req.params.addressId,
      req.body
    );
    res.status(200).json({ message: "Address updated successfully" });
  } catch (err) {
    if (err.message === "ADDRESS_NOT_FOUND") {
      return res.status(404).json({ error: "Address not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteAddress(req, res) {
  try {
    await userService.deleteAddress(req.user, req.params.addressId);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function addToWishlist(req, res) {
  try {
    await userService.addToWishlist(req.user, req.body.productId);
    res.status(200).json({ message: "Product added to wishlist" });
  } catch (err) {
    if (err.message === "PRODUCT_ALREADY_IN_WISHLIST") {
      return res.status(400).json({ error: "Product already in wishlist" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    await userService.removeFromWishlist(req.user, req.params.productId);
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    if (err.message === "PRODUCT_NOT_IN_WISHLIST") {
      return res.status(400).json({ error: "Product is not in wishlist" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getWishlist(req, res) {
  try {
    const wishlist = await userService.getWishlist(req.user._id);
    res.status(200).json({ wishlist });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

