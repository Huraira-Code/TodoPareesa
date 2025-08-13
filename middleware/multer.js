const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Use Vercel's writable /tmp directory
const uploadDir = "/tmp/uploads";

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.mp4', '.webp', '.webm'];
    if (!allowed.includes(ext)) {
      return cb(new Error(`Unsupported file type: ${ext}`), false);
    }
    cb(null, true);
  }
});

module.exports = { upload };
