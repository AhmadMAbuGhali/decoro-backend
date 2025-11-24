import Address from "../../models/address.model.js";

class AddressService {

  async createAddress(userId, data) {
    if (data.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    return await Address.create({
      user: userId,
      ...data,
    });
  }

  async getAddresses(userId) {
    return await Address.find({ user: userId }).sort({ isDefault: -1 });
  }

  async setDefault(userId, addressId) {
    await Address.updateMany({ user: userId }, { isDefault: false });
    return await Address.findByIdAndUpdate(addressId, { isDefault: true }, { new: true });
  }

  async deleteAddress(userId, addressId) {
    return await Address.findOneAndDelete({ _id: addressId, user: userId });
  }
}

export default new AddressService();