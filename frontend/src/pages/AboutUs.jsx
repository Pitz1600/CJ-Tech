import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/AboutUs.css";
import Container from "../components/Container.jsx";
import logo from "../assets/cj-tech-logo.png";
import backIcon from "../assets/icon_back.png";

const AboutUs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.state?.page || "about"; // default to About page

  return (
    <div className="aboutus-container">
      <Container>
        {/* Header */}
        <div className="aboutus-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <img src={backIcon} alt="Back" className="back-icon" />
          </button>
          <h1 className="aboutus-title">
            {page === "privacy" ? "Privacy Policy" : "About Us"}
          </h1>
        </div>

        {/* ✅ About Us Layout */}
        {page === "about" && (
          <>
            <div className="aboutus-logo">
              <img src={logo} alt="PureText Logo" />
            </div>

            <div className="aboutus-card">
              <h2>About PureText</h2>
              <p>
                It is designed to identify and flag biased or discriminatory texts in online/offline settings.
                The system ensures that all text undergoes spelling and grammatical correction before bias analysis, improving detection accuracy and readability.
              </p>

              <h2>Our Purpose</h2>
              <p>
                Its purpose is to promote healthier digital communication by detecting potentially prejudiced language using Natural Language Processing (NLP).
              </p>

              <h2>LLM Model</h2>
              <p>
                gpt-oss:120b-cloud
              </p>

              <h2>Contact Us</h2>
              <p>Reach out to us at example@email.com</p>
            </div>
          </>
        )}

        {/* ✅ Privacy Policy Layout */}
        {page === "privacy" && (
          <div className="privacy-card">
            <h2>Privacy Policy</h2>
            <p>
              At PureText, we value your privacy and are committed to protecting
              your personal information. This policy explains how we collect, use,
              and safeguard your data when using our services.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We may collect limited personal information (such as name and email)
              to provide better user experiences and maintain account security.
            </p>

            <h2>How We Use Your Information</h2>
            <p>
              We use collected information solely to enhance platform functionality,
              personalize your experience, and ensure service reliability.
            </p>

            <h2>Your Consent</h2>
            <p>
              By using PureText, you consent to this privacy policy. You can request
              data removal anytime by contacting us at privacy@puretext.com.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AboutUs;
