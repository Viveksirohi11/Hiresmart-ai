import pdf from "pdf-parse";

export async function extractPdfText(buffer) {
  const parsed = await pdf(buffer);
  const text = (parsed.text || "").replace(/\s+/g, " ").trim();
  if (text.length < 80) {
    throw new Error("Could not extract enough readable text. Please upload a text-based PDF, not a scanned image.");
  }
  return text.slice(0, 30000);
}

export function extractSimpleSkills(text) {
  const known = ["javascript","typescript","react","node.js","express","mongodb","sql","python","java",
    "c++","solidity","rust","aws","docker","kubernetes","git","rest api","html","css","next.js",
    "hardhat","ethereum","anchor","redis","postgresql","machine learning"];
  const lower = text.toLowerCase();
  return known.filter(skill => lower.includes(skill));
}
