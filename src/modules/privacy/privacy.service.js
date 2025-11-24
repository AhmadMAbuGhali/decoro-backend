import Privacy from "../../models/privacy.model.js";

class PrivacyService {
  async getAll() {
    return Privacy.find().sort({ createdAt: -1 });
  }

  async getById(id) {
    return Privacy.findById(id);
  }

  async getByLanguage(lang = "en") {
    return Privacy.findOne({ language: lang });
  }

  async create(data) {
    return Privacy.create(data);
  }

  async update(id, data) {
    return Privacy.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id) {
    return Privacy.findByIdAndDelete(id);
  }
}

export default new PrivacyService();