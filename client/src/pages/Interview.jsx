import { useState } from "react";
import api from "../api/axios";
import { useContext } from "react";
import {AuthContext} from "../context/AuthContext";
function Interview() {

  const [role, setRole] = useState("");
  const [questionCount,setQuestionCount]=useState(5);
  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState({});

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const generateInterviewQuestions = async () => {

    if (!role) {

      alert("Please enter the role");

      return;

    }

    try {

      setLoading(true);

      const response = await api.post(
        "/api/interview/generate",
        {
          role,
          questionCount
        }
      );

      setQuestions(response.data.questions);

      setResult(null);

    } catch (error) {

      console.log(error);
      alert(
        error.response?.data?.message ||
          "Something went wrong while generating questions. Please try again."
      );
    } finally {

      setLoading(false);

    }

  };

  const evaluateInterview = async () => {

    if (!user?.id) {

      alert("Your session has expired. Please log in again.");

      return;

    }

    try {

      setLoading(true);

      const response = await api.post(
        "/api/interview/evaluate",
        {
          role,
          questions,
          answers,
          name:user?.name,
        }
      );

      setResult(response.data.result);

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while evaluating your answers. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          AI Interview Simulator
        </h1>

        <input
          type="text"
          placeholder="Enter Role (e.g. MERN Developer)"
          className="w-full border p-3 rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <select 
          value={questionCount}
          onChange={(e)=>setQuestionCount(Number(e.target.value))}
          className="w-full border rounded-lg p-2"
        >
          <option value={1}>1 question</option>
          <option value={5}>5 question</option>
          <option value={10}>10 question</option>
          <option value={15}>15 question</option>
          <option value={20}>20 question</option>
        </select>
        <button
          onClick={generateInterviewQuestions}
          disabled={loading}
          className="bg-black text-white w-full py-3 rounded-lg mt-5"
        >
          {loading ? "Generating..." : "Start Interview"}
        </button>

        {questions.length > 0 && (

          <div className="mt-8">

            <h2 className="text-2xl font-bold mb-5">
              Interview Questions
            </h2>

            <div className="space-y-5">

              {questions.map((question, index) => (

                <div
                  key={index}
                  className="bg-gray-100 p-5 rounded-xl"
                >

                  <h3 className="font-bold text-lg mb-2">
                    Question {index + 1}
                  </h3>

                  <p className="text-gray-700">
                    {question}
                  </p>

                  <textarea
                    placeholder="Type your answer here..."
                    className="w-full border p-3 rounded-lg mt-4"
                    rows={4}
                    value={answers[index] || ""}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [index]: e.target.value,
                      })
                    }
                  />

                </div>

              ))}

            </div>

            <button
              onClick={evaluateInterview}
              disabled={loading}
              className="bg-green-600 text-white w-full py-3 rounded-lg mt-6"
            >
              {loading ? "Evaluating..." : "Submit Answers"}
            </button>

            {result && (

              <div className="mt-8 bg-white p-6 rounded-xl shadow">

                <h2 className="text-3xl font-bold mb-4">
                  Interview Result
                </h2>

                <div className="bg-black text-white p-5 rounded-xl text-center">

                  <h3 className="text-2xl font-bold">
                    Score
                  </h3>

                  <p className="text-5xl mt-3 font-bold">
                    {result.score}
                  </p>

                </div>
                <p className="mt-2 text-gray-600 text-center">
                  Total Questions: {questions.length}
                </p>
                <div className="mt-6">

                  <h3 className="text-2xl font-bold mb-4">
                    Feedback
                  </h3>

                  <div className="space-y-4">

                    {result.feedback.map((item, index) => (

                      <div
                        key={index}
                        className="bg-gray-100 p-4 rounded-lg"
                      >

                        • {item}

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );
}

export default Interview;