
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const AdminPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [formData, setFormData] = useState({
    product_name: "",
    product_price: "",
    discount: "",
    description: "",
  });
  const [productImage, setProductImage] = useState<string | null>(null); // Change to store base64 string
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
        setProductImage(null);
        return;
      }

      if (file.size > maxSize) {
        setMessage("File size exceeds 2MB. Please upload a smaller file.");
        setIsError(true);
        setProductImage(null);
        return;
      }

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string); // Set base64 string
        setMessage("");
      };
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ensure all required fields are filled
    if (
      !formData.product_name ||
      !formData.product_price ||
      !formData.discount ||
      !formData.description ||
      !productImage
    ) {
      setMessage("All fields are required, including a product image.");
      setIsError(true);
      return;
    }

    setIsLoading(true);

    // Create form data
    const data = new FormData();
    data.append("product_name", formData.product_name);
    data.append("product_price", formData.product_price);
    data.append("discount", formData.discount);
    data.append("description", formData.description);
    if (productImage) {
      data.append("product_image", productImage); // Append base64 string
    }

    try {
      const response = await axios.post("http://localhost:8000/api/add-product/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Product added:", response.data);
      setMessage("Product added successfully!");
      setIsError(false);

      // Reset form fields
      setFormData({
        product_name: "",
        product_price: "",
        discount: "",
        description: "",
      });
      setProductImage(null);
    } catch (error) {
      console.error(error);
      setMessage("Error adding product. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")} // Navigate to home page
          className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Back to Home
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">Admin Page - Add Product</h1>

        {/* Success or Error Message */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg text-center ${
              isError ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Product Price</label>
            <input
              type="number"
              name="product_price"
              value={formData.product_price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter product price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter discount percentage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter product description"
              rows={4}
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 text-white rounded-lg font-semibold transition duration-300 ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
