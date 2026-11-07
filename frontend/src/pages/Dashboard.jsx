import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileSearch, TrendingUp, ClipboardList, ArrowRight } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/api/analysis/history").then(r => setItems(r.data.analyses)).catch(() => {}); }, []);
  const avg = items.length ? Math.round(items.reduce((s, x) => s + x.matchScore, 0) / items.length) : 0;
  return <div>
    <div className="flex flex-wrap justify-between gap-4 items-center mb-8">
      <div><p className="text-sm text-violet-700 font-semibold">YOUR WORKSPACE</p><h1 className="text-3xl font-bold mt-1">Hello, {user?.name?.split(" ")[0]} 👋</h1><p className="text-slate-500 mt-2">Compare your experience with the roles you want.</p></div>
      <Link to="/analyze" className="btn btn-primary flex items-center gap-2"><FileSearch size={18}/> Analyze a resume</Link>
    </div>
    <div className="grid sm:grid-cols-3 gap-4 mb-8">
      {[[ClipboardList,"Total analyses",items.length],[TrendingUp,"Average match",`${avg}%`],[FileSearch,"Latest analysis",items[0]?.jobTitle || "—"]].map(([Icon,label,value])=><div className="card p-5" key={label}><div className="flex items-center gap-2 text-slate-500 text-sm"><Icon size={17}/>{label}</div><div className="text-2xl font-bold mt-3">{value}</div></div>)}
    </div>
    <div className="card p-6">
      <div className="flex justify-between items-center mb-5"><h2 className="font-bold text-lg">Recent analyses</h2><Link to="/history" className="text-sm text-violet-700 font-semibold">View all</Link></div>
      {items.length === 0 ? <div className="text-center py-12"><div className="mx-auto mb-3 rounded-2xl bg-violet-50 w-14 h-14 grid place-items-center text-violet-700"><FileSearch/></div><h3 className="font-semibold">No analyses yet</h3><p className="text-sm text-slate-500 mt-1 mb-4">Upload a resume and compare it with a job description.</p><Link to="/analyze" className="text-violet-700 font-semibold text-sm">Start your first analysis <ArrowRight className="inline" size={15}/></Link></div> :
      <div className="divide-y">{items.slice(0,5).map(x=><Link to={`/analysis/${x._id}`} key={x._id} className="py-4 flex justify-between gap-3 items-center"><div><p className="font-semibold">{x.jobTitle}</p><p className="text-xs text-slate-500 mt-1">{new Date(x.createdAt).toLocaleDateString()}</p></div><span className="rounded-full bg-violet-50 text-violet-700 px-3 py-1 font-bold text-sm">{x.matchScore}%</span></Link>)}</div>}
    </div>
    <p className="text-xs text-slate-400 mt-5">HireSmart provides guidance, not hiring decisions. Verify all AI-generated suggestions.</p>
  </div>;
}
