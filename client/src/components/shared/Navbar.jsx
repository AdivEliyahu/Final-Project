import React from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
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
      <div className="logo" onClick={() => nav("/")}>
        Anonify
      </div>
      <ul className="nav-links">
        <li>
          <Link className="link" to="/">
            Anonymizer
          </Link>
        </li>
        <li>
          <Link className="link" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="link" to="/">
            About
          </Link>
        </li>
        <li>
          <Link className="link" to="/">
            F.A.Q
          </Link>
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
