import React, { useEffect, useState } from 'react';
import { healthService } from '../services/api';
import './Header.css';

const Header = () => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const health = await healthService.checkHealth();
        setApiStatus('healthy');
      } catch (error) {
        setApiStatus('unhealthy');
      }
    };

    checkApiHealth();
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-icon">🧠</span>
          <h1 className="header-title">Mental Wellness Checker</h1>
        </div>
        
        <div className="header-subtitle">
          <p>Assess your mental health and find helpful resources</p>
          
          <div className="api-status">
            <span className={`status-dot ${apiStatus}`}></span>
            <span className="status-text">
              {apiStatus === 'healthy' ? 'API Connected' : 
               apiStatus === 'unhealthy' ? 'API Disconnected' : 
               'Checking API...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;