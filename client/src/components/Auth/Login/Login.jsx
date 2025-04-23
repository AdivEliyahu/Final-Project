import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import { UserContext } from "../../../context/UserContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);

  const { user, setUser } = useContext(UserContext);
  const nav = useNavigate();

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
          localStorage.setItem("accessToken", response.data.access);
          localStorage.setItem("refreshToken", response.data.refresh);

          setUser(response.data.user);

          nav("/settings"); // Change that later - just for debug
        } else {
          console.log(`Status:${response.status}: Wrong`);
        }
      })
      .catch((error) => {
        console.log("Error ", error);
      });
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="logo-section">
          <img src="/assets/Anonify_Logo.png" alt="Logo" className="logo-img" />
        </div>
        <div className="form-wrapper">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className="input-fields">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
          <p className="footer-text">
            Don't have an account?{" "}
            <a href="/register" className="link">
              Sign up
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
