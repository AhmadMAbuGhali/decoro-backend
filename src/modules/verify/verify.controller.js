// src/modules/verify/verify.controller.js

import verifyService from "./verify.service.js";

class VerifyController {
  sendCode = async (req, res, next) => {
    try {
      const result = await verifyService.sendCode(req.body.email, req.body.type);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  verify = async (req, res, next) => {
    try {
      const result = await verifyService.verifyCode(
        req.body.email,
        req.body.code,
        req.body.type
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

export default new VerifyController();