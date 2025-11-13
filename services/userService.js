import User from "../models/user.js";

// تسجيل مستخدم جديد
const registerUser = async (name, email, password, role) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    role: role || "customer",
  });
  return user;
};

// تسجيل دخول مستخدم
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return user;
  } else {
    throw new Error("Invalid email or password");
  }
};

// الحصول على مستخدم حسب ID
const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (user) return user;
  throw new Error("User not found");
};

// تغيير كلمة المرور
const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword;
    await user.save();
    return user;
  } else {
    throw new Error("Invalid old password");
  }
};

// تحديث بيانات مستخدم
const updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  Object.keys(updateData).forEach((key) => {
    if (key !== "password") user[key] = updateData[key];
  });

  await user.save();
  return user;
};

// حذف مستخدم
const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  await user.remove();
  return { message: "User deleted successfully" };
};

// جلب كل المستخدمين
const getAllUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};

export default {
  registerUser,
  loginUser,
  getUserById,
  changePassword,
  updateUser,
  deleteUser,
  getAllUsers,
};