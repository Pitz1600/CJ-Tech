import React from 'react';
import '../styles/components/AllPopup.css';

const BackModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box">
        <h1 className="popup-title">Go Back</h1>
        <h2 className="popup-message">Are you sure you want to go back? Changes cannot be saved.</h2>
        <div className="popup-buttons">
          <button className="popup-btn safe" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-btn warn" onClick={onConfirm}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackModal;