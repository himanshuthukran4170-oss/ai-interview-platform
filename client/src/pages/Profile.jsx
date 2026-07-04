import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Profile() {

  const { user } = useContext(AuthContext);

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

    } catch (error) {

      console.log(error);

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

      </div>

    </div>

  );
}

export default Profile;