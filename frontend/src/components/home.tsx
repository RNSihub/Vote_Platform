import React, { useEffect, useState } from "react";
import axios from "axios";

interface Candidate {
  _id: string;
  candidate_name: string;
  candidate_age: number;
  candidate_image: string;
  description: string;
  elector_count: number;
}

const Home: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    // Fetch candidates from the backend
    axios
      .get("http://localhost:8000/api/candidates/")
      .then((response) => {
        setCandidates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
      });
  }, []);

  const handleSelectCandidate = (id: string) => {
    // Update elector count locally for immediate feedback
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate._id === id
          ? { ...candidate, elector_count: candidate.elector_count + 1 }
          : candidate
      )
    );

    // Optionally, update elector count on the backend
    axios
      .post(`http://localhost:8000/api/candidates/${id}/vote/`)
      .catch((error) => console.error("Error updating elector count:", error));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-black to-gray-900 text-white">
      <div className="container mx-auto py-16 px-8">
        <h1 className="text-5xl font-extrabold text-center mb-10 tracking-wide">
          🌟 Vote for Your Favorite Candidate 🌟
        </h1>
        <p className="text-center text-lg text-gray-400 mb-12">
          Make your voice count by voting for a candidate. Watch their elector
          count increase in real time!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-gradient-to-tr from-gray-800 via-gray-700 to-gray-600 rounded-3xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105"
            >
              <div className="relative">
                <img
                  src={`data:image/jpeg;base64,${candidate.candidate_image}`}
                  alt={candidate.candidate_name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
                  <h2 className="text-3xl font-bold">{candidate.candidate_name}</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 italic mb-4">
                  "{candidate.description}"
                </p>
                <p className="text-xl font-medium text-yellow-400">
                  Age: {candidate.candidate_age} years
                </p>
                
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => handleSelectCandidate(candidate._id)}
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all"
                  >
                    Vote for {candidate.candidate_name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
