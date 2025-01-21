import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/home";
import Signup from "./components/Signup";
import Adminhome from "./components/adminhome";



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/adminhome" element={<Adminhome />} />


      </Routes>
    </Router>
  );
};

export default App;
