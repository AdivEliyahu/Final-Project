import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import "./Register.css";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);

  const emailRx = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const nav = useNavigate();
  const { login } = useAuth();
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

  useEffect(() => {
    axios
      .get("http://localhost:8000/csrf", { withCredentials: true })
      .then(() => setCsrfToken(Cookies.get("csrftoken")))
      .catch((error) => console.log("Error fetching CSRF token:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setConfirmPassword("");
      setPassword("");
      notify("Passwords do not match.", "error");
    } else if (password.length < 3) {
      setPassword("");
      setConfirmPassword("");
      notify("Password must be at least 3 characters long.", "error");
    } else if (!emailRx.test(email)) {
      notify("Please enter a full e-mail address (e.g. user@example.com)");
    } else {
      axios
        .post(
          "http://localhost:8000/register",
          { email, password },
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(`response: ${response.status}`);
          if (response.status === 201) {
            login(response.data.user, response.data.access);
            notify("Registration successful!", "success");
            nav("/"); // Change that later - just for debug
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            notify("Email already exists.", "error");
          } else {
            console.error("Registration error:", error);
            notify("Registration failed. Please try again.", "error");
          }
        });
    }
  };

  return (
    <div className="flex-grow flex justify-center items-center px-4 py-12 h-full">
      <div className="flex flex-col md:flex-row items-center gap-16 bg-teal-300/5 rounded-3xl shadow-lg p-8 w-full max-w-4xl">
        <img
          src="/assets/Anonify_Logo.png"
          alt="Logo"
          className="h-50 w-50 animate-[rotateY_1s_ease-in-out_infinite_alternate]"
          style={{ transformOrigin: "center" }}
        />

        <div className="w-[25rem] p-8 text-center">
          <h1 className="text-3xl font-bold text-[#f96e2a] mb-2">
            Create an Account
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            By signing up, you agree to the Terms of Service.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="email"
              placeholder="Your email"
              className="w-[80%] px-4 py-3 mb-4 text-base text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f96e2a]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-[80%] px-4 py-3 mb-4 text-base text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f96e2a]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Repeat Password"
              className="w-[80%] px-4 py-3 mb-4 text-base text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f96e2a]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="mt-4 bg-[#f96e2a] hover:bg-[#78b3ce] text-white font-semibold px-10 py-3 rounded-full transition"
            >
              Sign Up
            </button>

            <span className="or-text text-gray-500 text-sm mt-4">or</span>
            <div className="flex justify-center gap-4 mt-2 text-[#f96e2a] text-xl font-bold">
              <a href="#">G+</a>
              <a href="#">f</a>
              <a href="#">t</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
