
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { CircularProgress } from '@mui/material';

interface Product {
  _id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  description: string;
  discount: number;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products/");
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 via-blue-800 to-black text-white">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-bold text-center mb-6">Welcome to Our AMAZON</h1>
        <p className="text-lg text-center mb-8">
          This is an example of a home page with a header and footer.
        </p>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress color="inherit" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white text-black rounded-lg shadow-lg overflow-hidden">
                <img
                  src={`data:image/jpeg;base64,${product.product_image}`}
                  alt={product.product_name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-2xl font-bold">{product.product_name}</h2>
                  <p className="text-lg text-gray-700 mt-2">{product.description}</p>
                  <p className="text-xl font-semibold text-blue-600 mt-4">${product.product_price}</p>
                  <p className="text-xl font-semibold text-red-600 mt-4">Discount is : ${product.discount}</p>
                  <button className="bg-blue-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white mt-4">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;