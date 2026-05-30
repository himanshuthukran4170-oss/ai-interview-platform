import { useState, useContext } from "react";
import axios from "axios";
import AnalysisCard from "../components/AnalysisCard";
import { AuthContext } from "../context/AuthContext";

function Home() {

  const { logout, user } = useContext(AuthContext);

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState(null);

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    try {

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/analyze`,
        formData
      );

      setAnalysis(response.data.analysis);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-[500px]">

        <div className="flex justify-end mb-5">

          {/* <button
            onClick={() => {

              logout();

              window.location.href = "/login";

            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button> */}

        </div>

        <p className="text-gray-600 mb-3">
          Welcome, {user?.name}
        </p>

        <h1 className="text-4xl font-bold text-center mb-5">
          AI Resume Analyzer
        </h1>

        <label
          className="border-2 border-dashed border-gray-400 p-8 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
        >

          <p className="text-lg font-semibold">
            Click to Upload Resume
          </p>

          <p className="text-sm text-gray-500 mt-2">
            PDF files only
          </p>

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />

        </label>

        {file && (

          <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg">

            Selected File: {file.name}

          </div>

        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-black text-white px-5 py-2 rounded mt-5 w-full"
        >

          <div className="flex items-center justify-center gap-2">

            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}

            <span>
              {loading ? "Analyzing..." : "Upload Resume"}
            </span>

          </div>

        </button>

        {analysis && (

          <div className="mt-8">

            <div className="bg-black text-white p-5 rounded-xl text-center">

              <h2 className="text-3xl font-bold">
                ATS Score
              </h2>

              <p className="text-5xl mt-3 font-bold">
                {analysis.atsScore}
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

              <AnalysisCard
                title="Strengths"
                items={analysis.strengths}
              />

              <AnalysisCard
                title="Weaknesses"
                items={analysis.weaknesses}
              />

              <AnalysisCard
                title="Missing Skills"
                items={analysis.missingSkills}
              />

              <AnalysisCard
                title="Suggestions"
                items={analysis.suggestions}
              />

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default Home;