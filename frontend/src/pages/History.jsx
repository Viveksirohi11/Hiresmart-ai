import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
export default function History() {
  const [items,setItems]=useState([]);
  useEffect(()=>{api.get("/api/analysis/history").then(r=>setItems(r.data.analyses)).catch(()=>{});},[]);
  return <div><h1 className="text-3xl font-bold">Analysis history</h1><p className="text-slate-500 mt-2 mb-7">Your recent resume-to-role comparisons.</p><div className="card p-5">
    {!items.length ? <p className="text-slate-500 text-sm py-8 text-center">No analyses yet. <Link to="/analyze" className="text-violet-700 font-semibold">Analyze a resume</Link>.</p> :
    <div className="divide-y">{items.map(x=><div key={x._id} className="py-4 flex flex-wrap justify-between gap-3 items-center"><div><Link to={`/analysis/${x._id}`} className="font-semibold hover:text-violet-700">{x.jobTitle}</Link><p className="text-xs text-slate-500 mt-1">{new Date(x.createdAt).toLocaleString()}</p></div><div className="flex items-center gap-4"><span className="font-bold text-violet-700">{x.matchScore}%</span><Link to={`/analysis/${x._id}`} className="text-sm text-violet-700">View report →</Link></div></div>)}</div>}
  </div></div>;
}
