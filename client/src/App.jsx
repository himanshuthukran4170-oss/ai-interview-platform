import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Interview from "./pages/Interview";
import ProtectedRoute from "./components/ProtectedRoute";
import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";
function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />
      <Route
        path="interview"
        element={
          <ProtectedRoute>
            <Interview/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

    </Routes>

  );
}

export default App;