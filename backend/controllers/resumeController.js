import Resume from "../models/Resume.js";
import { extractPdfText, extractSimpleSkills } from "../services/pdfService.js";

export async function uploadResume(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "Choose a PDF resume to upload." });
    const text = await extractPdfText(req.file.buffer);
    const resume = await Resume.create({
      userId: req.userId,
      fileName: req.file.originalname.slice(0, 180),
      extractedText: text,
      skills: extractSimpleSkills(text)
    });
    res.status(201).json({
      resume: { id: resume.id, fileName: resume.fileName, skills: resume.skills, createdAt: resume.createdAt }
    });
  } catch (err) { next(err); }
}

export async function listResumes(req, res, next) {
  try {
    const resumes = await Resume.find({ userId: req.userId }).select("fileName skills createdAt").sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (err) { next(err); }
}

export async function deleteResume(req, res, next) {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Resume deleted" });
  } catch (err) { next(err); }
}
