import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css";
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

          setUser(response.data.user); // Save the user info in context

          nav("/settings");
        } else {
          console.log(`tatus:${response.status}: Wrong`);
        }
      })
      .catch((error) => {
        console.log("Error ", error);
      });
  };

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="form-wrapper">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
      </motion.div>
    </div>
  );
}
