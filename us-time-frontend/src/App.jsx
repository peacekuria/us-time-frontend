// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import Assessment from './components/Assessment';
import DisorderSearch from './components/DisorderSearch';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [loading, setLoading] = useState(false);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setLoading(true);
    setActiveTab(tabId);
    
    // Simulate loading for smoother transition
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  // Render current tab content
  const renderTabContent = () => {
    if (loading) {
      return <LoadingSpinner message="Loading content..." />;
    }

    switch(activeTab) {
      case 'assessment':
        return <Assessment />;
      case 'disorders':
        return <DisorderSearch />;
      case 'about':
        return (
          <div className="about-container">
            <div className="about-content">
              <h2 className="about-title">About Mental Wellness Checker</h2>
              
              <div className="about-section">
                <h3>Our Mission</h3>
                <p>
                  Mental Wellness Checker is designed to provide accessible mental health 
                  assessment tools and resources. Our goal is to help individuals better 
                  understand their mental wellbeing and find appropriate resources.
                </p>
              </div>
              
              <div className="about-section">
                <h3>How It Works</h3>
                <ul>
                  <li>Take a confidential mental health assessment</li>
                  <li>Receive personalized results and recommendations</li>
                  <li>Learn about different mental health conditions</li>
                  <li>Find treatment options and resources</li>
                </ul>
              </div>
              
              <div className="about-section">
                <h3>Important Information</h3>
                <div className="disclaimer-box">
                  <strong>Disclaimer:</strong> This tool is for informational purposes only 
                  and is not a substitute for professional medical advice, diagnosis, or treatment. 
                  Always seek the advice of qualified mental health providers.
                </div>
              </div>
              
              <div className="about-section">
                <h3>Need Immediate Help?</h3>
                <p>
                  If you're experiencing a mental health crisis, please contact emergency 
                  services or a crisis hotline immediately.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <Assessment />;
    }
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
          
          <div className="content-wrapper">
            {renderTabContent()}
          </div>
          
          <footer className="footer">
            <div className="footer-content">
              <p className="footer-text">
                Mental Wellness Checker ©️ {new Date().getFullYear()} | Educational Purpose
              </p>
              <p className="footer-disclaimer">
                This application is for informational purposes only and does not provide 
                medical advice, diagnosis, or treatment.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;