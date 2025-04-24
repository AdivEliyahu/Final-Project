import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import "./Register.css";
import { UserContext } from "../../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);

  const { setUser } = useContext(UserContext);
  const nav = useNavigate();
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
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            setUser(response.data.user);
            notify("Registration successful!", "success");
            nav("/login"); // Change that later - just for debug
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
    <div className="page">
      <ToastContainer />
      <main className="main-content">
        <div className="signup-container">
          <div className="logo-section">
            <img
              src="/assets/Anonify_Logo.png"
              alt="Logo"
              className="logo-img"
            />
          </div>
          <div className="form-section">
            <h1 className="title-create-account">Create an Account</h1>
            <p className="p-terms-of-service">
              By signing up, you agree to the Terms of Service.
            </p>
            <form className="signup-form">
              <span className="indicator-field">E-MAIL</span>
              <div className="email-field">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <span className="indicator-field">PASSWORD</span>

              <div className="password-fields">
                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Repeat Password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </div>
              <div className="submission-field">
                <button
                  className="submit-button"
                  onClick={(e) => handleSubmit(e)}
                >
                  Sign Up
                </button>
                <span className="or-text">or</span>
                <div className="social-icons">
                  <a href="#">G+</a>
                  <a href="#">f</a>
                  <a href="#">t</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
