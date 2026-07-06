import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
function Profile() {

  const { user } = useContext(AuthContext);
  const [scoreHistory,setScoreHistory]=useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    highestScore: 0,
  });

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats = async () => {

    try {

      const response = await api.get("/api/interview/stats");

      setStats(response.data.stats);
      setScoreHistory(response.data.scoreHistory);

    } catch (error) {

      console.log(error);
      alert(
        error.response?.data?.message||
          "something went wrong while loading your stats"
      );
    }

  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-3xl mx-auto">

        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <h1 className="text-4xl font-bold mb-6">
            Profile
          </h1>

          <div className="space-y-3">

            <p>
              <span className="font-bold">
                Name:
              </span>{" "}
              {user?.name}
            </p>

            <p>
              <span className="font-bold">
                Email:
              </span>{" "}
              {user?.email}
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

          <div className="bg-white p-6 rounded-xl shadow text-center">

            <h2 className="text-xl font-bold">
              Total Interviews
            </h2>

            <p className="text-4xl mt-3 font-bold">
              {stats.totalInterviews}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">

            <h2 className="text-xl font-bold">
              Average Score
            </h2>

            <p className="text-4xl mt-3 font-bold">
              {stats.averageScore}
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">

            <h2 className="text-xl font-bold">
              Highest Score
            </h2>

            <p className="text-4xl mt-3 font-bold">
              {stats.highestScore}
            </p>

          </div>

        </div>
        {scoreHistory.length > 0 && (

          <div className="bg-white p-6 rounded-xl shadow mt-8">

            <h2 className="text-2xl font-bold mb-5">
              Score Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <LineChart data={scoreHistory}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis domain={[0, 10]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          )}
      </div>

    </div>

  );
}

export default Profile;