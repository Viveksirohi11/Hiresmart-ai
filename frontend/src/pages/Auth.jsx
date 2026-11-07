import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const change = e => setForm({...form, [e.target.name]: e.target.value});
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { await login(`/api/auth/${isRegister ? "register" : "login"}`, form); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Something went wrong."); }
    finally { setBusy(false); }
  }
  return <div className="min-h-screen grid place-items-center p-5">
    <form onSubmit={submit} className="card w-full max-w-md p-8">
      <div className="flex items-center gap-2 text-2xl font-bold mb-2"><BrainCircuit className="text-violet-600"/> HireSmart AI</div>
      <h1 className="text-2xl font-bold mt-6">{isRegister ? "Create your account" : "Welcome back"}</h1>
      <p className="text-slate-500 text-sm mt-2 mb-6">Make your next job application more informed.</p>
      {isRegister && <label className="label">Full name<input className="field mt-2 mb-4" name="name" value={form.name} onChange={change} required minLength="2"/></label>}
      <label className="label">Email<input className="field mt-2 mb-4" name="email" type="email" value={form.email} onChange={change} required/></label>
      <label className="label">Password<input className="field mt-2 mb-4" name="password" type="password" value={form.password} onChange={change} required minLength="8"/></label>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <button disabled={busy} className="btn btn-primary w-full">{busy ? "Please wait..." : isRegister ? "Create account" : "Sign in"}</button>
      <p className="text-sm text-center text-slate-500 mt-5">{isRegister ? "Already registered?" : "New to HireSmart?"} <Link className="text-violet-700 font-semibold" to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create account"}</Link></p>
    </form>
  </div>;
}
