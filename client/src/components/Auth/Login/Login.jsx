import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);

  const nav = useNavigate();
  const { login } = useAuth();

  const notify = (
    message = "Oh Snap! Something went wrong :(",
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

    axios
      .post(
        "http://localhost:8000/login",
        { email: email, password: password },
        {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          notify("Login successful", "success");
          login(response.data.user, response.data.access);
          nav("/");
        } else {
          console.log(`Status:${response.status}: Wrong`);
        }
      })
      .catch((error) => {
        notify(
          "Incorrect email or password. Please verify your login details.",
          "error"
        );
        console.log("Error ", error);
      });
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
          <h1 className="text-4xl font-bold text-[#f96e2a] mb-6">Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="email"
              placeholder="Email"
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
            <button
              type="submit"
              className="mt-4 bg-[#f96e2a] hover:bg-[#78b3ce] text-white font-semibold px-10 py-3 rounded-full transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm mt-4 text-gray-700">
            Don’t have an account?
            <a
              href="/register"
              className="text-[#f96e2a] font-medium hover:underline ml-1"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
