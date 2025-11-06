import React, { useContext, useState, useEffect } from 'react';
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Home.css';
import '../index.css';
import Container from '../components/Container.jsx';

const Home = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, isLoggedIn } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState({ biased: 0, neutral: 0, unclear: 0 });
  const [lineChartData, setLineChartData] = useState([]);
  const [hasData, setHasData] = useState(false);

  // Send verification OTP
  const sendVerificationOtp = async () => {
    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
        userId: userData.id,
      });

      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all analyses
  const fetchAnalyses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/analysis`, {
        withCredentials: true,
      });

      if (data.success && data.analyses) {
        setAnalyses(data.analyses);
        computeStats(data.analyses);
        setLineChartData(computeLineChartData(data.analyses || []));
      } else {
        setAnalyses([]);
        setStats({ biased: 0, neutral: 0, unclear: 0 });
        setHasData(false);
      }
    } catch (error) {
      console.error("Failed to fetch analyses:", error);
      setAnalyses([]);
      setStats({ biased: 0, neutral: 0, unclear: 0 });
      setHasData(false);
    }
  };

  // Compute stats same as Dashboard
  const computeStats = (analysesData) => {
    let biased = 0, neutral = 0, unclear = 0;

    analysesData.forEach(a => {
      a.results.forEach(r => {
        const category = r.category?.toLowerCase();
        if (category === "biased") biased++;
        else if (category === "neutral") neutral++;
        else unclear++;
      });
    });

    setStats({ biased, neutral, unclear });
    setHasData(biased + neutral + unclear > 0);
  };

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      fetchAnalyses();
    }
  }, [isLoggedIn, userData]);

  // Dynamic PieChart data
  const chartData = [
    { name: "Biased", value: stats.biased, color: "#FF7F7F" || 1 },
    { name: "Neutral", value: stats.neutral, color: "#00FF00" || 1 },
    { name: "Unclear", value: stats.unclear, color: "#FFFF00" || 1 },
  ];

  return (
    <div className="home-container">
      <Navbar />

      {!isLoggedIn ? (
        <Container>
          <div className="intro-tips-wrapper">
            <div className="intro-section">
              <img src="/src/assets/cj-tech-logo.png" alt="App Logo" className="intro-logo" />
              <h1>PureText</h1>
              <h2>App for Identifying Biased Language</h2>
              <br />
              <button
                className="nav-login-btn"
                style={{ marginTop: 24 }}
                onClick={() => navigate("/login")}
              >
                Login to Get Started
              </button>
            </div>

            <div className="dashboard-card tips-card">
            </div>
          </div>
        </Container>
      ) : !userData.isAccountVerified ? (
        <Container>
          <div className="verify-email-section">
            <img src="/src/assets/cj-tech-logo.png" alt="App Logo" />
            <h1>Hey {userData?.name || 'User'}!</h1>
            <p>Please verify your email to continue.</p>
            <button onClick={sendVerificationOtp} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Verify Email'}
            </button>
          </div>
        </Container>
      ) : (
        <Container>
          <div className="dashboard-wrapper">
            <h2>Welcome, <span>{userData?.name || 'User'}</span>!</h2>

            <div className="dashboard-grid">
              <div className="dashboard-card recent-activity">
                <h3>Recent Activity</h3>
                {hasData ? (
                  <>
                    {analyses.slice(0, 3).map((a, i) => {
                      const firstResult = a.results?.[0] || {};
                      const category = firstResult.category || "Category";
                      const score = firstResult.sentiment_score ?? "N/A";
                      const dateTime = new Date(a.date)
                      .toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(",", "");

                      return (
                        <div
                          key={i}
                          className="activity-item"
                          onClick={() => navigate("/history", {
                            state: { selectedAnalysis: a }, // pass the full analysis object
                          })}
                        >
                          <p className='item-prompt'>{a.prompt}</p>
                          <p className='item-details'>
                            <strong>Category:</strong> {category} &nbsp;|&nbsp; 
                            <strong>Score:</strong> {score} <br/> 
                            <strong>Date:</strong> {dateTime}
                          </p>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p>
                    No analyzed text yet.<br />
                    <StartAnalyzingButton onClick={() => navigate("/analyzer")} />
                  </p>
                )}
              </div>

              <div className="dashboard-card usage-stats">
                <h3>Usage Statistics</h3>
                {hasData ? (
                  <>
                <span style={{cursor: "pointer"}} onClick={() => navigate('/dashboard')}><PieChartElement data={chartData} /></span>
                <div></div>
                  </>
                ) : (
                  <>
                    <p>No statistics yet.</p>
                  </>
                )}
              </div>

              <div className="dashboard-card tips-card">
                <TipsContent />
              </div>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default Home;
