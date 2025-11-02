// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginOptions from "./components/Auth/LoginOptions";
import LoginForm from "./components/Auth/LoginForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HRDashboard from "./pages/hr/HRDashboard";
import HRTestPage from "./pages/hr/HRTestPage";

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

        {/* ---------- INVITE / REGISTRATION ROUTE ---------- */}
        <Route
          path="/register"
          element={
            <div className="fullscreen-container">
              <LoginForm inviteMode={true} />
            </div>
          }
        />

        {/* ---------- DASHBOARDS ---------- */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/hr/*" element={<HRDashboard />} />

        {/* ---------- TEST PAGE (token/testId) ---------- */}
        <Route path="/hr/test/:testId" element={<HRTestPage />} />
      </Routes>
    </div>
  );
}

export default App;
