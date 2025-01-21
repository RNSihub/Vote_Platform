// Header.tsx
import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "AMAZON" }) => {
  return (
    <header className="bg-blue-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/home" className="text-white hover:text-blue-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/home" className="text-white hover:text-blue-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/signup" className="text-white hover:text-blue-300">
                Signup
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
