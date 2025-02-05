import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  //Test to show the jwt decorator is working from auth_views
  useEffect(() => {
    axios
      .get("http://localhost:8000/protected_view", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        setMessage("Not manage to authenticate user");
        console.error(error);
      });
  }, [token]);

  return (
    <div>
      <div>{message}</div>
    </div>
  );
}

export default Home;
