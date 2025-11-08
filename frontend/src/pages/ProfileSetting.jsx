import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import '../index.css';
import "../styles/ProfileSetting.css";
import Container from "../components/Container.jsx";
import LogoutPopup from "../components/LogoutPopup.jsx";
import ChangePasswordPopup from "../components/ChangePasswordPopup.jsx";
import { User } from "lucide-react"
import { Settings } from "lucide-react"
import { Users } from "lucide-react"
import { Pencil } from "lucide-react"
import { ScrollText } from "lucide-react"
import { Moon } from "lucide-react"
import { Trash2 } from "lucide-react"
import { LogOut } from "lucide-react"

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
          <div className="profile-title">
            <User />
            <h3>Profile Information</h3>
          </div>

            <div className="profile-left">
              <User className="profile-avatar" />
              <div className="profile-info">
                <h1>{userData ? userData.name : "Full Name"}</h1>
                <h3><em>{userData ? userData.email : "example@email.com"}</em></h3>
              </div>
            </div>
          </div>
        </div>

        {/* Settings card */}
        <div className="settings-card">
          <div className="settings-title">
            <Settings />
            <h3>Settings</h3>
          </div>

          <div className="settings-grid">
            <button className="settings-btn about" onClick={() => navigate("/about-us")}>
              <div className="btn-content">
                <div className="btn-left">
                  <Users />
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
                  <Pencil />
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
                  <ScrollText />
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
                  <Moon />
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
                  <Trash2 />
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
                  <LogOut />
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
