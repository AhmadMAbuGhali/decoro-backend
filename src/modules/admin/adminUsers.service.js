// src/modules/admin/adminUsers.service.js

import User from "../../models/user.model.js";
import ApiError from "../../core/errors/ApiError.js";

class AdminUsersService {
  async getAll() {
    return await User.find().select("-password");
  }

  async getOne(id) {
    const user = await User.findById(id).select("-password");
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async update(id, data) {
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    Object.assign(user, data);
    await user.save();
    return user;
  }

  async delete(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new ApiError(404, "User not found");
    return { message: "User deleted" };
  }

  async create(name, email, role = "customer") {
    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(400, "User already exists");

    const user = await User.create({
      name,
      email,
      password: "TempP@55!", // temporary password
      role,
      isVerified: true,
    });

    return user.toObject();
  }
}

export default new AdminUsersService();