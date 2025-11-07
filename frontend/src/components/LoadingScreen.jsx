import React from 'react';
import '../styles/components/LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="loading-bg">
        <img src="/src/assets/cj-tech-logo.png" alt="App Logo" className="loading-logo" />
      </div>

      <div className="loading-text"><strong>Loading...</strong></div>
    </div>
  );
};

export default LoadingScreen;
