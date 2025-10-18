import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import QuestionsList from "./pages/admin/QuestionsList";
import Invites from "./pages/admin/Invites";
import Reports from "./pages/admin/Reports";
import CandidateWelcome from "./pages/candidate/CandidateWelcome.jsx";
import CandidateTest from "./pages/candidate/CandidateTest";
import CandidateReport from "./pages/candidate/CandidateReport";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Home />} />

        {/* Candidate token link (from QR/email) */}
        <Route path="/t/:token" element={<CandidateWelcome />} />
        <Route path="/test" element={<CandidateTest />} />
        <Route path="/report/:assessmentId" element={<CandidateReport />} />

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route
          path="/admin/login"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <AdminLogin />
            </div>
          }
        />

        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Optional: nested admin management pages */}
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute>
              <QuestionsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/invites"
          element={
            <ProtectedRoute>
              <Invites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
