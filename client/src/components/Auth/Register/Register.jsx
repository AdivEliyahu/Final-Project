import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import "./Register.css";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import { UserContext } from "../../../context/UserContext";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);
  const [error, setError] = useState("");

  const { setUser } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/csrf", { withCredentials: true })
      .then(() => setCsrfToken(Cookies.get("csrftoken")))
      .catch((error) => console.log("Error fetching CSRF token:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (password !== confirmPassword) {
      setConfirmPassword("");
      setPassword("");
      setError("Passwords do not match.");
    } else if (password.length < 3) {
      setPassword("");
      setConfirmPassword("");
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
          if (response.status === 201) {
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            setUser(response.data.user);
            nav("/settings"); // Change that later - just for debug
          } else {
            console.log(`Status:${response.status}: Registration failed`);
          }
        })
        .catch((error) => {
          console.log("Error ", error);
        });
    }
  };

  const handleFullNameChange = (e) => {
    const value = e.target.value;
    // Allow only letters and spaces
    if (/^[A-Za-z\s]*$/.test(value)) {
      //setFullName(value);
    }
  };

  return (
    <div className="page">
      <Navbar />
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
      <Footer />
    </div>
  );
}
