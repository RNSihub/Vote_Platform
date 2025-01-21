
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const AdminPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [formData, setFormData] = useState({
    candidate_name: "",
    candidate_age: "",
    description: "",
  });
  const [candidateImage, setcandidateImage] = useState<string | null>(null); // Change to store base64 string
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        setcandidateImage(null);
        return;
      }

      if (file.size > maxSize) {
        setMessage("File size exceeds 2MB. Please upload a smaller file.");
        setIsError(true);
        setcandidateImage(null);
        return;
      }

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setcandidateImage(reader.result as string); // Set base64 string
        setMessage("");
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ensure all required fields are filled
    if (
      !formData.candidate_name ||
      !formData.candidate_age ||
      !formData.description ||
      !candidateImage
    ) {
      setMessage("All fields are required, including a candidate image.");
      setIsError(true);
      return;
    }

    setIsLoading(true);

    // Create form data
    const data = new FormData();
    data.append("candidate_name", formData.candidate_name);
    data.append("candidate_age", formData.candidate_age);
    data.append("description", formData.description);
    if (candidateImage) {
      data.append("candidate_image", candidateImage); // Append base64 string
    }

    try {
      const response = await axios.post("http://localhost:8000/api/add-candidate/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("candidate added:", response.data);
      setMessage("candidate added successfully!");
      setIsError(false);

      // Reset form fields
      setFormData({
        candidate_name: "",
        candidate_age: "",
        description: "",
      });
      setcandidateImage(null);
    } catch (error) {
      console.error(error);
      setMessage("Error adding candidate. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto py-16">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Add Candidate</h1>

          {message && (
            <div
              className={`mb-4 text-center rounded-md p-3 ${
                isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
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
              {isLoading ? 'Adding candidate...' : 'Add candidate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


export default AdminPage;
