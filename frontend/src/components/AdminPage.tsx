import React, { useEffect, useState } from "react";
import axios from "axios";

interface Candidate {
  _id: string;
  candidate_name: string;
  candidate_age: number;
  elector_count: number;
}

const AdminPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    // Fetch candidates with vote counts from the backend
    axios
      .get("http://localhost:8000/api/admin/candidates/")
      .then((response) => {
        setCandidates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching candidates for admin:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto py-16 px-8">
        <h1 className="text-5xl font-extrabold text-center mb-10 tracking-wide">
          🗳️ Admin Dashboard - Candidate Votes 🗳️
        </h1>
        <p className="text-center text-lg text-gray-400 mb-12">
          View the total votes each candidate has received.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-gradient-to-tr from-gray-800 via-gray-700 to-gray-600 rounded-3xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">
                  {candidate.candidate_name}
                </h2>
                <p className="text-xl font-medium text-white mb-2">
                  Age: {candidate.candidate_age} years
                </p>
                <p className="text-lg text-gray-300">
                  Total Votes:{" "}
                  <span className="text-yellow-500 font-bold">
                    {candidate.elector_count}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
