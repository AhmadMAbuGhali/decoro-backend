import privacyService from "./privacy.service.js";

export const getAllPrivacy = async (req, res) => {
  const items = await privacyService.getAll();
  res.json(items);
};

export const getPrivacyById = async (req, res) => {
  const item = await privacyService.getById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
};

export const getPrivacyByLang = async (req, res) => {
  const { lang } = req.params;
  const item = await privacyService.getByLanguage(lang);
  if (!item) return res.status(404).json({ message: "No policy for this language" });
  res.json(item);
};

export const createPrivacy = async (req, res) => {
  const item = await privacyService.create(req.body);
  res.status(201).json(item);
};

export const updatePrivacy = async (req, res) => {
  const item = await privacyService.update(req.params.id, req.body);
  res.json(item);
};

export const deletePrivacy = async (req, res) => {
  const item = await privacyService.remove(req.params.id);
  res.json({ success: true, item });
};