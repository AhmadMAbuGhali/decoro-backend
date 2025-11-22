// src/modules/users/user.controller.js

import asyncHandler from "express-async-handler";
import userService from "./user.service.js";

class UserController {
  
  create = asyncHandler(async (req, res) => {
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  });

  getAll = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
  });

  getById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  });

  update = asyncHandler(async (req, res) => {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.json(updated);
  });

  delete = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  });

  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const result = await userService.changePassword(
      req.user._id,
      oldPassword,
      newPassword
    );

    res.json(result);
  });
}

export default new UserController();