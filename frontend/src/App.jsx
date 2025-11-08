import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import './index.css';
import './styles/components/Navbar.css';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Register from "./pages/Register.jsx";
import Create from "./pages/Create.jsx";
import History from "./pages/History.jsx";
import ProfileSettings from "./pages/ProfileSetting.jsx"; 
import AboutUs from "./pages/AboutUs.jsx";
import { AppContext } from "./context/AppContext.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";

const App = () => {
  const { isLoggedIn, loading } = useContext(AppContext);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Default route: always go to home */}
        <Route path="/" element={<Home />} />

        {/* Auth-related routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/create"
          element={isLoggedIn ? <Create /> : <Navigate to="/" />}
        />
        <Route
          path="/history"
          element={isLoggedIn ? <History /> : <Navigate to="/" />}
        />
        <Route
          path="/profile-settings"
          element={isLoggedIn ? <ProfileSettings /> : <Navigate to="/" />}
        />

        {/* Public routes */}
        <Route path="/about-us" element={<AboutUs />} />  

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;