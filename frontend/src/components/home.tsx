import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

interface candidate {
  _id: string;
  candidate_name: string;
  candidate_price: number;
  candidate_image: string;
  description: string;
  discount: number;
}

const Home: React.FC = () => {
  const [candidates, setcandidates] = useState<candidate[]>([]);

  useEffect(() => {
    // Fetch candidates from the backend
    axios
      .get("http://localhost:8000/api/candidates/")
      .then((response) => {
        setcandidates(response.data); // Set candidates to the state
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 via-blue-800 to-black text-white">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-bold text-center mb-6">Welcome to Our AMAZON</h1>
        <p className="text-lg text-center mb-8">
          This is an example of a home page with a header and footer.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-white text-black rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={`data:image/jpeg;base64,${candidate.candidate_image}`}
                alt={candidate.candidate_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold">{candidate.candidate_name}</h2>
                <p className="text-lg text-gray-700 mt-2">{candidate.description}</p>
                <p className="text-xl font-semibold text-blue-600 mt-4">${candidate.candidate_price}</p>
                <p className="text-xl font-semibold text-red-600 mt-4">discount is ${candidate.discount}</p>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white mt-4">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
