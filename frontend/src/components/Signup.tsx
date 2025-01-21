import React, { useState } from "react";
import axios from "axios";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user", // Default role is "user"
  });

  const [message, setMessage] = useState<string>(""); // For storing the popup message
  const [isError, setIsError] = useState<boolean>(false); // To distinguish error and success

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check if the email already exists
      const emailCheckResponse = await axios.get(
        `http://localhost:8000/api/check-email/?email=${formData.email}`
      );

      if (emailCheckResponse.data.exists) {
        setMessage("Email is already in use. Please use a different email.");
        setIsError(true); // Error state for displaying the error message
        return;
      }

      // Proceed with signup if email is unique
      const response = await axios.post("http://localhost:8000/api/signup/", formData);
      console.log(response.data);
      setMessage("Signup successful! Please log in.");
      setIsError(false); // Success state for displaying the success message
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setIsError(true); // Error state for displaying the error message
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-700 via-blue-800 to-black animate-gradient-x">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md transform transition-transform duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-black mb-6 animate-fade-in">
          Signup
        </h2>

        {/* Display success or error message as a popup */}
        {message && (
          <div
            className={`p-4 mb-6 text-white rounded-lg ${
              isError ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Create a password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none transition-colors duration-300"
          >
            Signup
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
