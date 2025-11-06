import React, { useState, useContext } from "react";
import "../styles/components/ChangePasswordPopup.css";
import { Save } from "lucide-react";
import { AppContext } from "../context/AppContext";

const ChangePasswordPopup = ({ onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { changePassword } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    const success = await changePassword(currentPassword, newPassword);
    if (success) onCancel();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2 className="popup-title">Change password</h2>

        <form onSubmit={handleSubmit} className="popup-form">
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="popup-btn save">
            Save Changes <Save size={18} />
          </button>
        </form>

        <button className="popup-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;