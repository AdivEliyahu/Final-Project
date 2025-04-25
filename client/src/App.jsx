import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import UserSettings from "./components/UserManagement/UserSettings/UserSettings";
import Register from "./components/Auth/Register/Register";
import ProtectedRoute from "./context/ProtectedRoute";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import Anonymizer from "./components/Anonymizer/Anonymizer";
import "./App.css";

const App = () => {
  return (
    <div className="page">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/anonymizer" element={<Anonymizer />} />
          <Route
            path="/settings"
            element={<ProtectedRoute element={<UserSettings />} />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
