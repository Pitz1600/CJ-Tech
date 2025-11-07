import React from 'react';
import '../styles/components/AllPopup.css';

const BackModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box">
        <h2 className="popup-title">Go Back</h2>
        <p className="popup-message">Are you sure you want to go back? Changes cannot be saved.</p>
        <div className="popup-buttons">
          <button className="popup-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-btn logout" onClick={onConfirm}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackModal;