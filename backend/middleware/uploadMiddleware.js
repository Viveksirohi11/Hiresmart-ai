import multer from "multer";

const storage = multer.memoryStorage();
export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf" && file.originalname.toLowerCase().endsWith(".pdf");
    cb(isPdf ? null : new Error("Only PDF resumes are accepted"), isPdf);
  }
}).single("resume");
