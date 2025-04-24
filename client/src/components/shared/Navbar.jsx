import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import "./Navbar.css";

export default function Navbar() {
  const { user, setUser, logout } = useAuth();
  const nav = useNavigate();
  const handleNav = (path) => {
    nav(path);
  };

  const notify = (
    message = "Oh Sanp! Something went wrong :(",
    type = "error"
  ) => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const logoutUser = () => {
    notify("You have been logged out successfully", "info");
    logout();
  };

  return (
    <nav className="navbar">
      <div className="logo">Anonify</div>
      <ul className="nav-links">
        <li>
          <a href="#">Anonymizer</a>
        </li>
        <li>
          <a href="#">Features</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">F.A.Q.</a>
        </li>
      </ul>
      <div className="nav-buttons">
        {user ? (
          <button onClick={logoutUser} className="btn-logout">
            Logout
          </button>
        ) : (
          <>
            <button onClick={() => handleNav("/login")} className="btn-outline">
              Login
            </button>
            <button
              onClick={() => handleNav("/register")}
              className="btn-filled"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
