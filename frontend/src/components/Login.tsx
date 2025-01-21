import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import '../index.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login/", formData);
      console.log(response.data);
      // Assuming response contains the user data with role
      if (response.status === 200) {
        const { role } = response.data; // Get the role from response

        // Redirect based on role
        if (role === "admin") {
          navigate("/adminhome"); // Admin page
        } else {
          navigate("/home"); // User page
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-900">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8 animate-fade-in">
          Welcome Back
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 font-medium hover:underline"
            >
              Signup
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
