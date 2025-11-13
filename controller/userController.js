import asyncHandler from "express-async-handler";
import userService from "../services/userService.js";

// جلب كل المستخدمين
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

// تحديث مستخدم
const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  res.json(updatedUser);
});

// حذف مستخدم
const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.json(result);
});

// جلب مستخدم حسب ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
});

export default { getAllUsers, updateUser, deleteUser, getUserById };