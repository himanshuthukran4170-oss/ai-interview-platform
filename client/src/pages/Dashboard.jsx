import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function Dashboard() {
  const {user,logout}=useContext(AuthContext);
  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="flex items-center justify-between mb-10">

      <div>

        <h1 className="text-4xl font-bold">
          AI Interview Preparation Platform
        </h1>

        <p className="text-gray-600 mt-2">
          Welcome, {user?.name}
        </p>

      </div>

      <button
        onClick={() => {

          logout();

          window.location.href = "/login";

        }}
        className="bg-red-500 text-white px-5 py-2 rounded-lg"
      >
        Logout
      </button>

      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        onClick={() => navigate("/profile")}
        className="bg-white p-10 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition"
      >

        <h2 className="text-2xl font-bold mb-3">
          Profile
        </h2>

        <p className="text-gray-600">
          View your analytics and performance.
        </p>

      </div>
        <div
          onClick={() => navigate("/resume-analyzer")}
          className="bg-white p-10 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition"
        >

          <h2 className="text-2xl font-bold mb-3">
            Resume Analyzer
          </h2>

          <p className="text-gray-600">
            Analyze your resume using AI and improve ATS score.
          </p>

        </div>

        <div
          onClick={() => navigate("/interview")}
          className="bg-white p-10 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition"
        >

          <h2 className="text-2xl font-bold mb-3">
            AI Interview Simulator
          </h2>

          <p className="text-gray-600">
            Practice AI-generated interview questions.
          </p>

        </div>

        <div
          onClick={() => navigate("/history")}
          className="bg-white p-10 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition"
        >

          <h2 className="text-2xl font-bold mb-3">
            Interview History
          </h2>

          <p className="text-gray-600">
            View previous interview attempts and scores.
          </p>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;