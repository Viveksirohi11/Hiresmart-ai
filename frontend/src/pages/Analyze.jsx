import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Sparkles } from "lucide-react";
import api from "../services/api";

export default function Analyze() {
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);
  const [resumeId, setResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  async function load() { try { const {data} = await api.get("/api/resumes"); setResumes(data.resumes); } catch {} }
  useEffect(() => { load(); }, []);
  async function upload() {
    if (!file) return setMessage("Choose a PDF file first.");
    const body = new FormData(); body.append("resume", file);
    setBusy(true); setMessage("");
    try { const {data} = await api.post("/api/resumes/upload", body, {headers:{"Content-Type":"multipart/form-data"}}); await load(); setResumeId(data.resume.id); setMessage("Resume uploaded and text extracted."); }
    catch (e) { setMessage(e.response?.data?.message || "Upload failed."); }
    finally { setBusy(false); }
  }
  async function analyze(e) {
    e.preventDefault(); setBusy(true); setMessage("");
    try { const {data} = await api.post("/api/analysis/analyze", {resumeId, jobTitle, jobDescription}); navigate(`/analysis/${data.analysis._id}`); }
    catch (e) { setMessage(e.response?.data?.message || "Analysis failed. Check your API configuration."); }
    finally { setBusy(false); }
  }
  return <div className="max-w-4xl">
    <p className="text-sm text-violet-700 font-semibold">AI ANALYSIS</p><h1 className="text-3xl font-bold mt-1 mb-2">Analyze your resume</h1><p className="text-slate-500 mb-7">Compare one resume with a specific job description.</p>
    <div className="card p-6 mb-5">
      <h2 className="font-bold text-lg mb-4">1. Upload your resume</h2>
      <div className="border-2 border-dashed border-violet-200 bg-violet-50/50 rounded-2xl p-7 text-center">
        <UploadCloud className="mx-auto text-violet-600 mb-2" size={30}/>
        <p className="font-semibold">Choose a PDF resume</p><p className="text-xs text-slate-500 mt-1">Text-based PDF, maximum 5 MB</p>
        <input type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0] || null)} className="block mx-auto mt-4 text-sm max-w-full"/>
        <button type="button" onClick={upload} disabled={busy || !file} className="btn btn-primary mt-4">{busy ? "Working..." : "Upload resume"}</button>
      </div>
      {resumes.length > 0 && <div className="mt-5"><label className="label">Or select an uploaded resume</label><select className="field" value={resumeId} onChange={e=>setResumeId(e.target.value)}><option value="">Select resume</option>{resumes.map(r=><option key={r._id} value={r._id}>{r.fileName}</option>)}</select></div>}
    </div>
    <form onSubmit={analyze} className="card p-6">
      <h2 className="font-bold text-lg mb-4">2. Add the job description</h2>
      <label className="label">Job title<input className="field mt-2 mb-4" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} placeholder="e.g. Junior Full Stack Developer" required/></label>
      <label className="label">Job description<textarea className="field mt-2 min-h-48" value={jobDescription} onChange={e=>setJobDescription(e.target.value)} placeholder="Paste the responsibilities, required skills and qualifications..." minLength={50} maxLength={12000} required/></label>
      <div className="flex justify-between text-xs text-slate-400 mt-2"><span>Minimum 50 characters</span><span>{jobDescription.length}/12000</span></div>
      {message && <p className="text-sm text-amber-700 mt-4">{message}</p>}
      <button disabled={busy || !resumeId || !jobTitle.trim() || jobDescription.trim().length<50} className="btn btn-primary mt-5 flex items-center gap-2"><Sparkles size={17}/>{busy ? "Analyzing..." : "Analyze with AI"}</button>
    </form>
  </div>;
}
