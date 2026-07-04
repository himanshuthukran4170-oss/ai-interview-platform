import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function InterviewHistory() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/api/interview/history");

        setHistory(response.data.interviews);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8">
        Interview History
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-3">
            No interviews yet
          </h2>

          <p className="text-gray-500 mb-6">
            Start your first mock interview to see your history here.
          </p>

          <button
            onClick={() => navigate("/interview")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Start Interview
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {history.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h2 className="text-2xl font-bold">
                {item.role}
              </h2>

              <div className="flex gap-4 mt-3">
                <span className="bg-green-100 px-3 py-1 rounded">
                  Score: {item.score}
                </span>

                <span className="bg-blue-100 px-3 py-1 rounded">
                  Questions: {item.questions.length}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-bold mb-2">
                  Feedback
                </h3>

                <div className="space-y-2">
                  {item.feedback.map((feedback, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-3 rounded-lg"
                    >
                      • {feedback}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-gray-500 mt-4">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewHistory;