import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
  jobTitle: { type: String, required: true, maxlength: 120 },
  jobDescription: { type: String, required: true, maxlength: 12000 },
  matchScore: { type: Number, required: true, min: 0, max: 100 },
  matchedSkills: [String],
  missingSkills: [String],
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  interviewQuestions: [String],
  summary: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Analysis", analysisSchema);
