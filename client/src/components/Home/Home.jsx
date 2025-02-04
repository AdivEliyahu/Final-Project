import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const response = axios
      .get("http://localhost:8000/test")
      .then((response) => {
        if (response.status === 200) {
          setMessage(`Connect to Server`);
        }
      });
  }, []);

  return <div>{message}</div>;
}

export default Home;
