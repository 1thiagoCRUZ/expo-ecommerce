import mongoose from "mongoose";

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    getAllCustomers() {
        return this.userRepository.findAll();
    }
    getAddresses(user) {
        return user.addresses;
    }

    addAddress(user, addressData) {
        const {
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            isDefault,
        } = addressData;

        if (!fullName || !streetAddress || !city || !state || !zipCode) {
            throw new Error("MISSING_REQUIRED_ADDRESS_FIELDS");
        }

        if (isDefault) {
            user.addresses.forEach(addr => (addr.isDefault = false));
        }

        user.addresses.push({
            ...addressData,
            isDefault: isDefault || false,
        });

        return this.userRepository.save(user);
    }


    updateAddress(user, addressId, data) {
        const address = user.addresses.id(addressId);
        if (!address) {
            throw new Error("ADDRESS_NOT_FOUND");
        }

        if (data.isDefault) {
            user.addresses.forEach(addr => (addr.isDefault = false));
        }

        Object.assign(address, data);
        return this.userRepository.save(user);
    }

    deleteAddress(user, addressId) {
        user.addresses.pull(addressId);
        return this.userRepository.save(user);
    }

    async getWishlist(userId) {
        const user = await this.userRepository.findWishlistByUserId(userId);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        return user.wishlist;
    }



    addToWishlist(user, productId) {
        const productObjectId = new mongoose.Types.ObjectId(productId);
        if (user.wishlist.some(id => id.equals(productObjectId))) {
            throw new Error("PRODUCT_ALREADY_IN_WISHLIST");
        }
        user.wishlist.push(productObjectId);
        return this.userRepository.save(user);
    }

    removeFromWishlist(user, productId) {
        const productObjectId = new mongoose.Types.ObjectId(productId);
        if (!user.wishlist.some(id => id.equals(productObjectId))) {
            throw new Error("PRODUCT_NOT_IN_WISHLIST");
        }
        user.wishlist.pull(productObjectId);
        return this.userRepository.save(user);
    }
}
