import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import UserSettings from "./components/UserManagement/UserSettings/UserSettings";
import Register from "./components/Auth/Register/Register";
import ProtectedRoute from "./context/ProtectedRoute";
import About from "./components/About/About";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import Anonymizer from "./components/Anonymizer/Anonymizer";
import SavedDocuments from "./components/SavedDocuments/SavedDocuments";
import { ToastContainer } from "react-toastify";

import "./App.css";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex justify-center items-start">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/anonymizer" element={<Anonymizer />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/settings"
            element={<ProtectedRoute element={<UserSettings />} />}
          />
          <Route
            path="/saved-documents"
            element={<ProtectedRoute element={<SavedDocuments />} />}
          />
        </Routes>
        <ToastContainer />
      </main>
      <Footer />
    </div>
  );
};

export default App;
