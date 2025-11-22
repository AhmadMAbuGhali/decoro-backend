// src/modules/admin/adminUsers.controller.js

import asyncHandler from "express-async-handler";
import adminUsersService from "./adminUsers.service.js";

class AdminUsersController {
  getAll = asyncHandler(async (req, res) => {
    const users = await adminUsersService.getAll();
    res.json(users);
  });

  getById = asyncHandler(async (req, res) => {
    const user = await adminUsersService.getOne(req.params.id);
    res.json(user);
  });

  update = asyncHandler(async (req, res) => {
    const user = await adminUsersService.update(req.params.id, req.body);
    res.json(user);
  });

  delete = asyncHandler(async (req, res) => {
    const result = await adminUsersService.delete(req.params.id);
    res.json(result);
  });

  create = asyncHandler(async (req, res) => {
    const { name, email, role } = req.body;
    const user = await adminUsersService.create(name, email, role);
    res.status(201).json(user);
  });
}

export default new AdminUsersController();