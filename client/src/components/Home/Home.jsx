import "./Home.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");
  const nav = useNavigate();

  // //Test to show the jwt decorator is working from auth_views
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/protected_view", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         setMessage(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       setMessage("Not manage to authenticate user");
  //       nav("/login");
  //       console.error(error);
  //     });
  // }, [token, nav]);

  return (
    <div className="home-container">
      <div className="home-text">
        <h1>You have sensitive files? Censor it!</h1>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum
          consequatur at temporibus est. Similique consequatur ipsum repellat
          ratione explicabo, repellendus cupiditate nostrum, et nisi error
          pariatur voluptates voluptatem impedit quas?
        </p>
        <button
          className="home-cta"
          onClick={() => {
            alert("change to navigate anonymizer");
          }}
        >
          Explore Anonymizer
        </button>
      </div>
      <div className="home-image">
        <img src="/assets/home-image.png" alt="Anonify logo" />
      </div>
    </div>
  );
}

export default Home;
