import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginOptions from "./components/Auth/LoginOptions";
import LoginForm from "./components/Auth/LoginForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HRDashboard from "./pages/hr/HRDashboard";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginOptions />} />
        <Route
          path="/login/:role"
          element={
            <div className="fullscreen-container">
              <LoginForm />
            </div>
          }
        />

        {/* ---------- DASHBOARDS ---------- */}
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        <Route path="/hr/dashboard/*" element={<HRDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
