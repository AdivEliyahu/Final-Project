import React from "react";
import { useNavigate } from "react-router";
import "./Navbar.css";

export default function Navbar() {
  const nav = useNavigate();

  const handleNav = (path) => {
    nav(path);
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
        <button
          onClick={() => {
            handleNav("/login");
          }}
          className="btn-outline"
        >
          Login
        </button>
        <button
          onClick={() => {
            handleNav("/register");
          }}
          className="btn-filled"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}
