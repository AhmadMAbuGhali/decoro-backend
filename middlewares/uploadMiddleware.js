// middlewares/uploadMiddleware.js
import multer from "multer";

// اختر التخزين مؤقت على الذاكرة (مناسب للرفع على Cloudinary مباشرة)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // الحد الأقصى 5 ميجا
});

export default upload;