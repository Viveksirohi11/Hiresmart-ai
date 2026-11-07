import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BrainCircuit, LayoutDashboard, FileSearch, History, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    ["/", LayoutDashboard, "Dashboard"],
    ["/analyze", FileSearch, "Analyze resume"],
    ["/history", History, "History"]
  ];
  return <div className="min-h-screen md:flex">
    <aside className="w-full md:w-64 bg-[#171936] text-white md:min-h-screen p-5">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-10"><BrainCircuit className="text-violet-300"/> HireSmart AI</Link>
      <nav className="flex md:flex-col gap-2">
        {links.map(([to, Icon, label]) => <NavLink key={to} to={to} end={to === "/"} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10"}`}><Icon size={18}/>{label}</NavLink>)}
      </nav>
      <div className="mt-8 md:mt-auto md:absolute md:bottom-6 md:w-52">
        <div className="text-sm text-slate-300 mb-3 truncate">{user?.name}</div>
        <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><LogOut size={17}/> Sign out</button>
      </div>
    </aside>
    <main className="flex-1 p-5 md:p-9 max-w-7xl"><Outlet /></main>
  </div>;
}
