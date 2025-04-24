import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const UserSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!user && accessToken) {
        setIsLoading(true);
        try {
          const response = await axios.get("http://localhost:8000/get_user", {
            headers: {
              Authorization: accessToken,
            },
            withCredentials: true,
          });

          if (response.status !== 200) {
            nav("/login");
          }

          login(response.data.user, accessToken);
        } catch (err) {
          setError(err.message);
          console.error("Error fetching user data:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, nav]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Settings</h1>
      <div>User name: {user ? user.name : "No user"}</div>
    </div>
  );
};

export default UserSettings;
