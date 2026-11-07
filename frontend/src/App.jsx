import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Result from "./pages/Result";
import History from "./pages/History";

export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace/> : <Auth mode="login"/>}/>
    <Route path="/register" element={user ? <Navigate to="/" replace/> : <Auth mode="register"/>}/>
    <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/analyze" element={<Analyze/>}/>
      <Route path="/analysis/:id" element={<Result/>}/>
      <Route path="/history" element={<History/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
