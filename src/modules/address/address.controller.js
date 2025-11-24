import addressService from "./address.service.js";

export const createAddress = async (req, res) => {
  const address = await addressService.createAddress(req.user._id, req.body);
  res.status(201).json(address);
};

export const getAddresses = async (req, res) => {
  const list = await addressService.getAddresses(req.user._id);
  res.json(list);
};

export const setDefaultAddress = async (req, res) => {
  const updated = await addressService.setDefault(req.user._id, req.params.id);
  res.json(updated);
};

export const deleteAddress = async (req, res) => {
  await addressService.deleteAddress(req.user._id, req.params.id);
  res.json({ message: "Address deleted" });
};
