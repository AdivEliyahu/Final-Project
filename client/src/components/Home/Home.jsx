import "./Home.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";

function Home() {
  //const [message, setMessage] = useState("");

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
    <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10 px-6 w-full max-w-6xl mx-auto h-full">
      <div className="text-center md:text-left md:w-1/2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0e5266] mb-6">
          You have sensitive files? Censor it!
        </h1>
        <p className="text-[#374151] text-base md:text-lg mb-6">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum
          consequatur at temporibus est. Similique consequatur ipsum repellat
          ratione explicabo, repellendus cupiditate nostrum, et nisi error
          pariatur voluptates voluptatem impedit quas?
        </p>
        <button
          className="bg-[#ff8450] hover:bg-[#ffa764] text-white font-semibold rounded-full px-6 py-2 transition"
          onClick={() => nav("/anonymizer")}
        >
          Explore Anonymizer
        </button>
      </div>

      <div className="md:w-1/2 flex justify-center bg-[#f3f7fa] p-4 rounded-3xl">
        <img
          src="/assets/home-image.png"
          alt="Anonify logo"
          className="w-full h-auto object-cover rounded-[20px] animate-rotateY"
        />
      </div>
    </div>
  );
}

export default Home;
