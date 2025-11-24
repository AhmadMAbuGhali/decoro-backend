import waService from "./wa.service.js";

export const sendCode = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const result = await waService.sendCode(phone);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyCode = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    const result = await waService.verifyCode(phone, code);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};