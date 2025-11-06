import React from 'react';
import '../styles/components/LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-track"></div>
        <div className="spinner-active"></div>
      </div>

      <div className="loading-text"><strong>Loading...</strong></div>
    </div>
  );
};

export default LoadingScreen;
