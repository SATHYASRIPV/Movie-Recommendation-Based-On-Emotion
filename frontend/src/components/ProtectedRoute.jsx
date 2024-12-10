import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 
import axios from "axios";
import { ACCESS_TOKENS, REFRESH_TOKENS } from "../constants";

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKENS);
  if (!refreshToken) {
    console.error("No refresh token available.");
    return false;
  }
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem(ACCESS_TOKENS, response.data.access);
    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
};

export const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  

  const checkAuth = async () => {
    const isValid = await validateToken();
    setIsAuthorized(isValid);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
};

export const validateToken = async () => {
  const token = localStorage.getItem(ACCESS_TOKENS);
  if (!token) {
    console.error("No access token available.");
    return false;
  }
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      console.warn("Access token has expired. Attempting to refresh...");
      return await refreshAccessToken();
    }
    return true;
  } catch (error) {
    console.error("Failed to decode or validate token:", error);
    return false;
  }
};
