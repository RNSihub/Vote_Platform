import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard: React.FC = () => {
  const [formData, setFormData] = useState({
    candidate_name: "",
    candidate_age: "",
    description: "",
  });
  const [candidateImage, setCandidateImage] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch candidates when the component loads
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get-candidates/");
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setMessage("Failed to fetch candidates.");
      setIsError(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        setMessage("Invalid file type. Only JPEG and PNG are allowed.");
        setIsError(true);
        setCandidateImage(null);
        return;
      }

      if (file.size > maxSize) {
        setMessage("File size exceeds 2MB. Please upload a smaller file.");
        setIsError(true);
        setCandidateImage(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCandidateImage(reader.result as string);
        setMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.candidate_name || !formData.candidate_age || !formData.description || !candidateImage) {
      setMessage("All fields are required, including a candidate image.");
      setIsError(true);
      return;
    }

    setIsLoading(true);

    const data = {
      ...formData,
      candidate_image: candidateImage, // Pass base64 image directly
    };

    try {
      const response = await axios.post("http://localhost:8000/api/add-candidate/", data, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Candidate added successfully!");
      setIsError(false);

      // Add the new candidate to the list
      setCandidates([...candidates, response.data]);

      setFormData({
        candidate_name: "",
        candidate_age: "",
        description: "",
      });
      setCandidateImage(null);
    } catch (error) {
      console.error("Error adding candidate:", error);
      setMessage("Error adding candidate. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Add Candidate</h2>

          {message && (
            <div
              className={`mb-4 rounded-md p-3 text-center ${
                isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="candidate_name" className="block text-sm font-medium text-gray-700">
                Candidate Name
              </label>
              <input
                type="text"
                id="candidate_name"
                name="candidate_name"
                value={formData.candidate_name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter candidate name"
              />
            </div>

            <div>
              <label htmlFor="candidate_image" className="block text-sm font-medium text-gray-700">
                Candidate Image
              </label>
              <input
                type="file"
                id="candidate_image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="candidate_age" className="block text-sm font-medium text-gray-700">
                Candidate Age
              </label>
              <input
                type="number"
                id="candidate_age"
                name="candidate_age"
                value={formData.candidate_age}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter candidate age"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter candidate description"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white rounded-md font-semibold bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Adding Candidate..." : "Add Candidate"}
            </button>
          </form>
        </div>

        {/* Candidate List Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Candidates</h2>

          {candidates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="p-4 border border-gray-300 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold">{candidate.candidate_name}</h3>
                  <p className="text-gray-700">Age: {candidate.candidate_age}</p>
                  <p className="text-gray-700">{candidate.description}</p>
                  {candidate.candidate_image && (
                    <img
                      src={`data:image/jpeg;base64,${candidate.candidate_image}`}
                      alt={candidate.candidate_name}
                      className="mt-4 w-full h-40 object-cover rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No candidates available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
