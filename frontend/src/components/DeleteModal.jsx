import React from 'react';
import '../styles/components/AllPopup.css';

const DeleteModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box">
        <h2 className="popup-title">Delete Analysis</h2>
        <p className="popup-message">Are you sure you want to delete this analysis? This action cannot be undone.</p>
        <div className="popup-buttons">
          <button className="popup-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-btn logout" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;