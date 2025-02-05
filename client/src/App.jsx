import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import UserSettings from "./components/UserManagement/UserSettings/UserSettings";
import ProtectedRoute from "./context/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/settings"
        element={<ProtectedRoute element={<UserSettings />} />}
      />
    </Routes>
  );
};

export default App;
