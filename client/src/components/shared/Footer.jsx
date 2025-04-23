import React from "react";
import { useNavigate } from "react-router";
import "./Footer.css";

export default function Footer() {
  const nav = useNavigate();

  return (
    <footer className="footer">
      <span>© Anonify - 2025 </span>
      <div className="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms</a>
        <a href="#">G+</a>
        <a href="#">F</a>
        <a href="#">T</a>
      </div>
    </footer>
  );
}
