// src/modules/users/user.service.js

import User from "../../models/user.model.js";
import ApiError from "../../core/errors/ApiError.js";
import bcrypt from "bcryptjs";

class UserService {
  // =====================================================================
  // Create User (admin only)
  // =====================================================================
  async createUser({ name, email, password, role = "customer" }) {
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(400, "User already exists");

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    return this.format(user);
  }

  // =====================================================================
  // Get All Users (admin)
  // =====================================================================
  async getAllUsers() {
    const users = await User.find().select("-password");
    return users;
  }

  // =====================================================================
  // Get user by ID
  // =====================================================================
  async getUserById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  // =====================================================================
  // Update user (admin)
  // =====================================================================
  async updateUser(id, data) {
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    // منع تعديل الباسوورد من هنا
    delete data.password;

    Object.assign(user, data);

    await user.save();
    return this.format(user);
  }

  // =====================================================================
  // Delete user
  // =====================================================================
  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new ApiError(404, "User not found");

    return { message: "User deleted" };
  }

  // =====================================================================
  // Change Password (user)
  // =====================================================================
  async changePassword(userId, oldPass, newPass) {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new ApiError(404, "User not found");

    const match = await user.matchPassword(oldPass);
    if (!match) throw new ApiError(400, "Old password incorrect");

    user.password = newPass;
    await user.save();

    return { message: "Password updated" };
  }

  // =====================================================================
  // Format user object (remove password)
  // =====================================================================
  format(user) {
    const obj = user.toObject();
    delete obj.password;
    return obj;
  }
}

export default new UserService();