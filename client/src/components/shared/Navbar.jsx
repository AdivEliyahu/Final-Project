import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleNav = (path) => {
    setMenuOpen(false);
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
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen, menuRef]);

  return (
    <nav className="flex items-center justify-between p-4 bg-[#006d77] text-white relative">
      {/* Logo */}
      <div
        onClick={() => nav("/")}
        className="text-2xl font-bold cursor-pointer"
      >
        Anonify
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6 text-base font-medium absolute left-1/2 transform -translate-x-1/2">
        <li>
          <Link to="/anonymizer" className="hover:text-[#83c5be] transition">
            Anonymizer
          </Link>
        </li>
        <li>
          <Link to="/" className="hover:text-[#83c5be] transition">
            Home
          </Link>
        </li>
        <li>
          <Link to="/" className="hover:text-[#83c5be] transition">
            About
          </Link>
        </li>
        {user && (
          <li>
            <Link
              to="/saved-documents"
              className="hover:text-[#83c5be] transition"
            >
              Saved Documents
            </Link>
          </li>
        )}
      </ul>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <button
            onClick={logoutUser}
            className="px-6 py-2 rounded-full border-2 bg-[#b5e8ed] font-semibold text-[#006d77] hover:bg-[#39b1bc] hover:text-white   transition-all duration-200"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => handleNav("/login")}
              className="px-6 py-2 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-[#006d77] transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => handleNav("/register")}
              className="px-6 py-2 rounded-full border-2 bg-[#b5e8ed] font-semibold text-[#006d77] hover:bg-[#39b1bc] hover:text-white   transition-all duration-200"
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl focus:outline-none transition-transform duration-200"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`absolute top-full left-0 w-full bg-[#006d77] text-white flex flex-col items-center gap-4 py-6 shadow-lg z-50 transform transition-all duration-300 origin-top ${
          menuOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <Link to="/anonymizer" onClick={() => handleNav("/anonymizer")}>
          Anonymizer
        </Link>
        <Link to="/" onClick={() => handleNav("/")}>
          Home
        </Link>
        <Link to="/" onClick={() => handleNav("/")}>
          About
        </Link>
        <Link to="/" onClick={() => handleNav("/")}>
          F.A.Q
        </Link>

        {/* Mobile Auth Buttons */}
        {user ? (
          <button
            onClick={logoutUser}
            className="px-4 py-2 rounded-full bg-[#83c5be] hover:bg-[#3c7a76] transition font-semibold text-white"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => handleNav("/login")}
              className="px-4 py-2 rounded-full border border-white hover:bg-white hover:text-[#006d77] transition font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => handleNav("/register")}
              className="px-4 py-2 rounded-full bg-[#83c5be] hover:bg-[#3c7a76] transition font-semibold text-white"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
