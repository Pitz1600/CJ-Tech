import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import '../index.css';
import '../styles/components/Navbar.css';
import logo from "../assets/cj-tech-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, backendUrl, setUserData, setIsLoggedIn, isLoggedIn } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Extract first letter of user's name or username
  const firstLetter =
    userData?.name?.[0]?.toUpperCase() ||
    userData?.username?.[0]?.toUpperCase() ||
    "?";

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Create", path: "/create" },
    { name: "History", path: "/history" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div
          onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}
          className="nav-logo"
        >
          <img src={logo} alt="Logo" className="logo-img" />
        </div>

        {/* Desktop Links */}
        {userData?.isAccountVerified && (
          <div className="nav-links">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
                className={isActive(item.path) ? "active" : ""}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}

        {/* Profile Initial */}
        {!isLoggedIn ? (
          <button
          className={`nav-login-initial ${isActive("/login") ? "active" : ""}`}
          onClick={() => {
            navigate("/login");
            setMenuOpen(false);
          }}
          aria-label="Login"
        >
          Login
        </button>
        ) : (
          <button
          className={`nav-profile-initial ${isActive("/profile-settings") ? "active" : ""}`}
          onClick={() => {
            navigate("/profile-settings");
            setMenuOpen(false);
          }}
          aria-label="Profile Settings"
        >
          {firstLetter}
        </button>)}

        {/* Hamburger (mobile) */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && userData?.isAccountVerified && (
        <div className="mobile-menu">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
              className={isActive(item.path) ? "active" : ""}
            >
              {item.name}
            </button>
          ))}

          <button
            onClick={() => {
              navigate("/profile-settings");
              setMenuOpen(false);
            }}
            className={`mobile-profile ${isActive("/profile-settings") ? "active" : ""}`}
          >
            Profile
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
