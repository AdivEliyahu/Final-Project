import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/test")
      .then((response) => {
        if (response.status === 200) {
          setMessage(response.data.message);
          console.log(response.data.obj);
        }
      })
      .catch((error) => {
        setMessage("Failed to connect to server");
        console.error(error);
      });
  }, []);

  return (
    <div>
      <pre>{message}</pre>
    </div>
  );
}

export default Home;
