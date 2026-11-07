import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";
import { analyzeWithGemini } from "../services/aiService.js";

export async function createAnalysis(req, res, next) {
  try {
    const resumeId = String(req.body.resumeId || "");
    const jobTitle = String(req.body.jobTitle || "").trim();
    const jobDescription = String(req.body.jobDescription || "").trim();
    if (!resumeId || jobTitle.length < 2 || jobDescription.length < 50) {
      return res.status(400).json({ message: "Select a resume, enter a job title and provide a job description (at least 50 characters)." });
    }
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId }).select("+extractedText");
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    const result = await analyzeWithGemini({ resumeText: resume.extractedText, jobTitle, jobDescription });
    const analysis = await Analysis.create({
      userId: req.userId, resumeId: resume.id, jobTitle, jobDescription, ...result
    });
    res.status(201).json({ analysis });
  } catch (err) { next(err); }
}

export async function history(req, res, next) {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .select("jobTitle matchScore matchedSkills missingSkills createdAt")
      .sort({ createdAt: -1 }).limit(50);
    res.json({ analyses });
  } catch (err) { next(err); }
}

export async function getAnalysis(req, res, next) {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.userId });
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    res.json({ analysis });
  } catch (err) { next(err); }
}

export async function deleteAnalysis(req, res, next) {
  try {
    const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    res.json({ message: "Analysis deleted" });
  } catch (err) { next(err); }
}
