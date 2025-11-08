import React from "react";
import '../index.css';
import "../styles/components/AllPopup.css";
import logoImg from "../assets/cj-tech-logo.png"; 

const LogoutPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
          <div className="popup-logo">
          <img src={logoImg} alt="Logo" />
          </div>
        <h1 className="popup-title">CJ Tech</h1>
        <h2 className="popup-message">Are you sure you want to log out?</h2>
        <div className="popup-buttons">
          <button className="popup-btn safe" onClick={onCancel}>
            Cancel
          </button>
          <button className="popup-btn warn" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
