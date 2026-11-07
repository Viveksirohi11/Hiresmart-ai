import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Lightbulb, MessageSquareText, ArrowLeft } from "lucide-react";
import api from "../services/api";
import ScoreCard from "../components/ScoreCard";

function ListCard({title, items, icon: Icon, tone="violet"}) {
  const styles = {green:"bg-emerald-50 text-emerald-700",red:"bg-rose-50 text-rose-700",violet:"bg-violet-50 text-violet-700",blue:"bg-blue-50 text-blue-700"};
  return <section className="card p-5"><h3 className="font-bold flex items-center gap-2 mb-4"><span className={`p-2 rounded-lg ${styles[tone]}`}><Icon size={17}/></span>{title}</h3>{items?.length ? <ul className="space-y-3">{items.map((item,i)=><li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-violet-500">•</span>{item}</li>)}</ul> : <p className="text-sm text-slate-400">No items returned.</p>}</section>;
}
export default function Result() {
  const { id } = useParams();
  const [a,setA] = useState(null); const [error,setError] = useState("");
  useEffect(()=>{api.get(`/api/analysis/${id}`).then(r=>setA(r.data.analysis)).catch(e=>setError(e.response?.data?.message || "Could not load analysis."));},[id]);
  if(error) return <div>{error}<p><Link className="text-violet-700" to="/">Return to dashboard</Link></p></div>;
  if(!a) return <p>Loading analysis...</p>;
  return <div>
    <Link to="/history" className="text-sm text-violet-700 font-semibold inline-flex gap-2 items-center mb-5"><ArrowLeft size={16}/> Back to history</Link>
    <p className="text-sm text-violet-700 font-semibold">ANALYSIS REPORT</p><h1 className="text-3xl font-bold mt-1">{a.jobTitle}</h1><p className="text-sm text-slate-500 mt-2 mb-7">Created {new Date(a.createdAt).toLocaleString()}</p>
    <div className="grid lg:grid-cols-[300px_1fr] gap-5 mb-5"><ScoreCard score={a.matchScore}/><div className="card p-6"><h2 className="font-bold text-lg mb-3">AI summary</h2><p className="text-slate-600 leading-7">{a.summary || "No summary provided."}</p><div className="mt-5 p-3 rounded-xl bg-amber-50 text-amber-800 text-xs">This is an approximate AI-generated fit estimate, not an ATS score, hiring probability or guarantee. Review the evidence and verify suggestions.</div></div></div>
    <div className="grid md:grid-cols-2 gap-5 mb-5"><ListCard title="Matched skills" items={a.matchedSkills} icon={CheckCircle2} tone="green"/><ListCard title="Skills to develop / not evidenced" items={a.missingSkills} icon={AlertCircle} tone="red"/><ListCard title="Strengths" items={a.strengths} icon={CheckCircle2} tone="blue"/><ListCard title="Areas to improve" items={a.weaknesses} icon={AlertCircle} tone="red"/><ListCard title="Actionable suggestions" items={a.suggestions} icon={Lightbulb} tone="violet"/><ListCard title="Interview practice questions" items={a.interviewQuestions} icon={MessageSquareText} tone="blue"/></div>
  </div>;
}
