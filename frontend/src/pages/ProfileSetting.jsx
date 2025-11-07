import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/ProfileSetting.css";
import userIcon from "../assets/user.png";
import Container from "../components/Container.jsx";
import LogoutPopup from "../components/LogoutPopup.jsx";
import ChangePasswordPopup from "../components/ChangePasswordPopup.jsx";
import aboutIcon from "../assets/icon_about.png";
import changeIcon from "../assets/icon_change.png";
import deleteIcon from "../assets/icon_delete.png";
import logoutIcon from "../assets/icon_logout.png";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/change-password`, {
        newPassword,
      });
      if (data.success) {
        toast.success("Password changed successfully!");
        setShowChangePasswordPopup(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <Container>
        {/* Top profile card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-left">
              <img src={userIcon} alt="User" className="profile-avatar" />
              <div className="profile-info">
                <h2>{userData ? userData.name : "Full Name"}</h2>
                <p>{userData ? userData.email : "example@email.com"}</p>
              </div>
            </div>
            {/* <button type="button" className="edit-profile-btn">Edit Profile</button> */}
          </div>
        </div>

        {/* Settings card */}
        <div className="settings-card">
          <div className="settings-title">
            <span className="settings-gear" aria-hidden>⚙️</span>
            <h3>Settings</h3>
          </div>

          <div className="settings-grid">
            <button className="settings-btn about" onClick={() => navigate("/about-us")}>
              <div className="btn-content">
                <div className="btn-left">
                  <img src={aboutIcon} alt="About" className="btn-icon" />
                  <div className="btn-text">
                    <div className="btn-title">About Us</div>
                    <div className="btn-subtitle">Learn more about our platform</div>
                  </div>
                </div>
                <span className="chevron" aria-hidden>›</span>
              </div>
            </button>

            <button
              className="settings-btn change"
              onClick={() => setShowChangePasswordPopup(true)}
            >
              <div className="btn-content">
                <div className="btn-left">
                  <img src={changeIcon} alt="Change" className="btn-icon" />
                  <div className="btn-text">
                    <div className="btn-title">Change Password</div>
                    <div className="btn-subtitle">Update your security credentials</div>
                  </div>
                </div>
                <span className="chevron" aria-hidden>›</span>
              </div>
            </button>

            <button className="settings-btn privacy" onClick={() => navigate("/privacy-policy")}>
              <div className="btn-content">
                <div className="btn-left">
                  <img src="" alt="Privacy" className="btn-icon" />
                  <div className="btn-text">
                    <div className="btn-title">Privacy Policy</div>
                    <div className="btn-subtitle">View our privacy terms</div>
                  </div>
                </div>
                <span className="chevron" aria-hidden>›</span>
              </div>
            </button>

            <button className="settings-btn dark">
              <div className="btn-content">
                <div className="btn-left">
                  <img src="" alt="Dark" className="btn-icon" />
                  <div className="btn-text">
                    <div className="btn-title">Dark Mode</div>
                    <div className="btn-subtitle">Toggle dark theme</div>
                  </div>
                </div>
                <span className="toggle-mock" aria-hidden></span>
              </div>
            </button>

            <button className="settings-btn delete">
              <div className="btn-content">
                <div className="btn-left">
                  <img src={deleteIcon} alt="Delete" className="btn-icon" />
                  <div className="btn-text">
                    <div className="btn-title">Delete Account</div>
                    <div className="btn-subtitle">Permanently remove your account</div>
                  </div>
                </div>
                <span className="chevron" aria-hidden>›</span>
              </div>
            </button>

            <button className="settings-btn logout" onClick={() => setShowPopup(true)}>
              <div className="btn-content">
                <div className="btn-left">
                  <img src={logoutIcon} alt="Logout" className="btn-icon" />
                  <div className="btn-text">
                    <div className="btn-title">Logout</div>
                    <div className="btn-subtitle">Sign out from your account</div>
                  </div>
                </div>
                <span className="chevron" aria-hidden>›</span>
              </div>
            </button>
          </div>
        </div>
      </Container>

      {showPopup && (
        <LogoutPopup onConfirm={handleLogout} onCancel={() => setShowPopup(false)} />
      )}

      {showChangePasswordPopup && (
        <ChangePasswordPopup
          onCancel={() => setShowChangePasswordPopup(false)}
          onSave={handlePasswordChange}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
