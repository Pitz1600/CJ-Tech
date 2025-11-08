import React from 'react';
import '../styles/components/AllPopup.css';

const DeleteModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box">
        <h1 className="popup-title">Delete Analysis</h1>
        <h2 className="popup-message">Are you sure you want to delete this analysis? This action cannot be undone.</h2>
        <div className="popup-buttons">
          <button className="popup-btn safe" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-btn warn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;