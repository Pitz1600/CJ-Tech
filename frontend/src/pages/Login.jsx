import React, { useContext, useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <button
            className="icon-back-btn"
            onClick={() => navigate("/")}
            aria-label="Back to Home"
          >
            <ArrowLeft />
          </button>
          <div className="logo-circle">
            <img
              src="/src/assets/cj-tech-logo.png"
              alt="Logo"
              className="logo-icon"
            />
          </div>
          <h2 className="app-name">CJ Tech</h2>
          <p className="app-desc">App for ...</p>
          <p className="login-note">Login to Continue</p>
        </div>

        <div className="login-right">
          <form onSubmit={onSubmitLogin}>
            <div className="form-group">
              <label>Email address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-row">
              <a href="/reset-password">Forgot Password?</a>
            </div>

            <div className="button-group">
              <button type="submit" className="btn-login">
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="btn-register"
              >
                Create New Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
