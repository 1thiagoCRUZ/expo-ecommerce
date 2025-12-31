export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getAllCustomers() {
    return this.userRepository.findAll();
  }

  addAddress(user, addressData) {
    if (addressData.isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    user.addresses.push({
      ...addressData,
      isDefault: addressData.isDefault || false,
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

  addToWishlist(user, productId) {
    if (user.wishlist.includes(productId)) {
      throw new Error("PRODUCT_ALREADY_IN_WISHLIST");
    }

    user.wishlist.push(productId);
    return this.userRepository.save(user);
  }

  removeFromWishlist(user, productId) {
    if (!user.wishlist.includes(productId)) {
      throw new Error("PRODUCT_NOT_IN_WISHLIST");
    }

    user.wishlist.pull(productId);
    return this.userRepository.save(user);
  }
}
