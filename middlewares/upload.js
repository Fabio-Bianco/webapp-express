// middlewares/upload.js
import multer from "multer";
import slugify from "slugify";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/movies");
  },
  filename: (req, file, cb) => {
    const name = slugify(file.originalname.split(".")[0], { lower: true, strict: true });
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${name}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });
export default upload;
